import { Dataset, DatasetListItem } from '@/types/dataset.types';
import { MetadataStatus } from '@/types/metadata.types';
import { DisplayStatus } from '@/components/datasets/StatusBadge';

/**
 * Determines if a dataset has metadata based on its metadata status
 * 
 * @param dataset - The dataset to check
 * @returns True if the dataset has metadata, false otherwise
 */
export function hasMetadata(dataset: Dataset | DatasetListItem): boolean {
  // For Dataset objects
  if ('metadataStatus' in dataset) {
    return dataset.metadataStatus === 'PENDING REVIEW' || 
           dataset.metadataStatus === 'APPROVED' ||
           dataset.metadataStatus === 'REJECTED';
  }
  
  // For DatasetListItem objects
  if ('hasMetadata' in dataset) {
    return dataset.hasMetadata;
  }
  
  return false;
}

/**
 * Determines the display status for a dataset
 * 
 * @param dataset - The dataset to check
 * @returns The standardized display status (NEEDS_METADATA, PENDING_REVIEW, APPROVED, REJECTED)
 */
export function getDisplayStatus(dataset: Dataset | DatasetListItem): DisplayStatus {
  // Check metadata status directly
  if ('metadataStatus' in dataset) {
    // Direct mapping from database values to display status
    switch (dataset.metadataStatus as MetadataStatus) {
      case 'NEEDS METADATA':
        return 'NEEDS_METADATA';
      case 'PENDING REVIEW':
        return 'PENDING_REVIEW';
      case 'APPROVED':
        return 'APPROVED';
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'NEEDS_METADATA'; // Default fallback
    }
  }
  
  // For DatasetListItem objects
  if ('hasMetadata' in dataset) {
    return dataset.hasMetadata ? 'PENDING_REVIEW' : 'NEEDS_METADATA';
  }
  
  return 'NEEDS_METADATA'; // Default fallback
}

/**
 * Enhances a dataset with computed properties
 * 
 * @param dataset - The dataset to enhance
 * @returns The enhanced dataset with computed properties
 */
export function enhanceDataset<T extends Dataset | DatasetListItem>(dataset: T): T & { hasMetadata: boolean, displayStatus: DisplayStatus } {
  return {
    ...dataset,
    hasMetadata: hasMetadata(dataset),
    displayStatus: getDisplayStatus(dataset)
  };
}

/**
 * Enhances an array of datasets with computed properties
 * 
 * @param datasets - The datasets to enhance
 * @returns The enhanced datasets with computed properties
 */
export function enhanceDatasets<T extends Dataset | DatasetListItem>(datasets: T[]): (T & { hasMetadata: boolean, displayStatus: DisplayStatus })[] {
  return datasets.map(dataset => enhanceDataset(dataset));
} 