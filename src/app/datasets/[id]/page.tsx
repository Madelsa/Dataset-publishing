'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDatasetDetails } from '@/hooks/useDatasetDetails';
import PageLayout from '@/components/layout/PageLayout';
import DatasetDetail from '@/components/datasets/DatasetDetail';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

// TODO: This would come from authentication in a real app
const SIMULATED_IS_REVIEWER = true;

/**
 * Dataset Detail Page Component
 * 
 * Displays detailed information about a specific dataset.
 * This page acts as a container and handles data fetching using the useDatasetDetails hook.
 * 
 * @param params.id - The dataset ID from the URL
 */
export default function DatasetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const datasetId = params.id as string;
  
  // Use our custom hook to fetch dataset data
  const { dataset, isLoading, error, refetch } = useDatasetDetails(datasetId);
  
  // Handle navigation back to datasets list
  const handleBack = () => {
    router.push('/datasets');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Loading dataset..." />
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
          backLabel="Go Back to Datasets"
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
          actionLabel="Go Back to Datasets"
        />
      </PageLayout>
    );
  }
  
  // Render normal state with dataset
  return (
    <PageLayout>
      <DatasetDetail 
        dataset={dataset} 
        isReviewer={SIMULATED_IS_REVIEWER}
      />
    </PageLayout>
  );
} 