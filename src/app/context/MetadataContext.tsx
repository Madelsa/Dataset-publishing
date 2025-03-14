/**
 * Metadata Context - State Management for Dataset Metadata
 * 
 * This context provides global state management for dataset metadata operations:
 * - Stores suggested metadata from AI generation
 * - Manages draft metadata being edited by the user
 * - Handles language preferences (English/Arabic)
 * - Provides functions for generating and saving metadata
 * 
 * The context uses React's Context API with useReducer for state management
 * and exposes functions for API interactions related to metadata.
 */

'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { METADATA_STATUS, MetadataStatus } from '@/types/metadata.types';

// Define the metadata state interface
interface MetadataState {
  isLoading: boolean;
  error: string | null;
  language: 'en' | 'ar';
  suggested: {
    title: string;
    description: string;
    tags: string[];
    category: string;
  };
  draft: {
    title: string;
    description: string;
    tags: string[];
    category: string;
  } | null;
  status: MetadataStatus;
}

// Define actions that can be performed on metadata
type MetadataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'SET_SUGGESTED'; payload: any }
  | { type: 'SET_DRAFT'; payload: any }
  | { type: 'UPDATE_DRAFT'; payload: Partial<MetadataState['draft']> }
  | { type: 'SET_STATUS'; payload: MetadataState['status'] }
  | { type: 'RESET' };

// Initial state for metadata
const initialState: MetadataState = {
  isLoading: false,
  error: null,
  language: 'en',
  suggested: {
    title: '',
    description: '',
    tags: [],
    category: ''
  },
  draft: null,
  status: METADATA_STATUS.NEEDS_METADATA
};

/**
 * Reducer function to handle metadata state changes
 * Processes various actions to update the metadata state
 */
function metadataReducer(state: MetadataState, action: MetadataAction): MetadataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SUGGESTED':
      return { ...state, suggested: action.payload };
    case 'SET_DRAFT':
      return { ...state, draft: action.payload };
    case 'UPDATE_DRAFT':
      return {
        ...state,
        draft: state.draft ? { ...state.draft, ...action.payload } : action.payload as any
      };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Create context
interface MetadataContextType {
  state: MetadataState;
  dispatch: React.Dispatch<MetadataAction>;
  generateMetadata: (datasetId: string, language?: 'en' | 'ar') => Promise<void>;
  saveDraft: (datasetId: string) => Promise<void>;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

// Provider component
interface MetadataProviderProps {
  children: ReactNode;
}

/**
 * MetadataProvider Component
 * 
 * Provides the metadata context to all child components
 * Implements the state management and exposes API functions
 * 
 * @param children - Child components that will have access to the context
 */
export function MetadataProvider({ children }: MetadataProviderProps) {
  const [state, dispatch] = useReducer(metadataReducer, initialState);
  
  /**
   * Generate metadata for a dataset using AI
   * 
   * Calls the API to analyze dataset content and generate metadata suggestions
   * Updates the context state with the generated metadata
   * 
   * @param datasetId - ID of the dataset to generate metadata for
   * @param language - Language preference (en/ar) for the generated metadata
   */
  const generateMetadata = async (datasetId: string, language: 'en' | 'ar' = 'en') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Set language in state
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      
      // Call the API to generate metadata
      const response = await fetch(`/api/datasets/${datasetId}/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ language })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate metadata');
      }
      
      const data = await response.json();
      
      // Update state with generated metadata
      dispatch({ type: 'SET_SUGGESTED', payload: data.metadata });
      dispatch({ type: 'SET_STATUS', payload: METADATA_STATUS.NEEDS_METADATA });
      
      // Always update the draft with the new metadata when language changes
      // This ensures draft content is updated with the correct language
      dispatch({ type: 'SET_DRAFT', payload: data.metadata });
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  /**
   * Save the current metadata draft for a dataset
   * 
   * Calls the API to persist the user-edited metadata draft
   * Updates the context state with the saved status
   * 
   * @param datasetId - ID of the dataset to save metadata for
   */
  const saveDraft = async (datasetId: string) => {
    if (!state.draft) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await fetch(`/api/datasets/${datasetId}/metadata`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: state.draft,
          language: state.language
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save metadata draft');
      }
      
      dispatch({ type: 'SET_STATUS', payload: METADATA_STATUS.PENDING_REVIEW });
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <MetadataContext.Provider value={{ state, dispatch, generateMetadata, saveDraft }}>
      {children}
    </MetadataContext.Provider>
  );
}

/**
 * Custom hook to use the metadata context
 * 
 * Provides type-safe access to the metadata context
 * Must be used within a MetadataProvider component
 * 
 * @returns The metadata context with state and functions
 */
export function useMetadata() {
  const context = useContext(MetadataContext);
  
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  
  return context;
} 