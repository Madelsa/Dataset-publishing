/**
 * Dataset Hook
 * 
 * Custom hook for fetching and managing a single dataset
 * Provides loading, error, and refetching capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { Dataset } from '@/types/dataset.types';
import { datasetsApi } from '@/services/api/datasets';

/**
 * Hook for fetching and managing a single dataset
 * 
 * @param datasetId - The ID of the dataset to fetch
 * @returns Object containing the dataset, loading state, error state, and refetch function
 */
export function useDataset(datasetId: string) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDataset = useCallback(async () => {
    if (!datasetId) return;
    
    try {
      setError(null);
      setIsLoading(true);
      
      const data = await datasetsApi.getDataset(datasetId);
      setDataset(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [datasetId]);
  
  useEffect(() => {
    fetchDataset();
  }, [fetchDataset]);
  
  return { 
    dataset, 
    isLoading, 
    error, 
    refetch: fetchDataset 
  };
} 