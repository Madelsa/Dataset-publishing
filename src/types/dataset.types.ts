/**
 * Dataset and related type definitions
 * 
 * Core dataset types and re-exports of domain-specific types for easier imports.
 */

// Import types needed for Dataset interface
import { FileMetadata } from './file.types';
import { MetadataStatus, MetadataDraft } from './metadata.types';

// Re-export domain-specific types
export * from './file.types';
export * from './metadata.types';
export * from './api.types';

/**
 * Dataset
 * 
 * Core data structure representing a dataset in the system
 * Includes basic information, metadata, and references to the file
 */
export interface Dataset {
  id: string;
  name: string;
  description: string | null;
  suggestedTitle: string | null;
  suggestedDescription: string | null;
  suggestedTags: string[];
  suggestedCategory: string | null;
  metadataLanguage: string;
  metadataStatus: MetadataStatus;
  metadataDraft: MetadataDraft | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  fileMetadata?: FileMetadata;
}

/**
 * Dataset List Item
 * 
 * A simplified version of the Dataset for list views
 */
export interface DatasetListItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | string;
  hasMetadata: boolean;
}

/**
 * Dataset Create Input
 * 
 * Input structure for creating a new dataset
 */
export interface DatasetCreateInput {
  name: string;
  description?: string;
  file: File;
}

/**
 * Dataset Update Input
 * 
 * Input structure for updating an existing dataset
 */
export interface DatasetUpdateInput {
  name?: string;
  description?: string;
} 