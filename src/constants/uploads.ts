/**
 * Upload Constants
 * 
 * Constants and configuration values for file uploads and processing
 */

// File size limits
export const MAX_FILE_SIZE_MB = 50; // 50MB - Increased to handle larger datasets while balancing browser memory constraints
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

// Allowed file types
export const ALLOWED_EXTENSIONS = ['.csv', '.xls', '.xlsx'];
export const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Sample data limits
export const MAX_SAMPLE_ROWS = 20;

// Error messages
export const UPLOAD_ERROR_MESSAGES = {
  SIZE_EXCEEDED: `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`,
  INVALID_TYPE: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
  EMPTY_FILE: 'File is empty or has no valid data',
  PARSING_ERROR: 'Error parsing file - file may be corrupted or in an unsupported format'
}; 