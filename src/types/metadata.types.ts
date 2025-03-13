/**
 * Metadata-related type definitions
 * 
 * This file contains TypeScript interfaces and types related to dataset metadata,
 * including AI-generated suggestions and user-edited drafts.
 */

/**
 * Metadata Status
 * 
 * Represents the current state of a dataset's metadata
 * - PENDING: No metadata has been generated yet
 * - GENERATED: AI has generated metadata suggestions
 * - EDITED: User has edited the metadata
 * - APPROVED: Metadata has been reviewed and approved
 */
export type MetadataStatus = 'PENDING' | 'GENERATED' | 'EDITED' | 'APPROVED';

/**
 * Metadata Draft
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
 * Metadata Suggestion
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
 * Metadata Response
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
 * Metadata Language
 * 
 * Supported languages for metadata generation and display
 */
export type MetadataLanguage = 'en' | 'ar';

/**
 * Metadata Context State
 * 
 * State structure for the metadata context
 */
export interface MetadataState {
  isLoading: boolean;
  error: string | null;
  language: MetadataLanguage;
  suggested: MetadataSuggestion;
  draft: MetadataDraft | null;
  status: MetadataStatus;
}

/**
 * Metadata Generation Options
 * 
 * Options for metadata generation using AI
 */
export interface MetadataGenerationOptions {
  language: MetadataLanguage;
  useDraft?: boolean;
  forceRegenerate?: boolean;
  maxPromptLength?: number;
} 