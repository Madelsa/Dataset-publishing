'use client';

import { useState, useEffect } from 'react';
import { Dataset } from '@/types/dataset.types';
import PageLayout from '@/components/layout/PageLayout';
import DatasetGrid from '@/components/datasets/DatasetGrid';
import Link from 'next/link';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

/**
 * Home Page Component
 * 
 * Displays a grid of all available datasets with options to:
 * - View dataset details
 * - Upload new datasets
 * - Delete existing datasets
 * 
 * Fetches dataset data from the API and handles state management
 * for loading, errors, and dataset deletion.
 */
export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch('/api/datasets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }
      
      const data = await response.json();
      setDatasets(data.datasets);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dataset deletion
  const handleDatasetDeleted = (datasetId: string) => {
    setDatasets(datasets.filter(dataset => dataset.id !== datasetId));
  };

  return (
    <PageLayout 
      title="Datasets"
      description="View and manage your datasets"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          {/* Title and description are now handled by PageLayout */}
        </div>
        
        <Link
          href="/upload"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Upload Dataset
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-red-800 mb-1">Error Loading Datasets</h2>
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchDatasets}
                className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DatasetGrid 
          datasets={datasets} 
          onDatasetDeleted={handleDatasetDeleted}
        />
      )}
    </PageLayout>
  );
}
