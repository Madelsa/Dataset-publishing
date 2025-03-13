import { NextRequest, NextResponse } from 'next/server';
import { getDatasetById, updateDatasetMetadata, saveMetadataDraft } from '@/services/datasetService';
import { generateMetadata } from '@/services/metadataService';
import { MetadataDraft, MetadataResponse } from '@/types/dataset.types';
import { enhanceDataset } from '@/utils/dataset.utils';

/**
 * API Route: POST /api/datasets/[id]/metadata
 * 
 * Purpose: Generate AI metadata for a dataset
 * Uses AI to analyze the dataset and create metadata like title, description, and tags
 * 
 * @param params.id - The unique identifier of the dataset
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the dataset with its file metadata
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    const dataset = await getDatasetById(id);
    
    if (!dataset) {
      return NextResponse.json(
        { message: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    // Get language preference from request body
    const { language = 'en' } = await request.json().catch(() => ({}));
    
    // Get the column names from the file metadata
    const columnNames = dataset.fileMetadata?.columnNames || [];
    
    // Retrieve sample data from the file metadata if available
    // If not available (older datasets), use a placeholder sample
    let sampleData: any[] = [];
    
    // Check if we have file metadata with processed sample data
    if (dataset.fileMetadata && dataset.fileMetadata.sampleData) {
      sampleData = dataset.fileMetadata.sampleData as any[];
      console.log(`Using sample data from file metadata (${sampleData.length} rows)`);
    } else {
      // Create a minimal placeholder sample with the column names
      console.log('No sample data available, using column names to create placeholder');
      if (columnNames.length > 0) {
        // Create a simple placeholder record with column names as keys
        const placeholderRecord: Record<string, string> = {};
        columnNames.forEach(col => {
          placeholderRecord[col] = 'example data';
        });
        sampleData = [placeholderRecord];
      }
    }
    
    // Generate metadata using AI
    const metadata = await generateMetadata(
      sampleData,
      columnNames,
      language
    );
    
    // Update the dataset with the generated metadata
    const updatedDataset = await updateDatasetMetadata(id, metadata, language);
    
    return NextResponse.json({
      message: 'Metadata generated successfully',
      metadata,
      dataset: updatedDataset
    });
    
  } catch (error: any) {
    console.error('Error generating metadata:', error);
    return NextResponse.json(
      { message: `Failed to generate metadata: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * API Route: PUT /api/datasets/[id]/metadata
 * 
 * Purpose: Update metadata draft for a dataset
 * Saves user-edited metadata as a draft
 * 
 * @param params.id - The unique identifier of the dataset
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { metadata, language = 'en' } = body;
    
    // Validate input
    if (!metadata) {
      return NextResponse.json(
        { message: 'Metadata is required' },
        { status: 400 }
      );
    }
    
    // Update the dataset with the edited metadata
    const updatedDataset = await saveMetadataDraft(
      id, 
      metadata as MetadataDraft, 
      language
    );
    
    // Enhance the dataset with computed properties
    const enhancedDataset = enhanceDataset(updatedDataset);
    
    return NextResponse.json({
      message: 'Metadata updated successfully',
      dataset: enhancedDataset
    });
    
  } catch (error: any) {
    console.error('Error updating metadata:', error);
    return NextResponse.json(
      { message: `Failed to update metadata: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/datasets/[id]/metadata
 * 
 * Purpose: Retrieve current metadata for a dataset
 * Returns both suggested metadata and draft if available
 * 
 * @param params.id - The unique identifier of the dataset
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    const dataset = await getDatasetById(id);
    
    if (!dataset) {
      return NextResponse.json(
        { message: 'Dataset not found' },
        { status: 404 }
      );
    }
    
    // Return both suggested metadata and draft if available
    const metadata: MetadataResponse = {
      suggested: {
        title: dataset.suggestedTitle || '',
        description: dataset.suggestedDescription || '',
        tags: dataset.suggestedTags || [],
        category: dataset.suggestedCategory || ''
      },
      draft: dataset.metadataDraft as MetadataDraft | null,
      language: dataset.metadataLanguage,
      status: dataset.metadataStatus
    };
    
    return NextResponse.json({ metadata, dataset });
    
  } catch (error: any) {
    console.error('Error retrieving metadata:', error);
    return NextResponse.json(
      { message: `Failed to retrieve metadata: ${error.message}` },
      { status: 500 }
    );
  }
} 