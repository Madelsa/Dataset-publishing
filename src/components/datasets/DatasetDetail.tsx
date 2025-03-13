/**
 * Dataset Detail Component
 * 
 * Displays comprehensive information about a dataset.
 * This is a container component that assembles various pieces of the dataset display.
 */

'use client';

import { useState } from 'react';
import { FiAlertCircle, FiMessageCircle } from 'react-icons/fi';
import { Dataset } from '@/types/dataset.types';

// Import modular components
import FileInformation from './detail/FileInformation';
import MetadataSection from './detail/MetadataSection';
import ActionButtons from './detail/ActionButtons';

interface DatasetDetailProps {
  dataset: Dataset;
  isReviewer?: boolean;
}

export default function DatasetDetail({ dataset, isReviewer = false }: DatasetDetailProps) {
  const [datasetState, setDatasetState] = useState<Dataset>(dataset);
  const [error, setError] = useState<string | null>(null);
  
  const {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    fileMetadata,
    metadataDraft,
    reviewComment
  } = datasetState;

  // Determine if dataset has metadata
  const hasMetadata = !!metadataDraft?.title || !!metadataDraft?.description;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
            </div>
            
            <ActionButtons 
              datasetId={id}
              hasMetadata={hasMetadata}
            />
          </div>
        </div>
        
        {error && (
          <div className="px-6 py-3 bg-red-50">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {reviewComment && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start space-x-3">
              <FiMessageCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-blue-800">Reviewer Comment</h3>
                <p className="mt-1 text-sm text-blue-700">{reviewComment}</p>
              </div>
            </div>
          </div>
        )}
        
        <FileInformation 
          fileMetadata={fileMetadata}
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
        
        <MetadataSection metadata={metadataDraft} />
      </div>
    </div>
  );
} 