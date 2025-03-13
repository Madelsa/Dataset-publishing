import { NextRequest, NextResponse } from 'next/server';
import { getDatasetById } from '@/services/datasetService';

/**
 * API Route: GET /api/datasets/[id]
 * 
 * Purpose: Retrieve a specific dataset by its ID
 * Returns the dataset with its full details including file metadata
 * 
 * @param params.id - The unique identifier of the dataset to retrieve
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 14+, directly access params.id without destructuring to fix the warning
    const dataset = await getDatasetById(params.id);

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    return NextResponse.json({ dataset });
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { error: 'Error fetching dataset' },
      { status: 500 }
    );
  }
} 