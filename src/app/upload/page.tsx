'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import FileUpload from '@/components/datasets/FileUpload';
import { Dataset } from '@/types/dataset.types';

interface UploadResponse {
  message: string;
  dataset: Dataset;
}

/**
 * Upload Page Component
 * 
 * Provides a user interface for uploading new datasets:
 * - Displays a file upload form for CSV/Excel files
 * - Validates dataset name and file format
 * - Shows success message after upload
 * - Automatically redirects to the dataset detail page
 * 
 * This page uses the FileUpload component to handle the 
 * actual upload process and form display.
 */
export default function UploadPage() {
  const router = useRouter();
  const [uploadedDataset, setUploadedDataset] = useState<Dataset | null>(null);

  const handleUploadComplete = (data: UploadResponse) => {
    setUploadedDataset(data.dataset);
    
    // Redirect to the dataset detail page after a short delay
    setTimeout(() => {
      router.push(`/datasets/${data.dataset.id}`);
    }, 1500);
  };

  return (
    <PageLayout
      title="Upload Dataset"
      description="Upload your dataset in CSV or Excel format. The dataset will be available for editing metadata."
    >
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <FileUpload onUploadComplete={handleUploadComplete} />
        
        {uploadedDataset && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Upload Successful!</h2>
            <p className="text-green-700">
              Your dataset "{uploadedDataset.name}" was uploaded successfully. Redirecting to dataset page...
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
} 