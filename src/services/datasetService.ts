/**
 * Dataset Service
 * 
 * Provides functions for interacting with datasets in the database.
 * Handles CRUD operations and specialized queries for dataset management.
 */

import { prisma } from '@/lib/prisma';
import { Dataset, MetadataDraft, MetadataSuggestion, ProcessedFile } from '@/types/dataset.types';

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
  return prisma.dataset.create({
    data: {
      name,
      description,
      metadataStatus: 'PENDING',
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
        }
      }
    },
    include: {
      fileMetadata: true
    }
  });
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
  return prisma.dataset.findMany({
    include: {
      fileMetadata: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
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
  return prisma.dataset.findUnique({
    where: { id },
    include: {
      fileMetadata: true
    }
  });
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
  return prisma.dataset.update({
    where: { id },
    data: {
      suggestedTitle: metadata.title,
      suggestedDescription: metadata.description,
      suggestedTags: metadata.tags,
      suggestedCategory: metadata.category,
      metadataLanguage: language,
      metadataStatus: 'GENERATED'
    }
  });
}

/**
 * Save metadata draft
 * 
 * Saves user-edited metadata draft to a dataset and updates its status.
 * Sets the metadata status to EDITED.
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
  return prisma.dataset.update({
    where: { id },
    data: {
      metadataDraft: draft as any,
      metadataLanguage: language,
      metadataStatus: 'EDITED'
    }
  });
} 