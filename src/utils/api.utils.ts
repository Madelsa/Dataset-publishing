import { NextResponse } from 'next/server';

/**
 * API error response types
 */
export type ApiErrorType = 
  | 'NOT_FOUND' 
  | 'BAD_REQUEST' 
  | 'UNAUTHORIZED' 
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR';

/**
 * API error status codes
 */
const ERROR_STATUS_CODES: Record<ApiErrorType, number> = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Creates a standardized error response
 * 
 * @param type - The type of error
 * @param message - The error message
 * @returns A NextResponse with the appropriate status code and error message
 */
export function createErrorResponse(type: ApiErrorType, message: string) {
  const status = ERROR_STATUS_CODES[type];
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Creates a standardized success response
 * 
 * @param data - The response data
 * @param status - Optional status code (defaults to 200)
 * @returns A NextResponse with the provided data and status code
 */
export function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
} 