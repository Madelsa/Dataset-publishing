import { Dataset, DatasetListItem } from '@/types/dataset.types';
import { MetadataStatus, METADATA_STATUS } from '@/types/metadata.types';
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
    // A dataset has metadata if it's in any state other than NEEDS_METADATA
    return dataset.metadataStatus !== METADATA_STATUS.NEEDS_METADATA;
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
      case METADATA_STATUS.NEEDS_METADATA:
        return 'NEEDS_METADATA';
      case METADATA_STATUS.PENDING_REVIEW:
        return 'PENDING_REVIEW';
      case METADATA_STATUS.APPROVED:
        return 'APPROVED';
      case METADATA_STATUS.REJECTED:
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