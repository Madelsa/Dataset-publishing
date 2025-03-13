/**
 * Dataset Grid Component
 * 
 * Displays a responsive grid of dataset cards:
 * - Renders a card for each dataset in the provided array
 * - Handles dataset deletion with error handling
 * - Shows an empty state when no datasets are available
 * - Displays error messages when deletion fails
 * 
 * Uses the DatasetCard component to render individual dataset cards
 * and provides a callback for dataset deletion.
 * 
 * @param datasets - Array of dataset objects to display
 * @param onDatasetDeleted - Optional callback function when a dataset is deleted
 */

'use client';

import { useState } from 'react';
import { Dataset, DatasetListItem } from '@/types/dataset.types';
import DatasetCard from './DatasetCard';
import { FiAlertCircle } from 'react-icons/fi';

interface DatasetGridProps {
  datasets: Array<Dataset | DatasetListItem>;
  onDatasetDeleted?: (datasetId: string) => void;
}

export default function DatasetGrid({ datasets, onDatasetDeleted }: DatasetGridProps) {
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle dataset deletion
   * 
   * Sends a DELETE request to the API to remove a dataset
   * Handles errors and notifies the parent component on success
   * 
   * @param datasetId - ID of the dataset to delete
   */
  const handleDelete = async (datasetId: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete dataset');
      }
      
      // Notify parent component to update the list
      if (onDatasetDeleted) {
        onDatasetDeleted(datasetId);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the dataset');
    }
  };

  // If there are no datasets, show empty state
  if (datasets.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
        <p className="text-gray-500 mb-6">
          You haven&apos;t uploaded any datasets yet. Get started by uploading your first dataset.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md flex items-start space-x-3">
          <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            onDelete={onDatasetDeleted ? handleDelete : undefined}
          />
        ))}
      </div>
    </div>
  );
} 