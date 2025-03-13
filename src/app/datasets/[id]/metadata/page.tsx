'use client';

import { useParams } from 'next/navigation';
import MetadataEditor from '@/components/datasets/MetadataEditor';
import PageLayout from '@/components/layout/PageLayout';

/**
 * Metadata Edit Page Component
 * 
 * Provides an interface for editing dataset metadata:
 * - Supports AI-generated metadata suggestions
 * - Allows manual editing of title, description, keywords, and category
 * - Supports multiple languages (English and Arabic)
 * - Enables saving metadata drafts
 * 
 * This page uses the MetadataEditor component and the MetadataContext
 * to handle state management and API interactions.
 * 
 * @param params.id - The dataset ID from the URL
 */
export default function MetadataPage() {
  const params = useParams();
  const datasetId = params.id as string;
  
  return (
    <PageLayout
      title="Edit Dataset Metadata"
      description="Add or edit AI-generated metadata for your dataset"
    >
      <MetadataEditor datasetId={datasetId} />
    </PageLayout>
  );
} 