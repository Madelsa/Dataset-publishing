import { NextRequest, NextResponse } from 'next/server';
import { getAllDatasets } from '@/services/datasetService';

/**
 * API Route: GET /api/datasets/list
 * 
 * Purpose: Retrieve a list of all datasets
 * This endpoint returns all datasets with their basic information
 */
export async function GET(request: NextRequest) {
  try {
    const datasets = await getAllDatasets();
    return NextResponse.json({ datasets });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { error: 'Error fetching datasets' },
      { status: 500 }
    );
  }
} 