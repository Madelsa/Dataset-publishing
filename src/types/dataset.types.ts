/**
 * Dataset and related type definitions
 * 
 * This file contains all the TypeScript interfaces and types used throughout
 * the Dataset Publishing Platform for consistent type checking and autocompletion.
 */

/**
 * FileMetadata
 * 
 * Represents metadata about the uploaded dataset file
 * Contains information about file properties and structure
 */
export interface FileMetadata {
  id: string;
  datasetId: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  rowCount: number;
  columnNames: string[];
  sampleData?: any[]; // Sample data from the file for metadata generation
  fullData?: any[]; // Complete file data for download
  createdAt: Date | string;
  updatedAt: Date | string;
}

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
 * MetadataStatus
 * 
 * Represents the current state of a dataset's metadata
 * - PENDING: No metadata has been generated yet
 * - GENERATED: AI has generated metadata suggestions
 * - EDITED: User has edited the metadata
 * - APPROVED: Metadata has been reviewed and approved
 */
export type MetadataStatus = 'PENDING' | 'GENERATED' | 'EDITED' | 'APPROVED';

/**
 * MetadataDraft
 * 
 * User-editable metadata for a dataset
 * Represents the working draft that can be saved
 */
export interface MetadataDraft {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

/**
 * MetadataSuggestion
 * 
 * AI-generated metadata suggestions for a dataset
 * Used as a starting point for user edits
 */
export interface MetadataSuggestion {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

/**
 * MetadataResponse
 * 
 * API response structure for metadata requests
 * Contains both suggested and draft metadata
 */
export interface MetadataResponse {
  suggested: MetadataSuggestion;
  draft: MetadataDraft | null;
  language: string;
  status: MetadataStatus;
}

/**
 * FileValidationResult
 * 
 * Result of validating an uploaded file
 * Indicates whether the file is valid and any error messages
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * ProcessedFile
 * 
 * Result of processing a dataset file
 * Contains information extracted from the file
 */
export interface ProcessedFile {
  rowCount: number;
  columnNames: string[];
  sampleData?: any[]; // Sample data from the file to use for metadata generation
  fullData?: any[]; // Full data from the file for complete dataset storage
  error?: string;
} 