/**
 * Constants Index
 * 
 * Re-exports all constants from specialized files for easier imports
 */

import { METADATA_STATUS } from '@/types/metadata.types';

// Re-export constants by domain
export * from './env';
export * from './ai';
export * from './uploads';

// App-wide constants that don't fit in a specific domain
export const APP_NAME = 'Dataset Publishing Platform';
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  DATASETS: '/datasets',
  DATASET_DETAIL: (id: string) => `/datasets/${id}`,
  DATASET_METADATA: (id: string) => `/datasets/${id}/metadata`,
  API: {
    DATASETS: '/api/datasets',
    DATASET_DETAIL: (id: string) => `/api/datasets/${id}`,
    DATASET_METADATA: (id: string) => `/api/datasets/${id}/metadata`,
    DATASET_GENERATE_METADATA: (id: string) => `/api/datasets/${id}/metadata/generate`,
    DATASET_SAVE_DRAFT: (id: string) => `/api/datasets/${id}/metadata/draft`,
    UPLOAD_DATASET: `/api/datasets/upload`,
    PUBLISH_DATASET: (id: string) => `/api/datasets/${id}/publish`,
    DATASETS_API: `/api/datasets/list`,
  }
};

// Timing constants
export const TOAST_DURATION = 5000; // ms
export const REDIRECT_DELAY = 1500; // ms

/**
 * Application Constants
 * 
 * Central location for all application-wide constants to improve
 * maintainability and consistency.
 */

/**
 * Metadata-related constants
 */
export const METADATA = {
  // Metadata status values (imported from types for consistency)
  STATUS: METADATA_STATUS,
  
  // Supported languages
  LANGUAGES: {
    ENGLISH: 'en',
    ARABIC: 'ar'
  }
};

/**
 * UI-related constants
 */
export const UI = {
  // Default timeout for redirects (in milliseconds)
  REDIRECT_TIMEOUT: 1500,
  
  // Number of rows to sample for preview
  SAMPLE_SIZE: 10,
  
  // Animation durations (in milliseconds)
  ANIMATIONS: {
    FAST: 150,
    MEDIUM: 300,
    SLOW: 500
  }
}; 