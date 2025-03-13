/**
 * File-related type definitions
 * 
 * This file contains TypeScript interfaces and types related to file processing,
 * uploads, and validation.
 */

/**
 * File Validation Result
 * 
 * Result of validating an uploaded file
 * Indicates whether the file is valid and any error messages
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Processed File
 * 
 * Result of processing a dataset file
 * Contains information extracted from the file
 */
export interface ProcessedFile {
  rowCount: number;
  columnNames: string[];
  sampleData?: any[]; // Sample data from the file to use for metadata generation
  error?: string;
}

/**
 * File Metadata
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * File Upload Options
 * 
 * Configuration options for file uploads
 */
export interface FileUploadOptions {
  maxSizeInBytes: number;
  allowedExtensions: string[];
  allowedMimeTypes: string[];
} 