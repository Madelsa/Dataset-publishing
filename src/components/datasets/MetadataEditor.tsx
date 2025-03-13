/**
 * Metadata Editor Component
 * 
 * Provides a user interface for editing dataset metadata:
 * - Displays AI-generated metadata suggestions
 * - Allows editing of title, description, tags, and category
 * - Supports multiple languages (English and Arabic)
 * - Enables saving metadata drafts
 * - Provides language switching functionality
 * 
 * Uses the MetadataContext for state management and API interactions.
 * 
 * @param datasetId - The ID of the dataset being edited
 */

'use client';

import { useState, useEffect } from 'react';
import { useMetadata } from '@/app/context/MetadataContext';
import { FiSave, FiGlobe, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface MetadataEditorProps {
  datasetId: string;
}

export default function MetadataEditor({ datasetId }: MetadataEditorProps) {
  const { state, dispatch, generateMetadata, saveDraft } = useMetadata();
  const [initialLoad, setInitialLoad] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  /**
   * Load initial metadata from the API on component mount
   * Fetches both suggested and draft metadata if available
   */
  useEffect(() => {
    if (initialLoad && datasetId) {
      // Load metadata from API
      const fetchMetadata = async () => {
        try {
          const response = await fetch(`/api/datasets/${datasetId}/metadata`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch metadata');
          }
          
          const data = await response.json();
          
          // Update the state with fetched metadata
          dispatch({ type: 'SET_SUGGESTED', payload: data.metadata.suggested });
          
          if (data.metadata.draft) {
            dispatch({ type: 'SET_DRAFT', payload: data.metadata.draft });
          } else if (data.metadata.suggested?.title) {
            // If no draft but suggestions exist, create a draft from suggestions
            dispatch({ type: 'SET_DRAFT', payload: data.metadata.suggested });
          }
          
          dispatch({ type: 'SET_LANGUAGE', payload: data.metadata.language as 'en' | 'ar' });
          dispatch({ type: 'SET_STATUS', payload: data.metadata.status as any });
        } catch (error) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: error instanceof Error ? error.message : 'Failed to load metadata'
          });
        }
        
        setInitialLoad(false);
      };
      
      fetchMetadata();
    }
  }, [datasetId, initialLoad, dispatch]);
  
  /**
   * Handle form submission to save the current draft
   * Prevents default form submission and calls the saveDraft function
   */
  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDraft(datasetId);
    
    // Show success message
    setSaveSuccess(true);
    
    // Redirect to the datasets page after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };
  
  /**
   * Handle language change for metadata
   * Updates the language in the context and regenerates metadata
   * 
   * @param language - The language to switch to ('en' or 'ar')
   */
  const handleLanguageChange = (language: 'en' | 'ar') => {
    // Only proceed if the selected language is different from the current one
    if (language !== state.language) {
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      
      // Set loading state to indicate regeneration is happening
      setSaveSuccess(false);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Generate new metadata for the selected language
      generateMetadata(datasetId, language);
    }
  };
  
  /**
   * Trigger regeneration of metadata using AI
   * Uses the current language setting
   */
  const handleRegenerateMetadata = () => {
    generateMetadata(datasetId, state.language);
  };
  
  /**
   * Update a specific field in the draft metadata
   * 
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const updateDraftField = (field: string, value: any) => {
    dispatch({ 
      type: 'UPDATE_DRAFT', 
      payload: { [field]: value }
    });
  };
  
  /**
   * Add a new tag to the tags list
   * Validates that the tag is not empty and not already in the list
   */
  const addTag = () => {
    if (!state.draft) return;
    
    const tag = tagInput.trim();
    if (!tag) return;
    
    const currentTags = state.draft.tags || [];
    if (!currentTags.includes(tag)) {
      updateDraftField('tags', [...currentTags, tag]);
    }
    
    setTagInput('');
  };
  
  /**
   * Remove a tag from the tags list
   * 
   * @param index - The index of the tag to remove
   */
  const removeTag = (index: number) => {
    if (!state.draft?.tags) return;
    
    const newTags = [...state.draft.tags];
    newTags.splice(index, 1);
    updateDraftField('tags', newTags);
  };
  
  return (
    <div className={`w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md ${state.language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {state.language === 'ar' ? 'محرر البيانات الوصفية' : 'Metadata Editor'}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              state.language === 'en' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <FiGlobe className="inline-block mr-1 h-4 w-4" />
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              state.language === 'ar' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <FiGlobe className="inline-block mr-1 h-4 w-4" />
            العربية
          </button>
        </div>
      </div>
      
      {state.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-800">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          {state.error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <div className="flex items-start space-x-3">
            <FiSave className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800">
                Metadata saved successfully! Redirecting to datasets page...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {state.isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSaveDraft}>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {state.language === 'ar' ? 'العنوان' : 'Title'}
              </label>
              <input
                type="text"
                value={state.draft?.title || ''}
                onChange={(e) => updateDraftField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={state.language === 'ar' ? 'أدخل عنوانًا' : 'Enter title'}
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {state.language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                value={state.draft?.description || ''}
                onChange={(e) => updateDraftField('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={state.language === 'ar' ? 'أدخل وصفًا' : 'Enter description'}
              />
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {state.language === 'ar' ? 'العلامات' : 'Tags'}
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {state.draft?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={state.language === 'ar' ? 'أضف علامة' : 'Add a tag'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  {state.language === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {state.language === 'ar' ? 'الفئة' : 'Category'}
              </label>
              <input
                type="text"
                value={state.draft?.category || ''}
                onChange={(e) => updateDraftField('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={state.language === 'ar' ? 'أدخل الفئة' : 'Enter category'}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleRegenerateMetadata}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center cursor-pointer"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                {state.language === 'ar' ? 'إعادة إنشاء البيانات الوصفية' : 'Regenerate Metadata'}
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center cursor-pointer"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {state.language === 'ar' ? 'حفظ المسودة' : 'Save Draft'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 