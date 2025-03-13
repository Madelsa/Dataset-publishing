/**
 * Application Constants
 * 
 * Central location for all application-wide constants to improve
 * maintainability and consistency.
 */

/**
 * File-related constants
 */
export const FILE = {
  // Maximum file size in bytes (10MB)
  MAX_SIZE: 10 * 1024 * 1024,
  
  // Allowed file extensions
  ALLOWED_EXTENSIONS: ['.csv', '.xls', '.xlsx'],
  
  // MIME types for supported file formats
  MIME_TYPES: {
    CSV: 'text/csv',
    EXCEL: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
  }
};

/**
 * API endpoints
 */
export const API = {
  DATASETS: {
    BASE: '/api/datasets',
    UPLOAD: '/api/datasets/upload',
    METADATA: (id: string) => `/api/datasets/${id}/metadata`,
    DOWNLOAD: (id: string) => `/api/datasets/${id}/download`,
    DELETE: (id: string) => `/api/datasets/${id}`
  }
};

/**
 * Metadata-related constants
 */
export const METADATA = {
  // Metadata status values
  STATUS: {
    PENDING: 'PENDING',
    GENERATED: 'GENERATED',
    EDITED: 'EDITED',
    APPROVED: 'APPROVED'
  },
  
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
  SAMPLE_SIZE: 5,
  
  // Animation durations (in milliseconds)
  ANIMATIONS: {
    FAST: 150,
    MEDIUM: 300,
    SLOW: 500
  }
}; 