import { Dataset, DatasetListItem } from '@/types/dataset.types';
import { MetadataStatus } from '@/types/metadata.types';

/**
 * Determines if a dataset has metadata based on its metadata status
 * 
 * @param dataset - The dataset to check
 * @returns True if the dataset has metadata, false otherwise
 */
export function hasMetadata(dataset: Dataset | DatasetListItem): boolean {
  // For Dataset objects
  if ('metadataStatus' in dataset) {
    return dataset.metadataStatus !== 'PENDING';
  }
  
  // For DatasetListItem objects
  if ('hasMetadata' in dataset) {
    return dataset.hasMetadata;
  }
  
  return false;
}

/**
 * Determines the display status for a dataset, considering both
 * publication status and metadata status
 * 
 * @param dataset - The dataset to check
 * @returns The status to display (REJECTED, APPROVED, EDITED, PENDING)
 */
export function getDisplayStatus(dataset: Dataset | DatasetListItem): string {
  // Check publication status first (for rejected and approved)
  const isRejected = 'publicationStatus' in dataset && dataset.publicationStatus === 'REJECTED';
  const isPublished = 'publicationStatus' in dataset && dataset.publicationStatus === 'PUBLISHED';
  
  // Prioritize publication status over metadata status
  let displayStatus = isRejected 
    ? 'REJECTED' 
    : isPublished 
      ? 'APPROVED' 
      : 'metadataStatus' in dataset 
        ? dataset.metadataStatus 
        : 'hasMetadata' in dataset && dataset.hasMetadata
          ? 'EDITED' // Show as "Pending Review" for DatasetListItem with metadata
          : 'PENDING'; // Show as "Needs Metadata"
  
  // Simplify GENERATED to match our simplified statuses
  if (displayStatus === 'GENERATED') {
    displayStatus = 'PENDING'; // Show as "Needs Metadata"
  }
  
  return displayStatus;
}

/**
 * Enhances a dataset with computed properties
 * 
 * @param dataset - The dataset to enhance
 * @returns The enhanced dataset with computed properties
 */
export function enhanceDataset<T extends Dataset | DatasetListItem>(dataset: T): T & { hasMetadata: boolean, displayStatus: string } {
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
export function enhanceDatasets<T extends Dataset | DatasetListItem>(datasets: T[]): (T & { hasMetadata: boolean, displayStatus: string })[] {
  return datasets.map(dataset => enhanceDataset(dataset));
} 