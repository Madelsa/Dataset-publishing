'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import { useDatasetDetails } from '@/hooks/useDatasetDetails';
import PageLayout from '@/components/layout/PageLayout';
import DatasetDetail from '@/components/datasets/DatasetDetail';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { datasetsApi } from '@/services/api/datasets';

/**
 * Dataset Review Page
 * 
 * Provides a dedicated interface for reviewing datasets:
 * - Shows complete dataset information including metadata
 * - Allows approving or rejecting the dataset
 * - Provides a feedback text area for rejection comments
 */
export default function DatasetReviewPage() {
  const router = useRouter();
  const params = useParams();
  const datasetId = params.id as string;
  
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Use our custom hook to fetch dataset data
  const { dataset, isLoading, error, refetch } = useDatasetDetails(datasetId);
  
  // Handle navigation back to dataset details
  const handleBack = () => {
    router.push(`/datasets/${datasetId}`);
  };
  
  // Handle dataset approval
  const handleApprove = async () => {
    if (!dataset) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      await datasetsApi.publishDataset(datasetId);
      router.push(`/datasets/${datasetId}?approved=true`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to approve dataset');
      setIsSubmitting(false);
    }
  };
  
  // Handle dataset rejection
  const handleReject = async () => {
    if (!dataset) return;
    if (!feedbackText.trim()) {
      setErrorMessage('Please provide feedback for the rejection');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      await datasetsApi.rejectDataset(datasetId, feedbackText);
      router.push(`/datasets/${datasetId}?rejected=true`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to reject dataset');
      setIsSubmitting(false);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Loading dataset for review..." />
      </PageLayout>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          title="Error Loading Dataset"
          message={error}
          onRetry={refetch}
          onBack={handleBack}
          backLabel="Go Back"
        />
      </PageLayout>
    );
  }
  
  // Render not found state
  if (!dataset) {
    return (
      <PageLayout>
        <EmptyState
          title="Dataset Not Found"
          message="The requested dataset could not be found. It may have been deleted or the ID is incorrect."
          onAction={handleBack}
          actionLabel="Go Back"
        />
      </PageLayout>
    );
  }
  
  // Check if dataset is in the correct state for review
  const isReviewable = dataset.metadataStatus === 'EDITED';
  
  return (
    <PageLayout>
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-1 h-4 w-4" />
          Back to Dataset
        </button>
        <h1 className="text-2xl font-bold mt-4">Review Dataset</h1>
        <p className="text-gray-600">Review and approve or reject this dataset.</p>
      </div>
      
      {!isReviewable && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This dataset is not in a reviewable state. Only datasets with "Pending Review" status can be reviewed.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Display the dataset details */}
      <div className="mb-8">
        <DatasetDetail dataset={dataset} isReviewer={true} />
      </div>
      
      {/* Review actions panel */}
      {isReviewable && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Review Decision</h2>
          
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (required for rejection)
            </label>
            <textarea
              id="feedback"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide feedback about this dataset..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              Approve Dataset
            </button>
            
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
            >
              <FiX className="mr-2 h-4 w-4" />
              Reject Dataset
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
} 