'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import DatasetInfo from './components/DatasetInfo';

export default function Home() {
  const [uploadedDataset, setUploadedDataset] = useState<any>(null);

  const handleUploadComplete = (data: any) => {
    setUploadedDataset(data.dataset);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dataset Publishing Platform
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Upload and publish your datasets in CSV or Excel format
          </p>
        </div>

        {uploadedDataset ? (
          <div className="space-y-6">
            <DatasetInfo dataset={uploadedDataset} />
            
            <div className="text-center mt-6">
              <button
                onClick={() => setUploadedDataset(null)}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Upload Another Dataset
              </button>
            </div>
          </div>
        ) : (
          <FileUpload onUploadComplete={handleUploadComplete} />
        )}
      </div>
    </main>
  );
}
