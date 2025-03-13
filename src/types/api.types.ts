/**
 * API-related type definitions
 * 
 * This file contains TypeScript interfaces and types related to API requests,
 * responses, and error handling.
 */

/**
 * API Response
 * 
 * Generic structure for API responses
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * API Error
 * 
 * Structure for API error responses
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

/**
 * Pagination Parameters
 * 
 * Parameters for paginated API requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Paginated Response
 * 
 * Structure for paginated API responses
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Upload Request
 * 
 * Structure for file upload API requests
 */
export interface UploadRequest {
  file: File;
  name: string;
  description?: string;
}

/**
 * Upload Response
 * 
 * Structure for file upload API responses
 */
export interface UploadResponse {
  message: string;
  dataset: {
    id: string;
    name: string;
    [key: string]: any;
  };
} 