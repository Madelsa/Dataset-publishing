import { NextRequest, NextResponse } from 'next/server';
import { getDatasetById, deleteDataset } from '@/services/datasetService';
import { METADATA_STATUS } from '@/types/metadata.types';

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
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    const dataset = await getDatasetById(id);

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // Add hasMetadata property based on metadata status
    const enhancedDataset = {
      ...dataset,
      hasMetadata: dataset.metadataStatus !== METADATA_STATUS.NEEDS_METADATA
    };

    return NextResponse.json({ dataset: enhancedDataset });
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { error: 'Error fetching dataset' },
      { status: 500 }
    );
  }
}

/**
 * API Route: DELETE /api/datasets/[id]
 * 
 * Purpose: Delete a specific dataset by its ID
 * Removes the dataset and its associated file metadata from the database
 * 
 * @param params.id - The unique identifier of the dataset to delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    
    // Check if dataset exists
    const dataset = await getDatasetById(id);
    
    if (!dataset) {
      return NextResponse.json({ message: 'Dataset not found' }, { status: 404 });
    }
    
    // Delete the dataset
    await deleteDataset(id);
    
    return NextResponse.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json(
      { message: 'Error deleting dataset' },
      { status: 500 }
    );
  }
} 