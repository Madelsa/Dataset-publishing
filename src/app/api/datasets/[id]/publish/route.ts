import { NextRequest } from 'next/server';
import { getDatasetById, updateDatasetStatus } from '@/services/datasetService';
import { DisplayStatus } from '@/components/datasets/StatusBadge';
import { enhanceDataset } from '@/utils/dataset.utils';
import { createErrorResponse, createSuccessResponse } from '@/utils/api.utils';

/**
 * API Route: PUT /api/datasets/[id]/publish
 * 
 * Purpose: Update a dataset's status (needs metadata, pending review, rejected, approved)
 * Handles the dataset workflow
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
    
    // Parse the request body to get status update
    const body = await request.json();
    const { status, reviewComment } = body;
    
    // Validate the status
    if (!status || !['NEEDS_METADATA', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      return createErrorResponse('BAD_REQUEST', 'Invalid status');
    }
    
    // Update the dataset status in the database using our service function
    const updatedDataset = await updateDatasetStatus(
      id, 
      status as DisplayStatus,
      reviewComment
    );
    
    // Enhance the dataset with computed properties
    const enhancedDataset = enhanceDataset(updatedDataset);
    
    return createSuccessResponse({ dataset: enhancedDataset });
  } catch (error) {
    console.error('Error updating dataset status:', error);
    return createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'Error updating dataset status'
    );
  }
} 