import { NextRequest, NextResponse } from 'next/server';
import { getAllDatasets } from '@/services/datasetService';

/**
 * API Route: GET /api/datasets/list
 * 
 * Purpose: Retrieve a list of all datasets
 * This endpoint returns all datasets with their basic information
 * and adds a hasMetadata property based on metadata status
 */
export async function GET(request: NextRequest) {
  try {
    const datasets = await getAllDatasets();
    
    // Add hasMetadata property to each dataset
    const enhancedDatasets = datasets.map(dataset => ({
      ...dataset,
      hasMetadata: dataset.metadataStatus === 'PENDING REVIEW' || 
                   dataset.metadataStatus === 'APPROVED' ||
                   dataset.metadataStatus === 'REJECTED'
    }));
    
    return NextResponse.json({ datasets: enhancedDatasets });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { error: 'Error fetching datasets' },
      { status: 500 }
    );
  }
} 