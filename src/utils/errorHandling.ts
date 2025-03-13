/**
 * Error Handling Utilities
 * 
 * Provides consistent error handling patterns across the application
 * for both client and server-side code.
 */

import { toast } from 'react-hot-toast';

/**
 * Generic error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Format an error into a standardized structure
 * 
 * @param error - The error to format
 * @returns Formatted error with consistent structure
 */
export function formatError(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
      details: (error as any).cause || (error as any).details
    };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, any>;
    
    // Handle API error responses
    if (errorObj.message) {
      return {
        message: errorObj.message,
        code: errorObj.code || errorObj.status,
        details: errorObj.details || errorObj.data
      };
    }
  }
  
  return { message: 'An unknown error occurred' };
}

/**
 * Display an error toast with a formatted message
 * 
 * @param error - The error to display
 */
export function showErrorToast(error: unknown): void {
  const formattedError = formatError(error);
  toast.error(formattedError.message);
}

/**
 * Log an error with additional context
 * 
 * @param error - The error to log
 * @param context - Additional context about when/where the error occurred
 */
export function logError(error: unknown, context?: string): void {
  const formattedError = formatError(error);
  
  if (context) {
    console.error(`[${context}]`, formattedError);
  } else {
    console.error(formattedError);
  }
}

/**
 * Safely parse JSON with error handling
 * 
 * @param json - The JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logError(error, 'JSON Parse');
    return fallback;
  }
}

/**
 * A higher-order function to wrap async operations with error handling
 * 
 * @param fn - The async function to wrap
 * @param errorHandler - Optional custom error handler
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: unknown) => void
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        showErrorToast(error);
        logError(error, fn.name);
      }
      return null;
    }
  };
} 