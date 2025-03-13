/**
 * Dataset Service
 * 
 * Provides functions for interacting with datasets in the database.
 * Handles CRUD operations and specialized queries for dataset management.
 */

import { prisma } from '@/lib/prisma';
import { Dataset, ProcessedFile } from '@/types/dataset.types';
import { MetadataDraft, MetadataSuggestion, MetadataStatus } from '@/types/metadata.types';

/**
 * Common fileMetadata selection pattern used across queries
 */
const FILE_METADATA_INCLUDE = {
  fileMetadata: {
    select: {
      id: true,
      datasetId: true,
      originalName: true,
      fileSize: true,
      fileType: true,
      rowCount: true,
      columnNames: true,
      sampleData: true,
      createdAt: true,
      updatedAt: true
    }
  }
};

/**
 * Create a new dataset
 * 
 * Creates a dataset record in the database with associated file metadata.
 * Sets initial metadata status to PENDING and language to English.
 * 
 * @param name - The name of the dataset
 * @param description - Optional description of the dataset
 * @param fileData - Object containing file metadata information
 * @returns The created dataset with its file metadata
 */
export async function createDataset(
  name: string, 
  description: string, 
  fileData: {
    originalName: string,
    fileSize: number,
    fileType: string,
    processedFile: ProcessedFile
  }
): Promise<Dataset> {
  const result = await prisma.dataset.create({
    data: {
      name,
      description,
      metadataStatus: 'PENDING' as MetadataStatus,
      metadataLanguage: 'en',
      suggestedTags: [],
      fileMetadata: {
        create: {
          originalName: fileData.originalName,
          fileSize: fileData.fileSize,
          fileType: fileData.fileType,
          rowCount: fileData.processedFile.rowCount,
          columnNames: fileData.processedFile.columnNames,
          sampleData: fileData.processedFile.sampleData || undefined,
          // No longer saving fullData as it's not needed for download functionality
        }
      }
    },
    include: {
      fileMetadata: {
        select: {
          id: true,
          datasetId: true,
          originalName: true,
          fileSize: true,
          fileType: true,
          rowCount: true,
          columnNames: true,
          sampleData: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });
  
  return result as unknown as Dataset;
}

/**
 * Get all datasets
 * 
 * Retrieves all datasets from the database, ordered by creation date (newest first).
 * Includes file metadata for each dataset.
 * 
 * @returns Array of all datasets with their file metadata
 */
export async function getAllDatasets(): Promise<Dataset[]> {
  const results = await prisma.dataset.findMany({
    include: {
      fileMetadata: {
        select: {
          id: true,
          datasetId: true,
          originalName: true,
          fileSize: true,
          fileType: true,
          rowCount: true,
          columnNames: true,
          sampleData: true,
          createdAt: true,
          updatedAt: true
          // Intentionally excluding fullData as it's not needed and can cause serialization issues
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return results as unknown as Dataset[];
}

/**
 * Get a dataset by ID
 * 
 * Retrieves a single dataset by its unique identifier.
 * Includes file metadata for the dataset.
 * 
 * @param id - The unique identifier of the dataset
 * @returns The dataset with its file metadata, or null if not found
 */
export async function getDatasetById(id: string): Promise<Dataset | null> {
  const result = await prisma.dataset.findUnique({
    where: { id },
    include: {
      fileMetadata: {
        select: {
          id: true,
          datasetId: true,
          originalName: true,
          fileSize: true,
          fileType: true,
          rowCount: true,
          columnNames: true,
          sampleData: true,
          createdAt: true,
          updatedAt: true
          // Intentionally excluding fullData as it's not needed and can cause serialization issues
        }
      }
    }
  });
  
  return result as unknown as Dataset | null;
}

/**
 * Check if a dataset name already exists
 * 
 * Performs a case-insensitive search to check if a dataset with the given name exists.
 * Used for validation during dataset creation.
 * 
 * @param name - The dataset name to check
 * @returns Boolean indicating whether the name exists
 */
export async function datasetNameExists(name: string): Promise<boolean> {
  const existingDataset = await prisma.dataset.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  });
  
  return !!existingDataset;
}

/**
 * Update dataset metadata with AI-generated suggestions
 * 
 * Saves AI-generated metadata suggestions to a dataset and updates its status.
 * Sets the metadata status to GENERATED.
 * 
 * @param id - The unique identifier of the dataset
 * @param metadata - The AI-generated metadata suggestions
 * @param language - The language of the metadata (defaults to English)
 * @returns The updated dataset
 */
export async function updateDatasetMetadata(
  id: string,
  metadata: MetadataSuggestion,
  language: string = 'en'
): Promise<Dataset> {
  const result = await prisma.dataset.update({
    where: { id },
    data: {
      suggestedTitle: metadata.title,
      suggestedDescription: metadata.description,
      suggestedTags: metadata.tags,
      suggestedCategory: metadata.category,
      metadataLanguage: language,
      metadataStatus: 'GENERATED' as MetadataStatus
    }
  });
  
  return result as unknown as Dataset;
}

/**
 * Save metadata draft
 * 
 * Saves user-edited metadata draft to a dataset and updates its status.
 * Sets the metadata status to EDITED and resets publication status if needed.
 * 
 * @param id - The unique identifier of the dataset
 * @param draft - The user-edited metadata draft
 * @param language - The language of the metadata (defaults to English)
 * @returns The updated dataset
 */
export async function saveMetadataDraft(
  id: string,
  draft: MetadataDraft,
  language: string = 'en'
): Promise<Dataset> {
  // First, get the current dataset to check its status
  const currentDataset = await getDatasetById(id);
  
  if (!currentDataset) {
    throw new Error('Dataset not found');
  }
  
  // Prepare update data
  const updateData: any = {
    metadataDraft: draft as any,
    metadataLanguage: language,
    metadataStatus: 'EDITED' as MetadataStatus
  };
  
  // Reset publication status if the dataset was previously
  // rejected or published (approved)
  if (currentDataset.publicationStatus === 'REJECTED' || 
      currentDataset.publicationStatus === 'PUBLISHED') {
    updateData.publicationStatus = 'DRAFT';
    // Clear any previous review comments when status changes
    updateData.reviewComment = null;
  }
  
  const result = await prisma.dataset.update({
    where: { id },
    data: updateData,
    include: FILE_METADATA_INCLUDE
  });
  
  return result as Dataset;
}

/**
 * Delete a dataset by ID
 * 
 * Removes a dataset and its associated file metadata from the database.
 * Uses Prisma's cascading delete to automatically remove related records.
 * 
 * @param id - The unique identifier of the dataset to delete
 * @returns The deleted dataset
 */
export async function deleteDataset(id: string): Promise<Dataset> {
  const result = await prisma.dataset.delete({
    where: { id },
    include: {
      fileMetadata: true
    }
  });
  
  return result as unknown as Dataset;
}

/**
 * Update dataset publication status
 * 
 * Updates a dataset's publication status, metadata status, and related fields
 * Used for the publication workflow (submit for review, approve, reject)
 * 
 * @param id - The unique identifier of the dataset
 * @param publicationStatus - The new publication status
 * @param reviewComment - Optional reviewer comment
 * @returns The updated dataset
 */
export async function updateDatasetPublicationStatus(
  id: string,
  publicationStatus: string,
  reviewComment?: string
): Promise<Dataset> {
  interface DatasetUpdateFields {
    publicationStatus: string;
    metadataStatus?: string;
    publishedAt?: Date;
    reviewComment?: string | null;
  }
  
  const updateData: DatasetUpdateFields = {
    publicationStatus,
  };
  
  // Update metadata status based on publication status
  if (publicationStatus === 'PUBLISHED') {
    updateData.metadataStatus = 'APPROVED';
    updateData.publishedAt = new Date();
  } else if (publicationStatus === 'REJECTED') {
    updateData.metadataStatus = 'EDITED';
  }
  
  // Add reviewer comment if provided
  if (reviewComment !== undefined) {
    updateData.reviewComment = reviewComment;
  }
  
  const result = await prisma.dataset.update({
    where: { id },
    data: updateData,
    include: FILE_METADATA_INCLUDE
  });
  
  return result as Dataset;
} 
