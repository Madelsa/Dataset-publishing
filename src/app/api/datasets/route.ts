import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: GET /api/datasets
 * 
 * Purpose: Compatibility redirect to /api/datasets/list
 * This route is kept for backward compatibility with existing frontend code
 * New code should use /api/datasets/list directly
 */
export async function GET(request: NextRequest) {
  // Redirect to the new list endpoint
  const url = new URL(request.url);
  const redirectUrl = new URL('/api/datasets/list', url.origin);
  
  // Forward the request to the new endpoint
  const response = await fetch(redirectUrl.toString());
  return response;
} 