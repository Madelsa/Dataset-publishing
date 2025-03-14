/**
 * Filtered Datasets Hook
 * 
 * Custom hook for filtering and sorting datasets
 * Extends the basic useDatasets hook with search and filter capabilities
 */

import { useMemo, useState, useCallback } from 'react';
import { useDatasets } from './useDatasets';
import { Dataset, DatasetListItem } from '@/types/dataset.types';
import { FilterOptions } from '@/components/datasets/SearchAndFilter';

/**
 * Hook for getting filtered and sorted datasets
 * 
 * @returns Object containing the filtered datasets, loading state, error state, filter methods, and metadata statuses
 */
export function useFilteredDatasets() {
  // Get base datasets data using the original hook
  const { datasets, isLoading, error, refetch } = useDatasets();
  
  // Track filter options state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    metadataStatus: 'ALL',
    sortBy: 'newest',
  });
  
  // Apply filters and sorting to datasets
  const filteredDatasets = useMemo(() => {
    if (!datasets.length) return [];
    
    // Start with all datasets
    let result = [...datasets];
    
    // Apply search filter (by name or description)
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      result = result.filter(dataset => 
        dataset.name.toLowerCase().includes(searchLower) || 
        (dataset.description && dataset.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply metadata status filter
    if (filterOptions.metadataStatus !== 'ALL') {
      result = result.filter(dataset => {
        // Handle special case for REJECTED (which is a publication status)
        if (filterOptions.metadataStatus === 'REJECTED') {
          return 'publicationStatus' in dataset && dataset.publicationStatus === 'REJECTED';
        }
        
        // Regular metadata status filtering
        if ('metadataStatus' in dataset) {
          return dataset.metadataStatus === filterOptions.metadataStatus;
        }
        
        // For DatasetListItem, we only have hasMetadata, so do our best approximation
        if ('hasMetadata' in dataset) {
          // If filtering for NEEDS METADATA, show items without metadata
          if (filterOptions.metadataStatus === 'NEEDS METADATA') {
            return !dataset.hasMetadata;
          }
          // For other statuses, show items with metadata (not perfect but best approximation)
          return dataset.hasMetadata;
        }
        
        return false;
      });
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Descending (newest first)
        });
        break;
        
      case 'oldest':
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB; // Ascending (oldest first)
        });
        break;
        
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical
        break;
    }
    
    return result;
  }, [datasets, filterOptions]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((options: FilterOptions) => {
    setFilterOptions(options);
  }, []);
  
  return {
    datasets: filteredDatasets,
    isLoading,
    error,
    refetch,
    filterOptions,
    handleFilterChange,
  };
} 