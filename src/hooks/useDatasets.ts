/**
 * Datasets Hook
 * 
 * Custom hook for fetching and managing the list of datasets
 * Provides loading, error, and refetching capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import { DatasetListItem } from '@/types/dataset.types';
import { datasetsApi } from '@/services/api/datasets';

/**
 * Hook for fetching and managing all datasets
 * 
 * @returns Object containing the datasets array, loading state, error state, and refetch function
 */
export function useDatasets() {
  const [datasets, setDatasets] = useState<DatasetListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDatasets = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const data = await datasetsApi.getAllDatasets();
      setDatasets(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);
  
  return { 
    datasets, 
    isLoading, 
    error, 
    refetch: fetchDatasets 
  };
} 