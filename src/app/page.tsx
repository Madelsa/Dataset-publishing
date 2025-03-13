'use client';

import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';
import DatasetGrid from '@/components/datasets/DatasetGrid';
import SearchAndFilter from '@/components/datasets/SearchAndFilter';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { useFilteredDatasets } from '@/hooks/useFilteredDatasets';

/**
 * Home Page Component
 * 
 * Displays a grid of all available datasets with options to:
 * - Search and filter datasets
 * - View dataset details
 * - Upload new datasets
 * - Delete existing datasets
 * 
 * Uses the useFilteredDatasets hook for data fetching and filtering.
 */
export default function Home() {
  // Use our custom hook for filtered datasets
  const {
    datasets,
    isLoading,
    error,
    refetch,
    handleFilterChange,
  } = useFilteredDatasets();

  // Handle dataset deletion
  const handleDatasetDeleted = (datasetId: string) => {
    // After deletion, refresh the dataset list
    refetch();
  };

  return (
    <PageLayout 
      title="Datasets"
      description="View and manage your datasets"
    >
      {/* SearchAndFilter component with Upload button */}
      {!isLoading && !error && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <SearchAndFilter 
              onChange={handleFilterChange}
            />
          </div>
          <div className="sm:self-start sm:mt-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Upload Dataset
            </Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Loading datasets..." />
      ) : error ? (
        <ErrorState
          title="Error Loading Datasets"
          message={error}
          onRetry={refetch}
          retryLabel="Try Again"
        />
      ) : (
        <DatasetGrid 
          datasets={datasets} 
          onDatasetDeleted={handleDatasetDeleted}
        />
      )}
    </PageLayout>
  );
}
