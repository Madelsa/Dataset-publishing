import { NextRequest, NextResponse } from 'next/server';
import { getDatasetById } from '@/services/datasetService';
import { PublicationStatus } from '@/types/dataset.types';

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
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    
    // Parse the request body to get publication status update
    const body = await request.json();
    const { publicationStatus, reviewComment } = body;
    
    // Validate the publication status
    if (!publicationStatus || !['DRAFT', 'PENDING_REVIEW', 'REJECTED', 'PUBLISHED'].includes(publicationStatus)) {
      return NextResponse.json(
        { error: 'Invalid publication status' }, 
        { status: 400 }
      );
    }
    
    // Update the dataset publication status in the database
    const updatedDataset = await updateDatasetPublicationStatus(
      id, 
      publicationStatus as PublicationStatus,
      reviewComment
    );
    
    return NextResponse.json({ dataset: updatedDataset });
  } catch (error) {
    console.error('Error updating publication status:', error);
    return NextResponse.json(
      { error: 'Error updating publication status' },
      { status: 500 }
    );
  }
}

/**
 * Update dataset publication status
 * 
 * Updates a dataset's publication status and related fields
 * 
 * @param id - Dataset ID
 * @param status - New publication status
 * @param comment - Optional review comment
 * @returns Updated dataset
 */
async function updateDatasetPublicationStatus(
  id: string,
  status: PublicationStatus,
  comment?: string
) {
  // Import prisma dynamically to avoid issues with Next.js API routes
  const { prisma } = await import('@/lib/prisma');
  
  const updateData: any = {
    publicationStatus: status,
  };
  
  // Add publishedAt timestamp for PUBLISHED status
  if (status === 'PUBLISHED') {
    updateData.publishedAt = new Date();
  }
  
  // Add review comment if provided
  if (comment !== undefined) {
    updateData.reviewComment = comment;
  }
  
  // Update dataset in database
  const result = await prisma.dataset.update({
    where: { id },
    data: updateData,
    include: {
      fileMetadata: {
        select: {
          id: true,
          datasetId: true,
          originalName: true,
          fileSize: true,
          fileType: true,
          rowCount: true,
          columnNames: true,
          sampleData: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });
  
  // Add hasMetadata property based on metadata status
  const enhancedDataset = {
    ...result,
    hasMetadata: result.metadataStatus === 'GENERATED' || 
                 result.metadataStatus === 'EDITED' || 
                 result.metadataStatus === 'APPROVED'
  };
  
  return enhancedDataset;
} 