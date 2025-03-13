'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Dataset } from '@/types/dataset.types';
import PageLayout from '@/components/layout/PageLayout';
import DatasetDetail from '@/components/datasets/DatasetDetail';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * Dataset Detail Page Component
 * 
 * Displays detailed information about a specific dataset:
 * - Shows dataset name, description, and file information
 * - Displays metadata if available
 * - Provides options to download the file or edit metadata
 * 
 * The page fetches the dataset by ID from the API and
 * uses the DatasetDetail component to display the information.
 * 
 * @param params.id - The dataset ID from the URL
 */
export default function DatasetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.id as string;
  
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDataset();
  }, [datasetId]);
  
  const fetchDataset = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch(`/api/datasets/${datasetId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dataset');
      }
      
      const data = await response.json();
      setDataset(data.dataset);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </PageLayout>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <PageLayout>
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-red-800 mb-1">Error Loading Dataset</h2>
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={fetchDataset}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Go Back to Datasets
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Render not found state
  if (!dataset) {
    return (
      <PageLayout>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-yellow-800 mb-1">Dataset Not Found</h2>
              <p className="text-sm text-yellow-700">
                The requested dataset could not be found. It may have been deleted or the ID is incorrect.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Go Back to Datasets
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Render normal state with dataset
  return (
    <PageLayout 
      title={dataset.name}
      description={dataset.description || undefined}
    >
      <DatasetDetail dataset={dataset} />
    </PageLayout>
  );
} 