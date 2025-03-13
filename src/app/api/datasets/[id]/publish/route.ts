import { NextRequest } from 'next/server';
import { getDatasetById, updateDatasetPublicationStatus } from '@/services/datasetService';
import { PublicationStatus } from '@/types/dataset.types';
import { enhanceDataset } from '@/utils/dataset.utils';
import { createErrorResponse, createSuccessResponse } from '@/utils/api.utils';

/**
 * API Route: PUT /api/datasets/[id]/publish
 * 
 * Purpose: Update a dataset's publication status (draft, pending review, rejected, published)
 * Handles the publication workflow for datasets
 * 
 * @param params.id - The unique identifier of the dataset
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get dataset ID from path
    const { id } = await Promise.resolve(params);
    
    // Get dataset to ensure it exists
    const dataset = await getDatasetById(id);
    if (!dataset) {
      return createErrorResponse('NOT_FOUND', 'Dataset not found');
    }
    
    // Parse the request body to get publication status update
    const body = await request.json();
    const { publicationStatus, reviewComment } = body;
    
    // Validate the publication status
    if (!publicationStatus || !['DRAFT', 'PENDING_REVIEW', 'REJECTED', 'PUBLISHED'].includes(publicationStatus)) {
      return createErrorResponse('BAD_REQUEST', 'Invalid publication status');
    }
    
    // Update the dataset publication status in the database using our service function
    const updatedDataset = await updateDatasetPublicationStatus(
      id, 
      publicationStatus as PublicationStatus,
      reviewComment
    );
    
    // Enhance the dataset with computed properties
    const enhancedDataset = enhanceDataset(updatedDataset);
    
    return createSuccessResponse({ dataset: enhancedDataset });
  } catch (error) {
    console.error('Error updating publication status:', error);
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'Error updating publication status'
    );
  }
} 