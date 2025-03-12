'use client';

import { useState, useCallback, FormEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiAlertCircle } from 'react-icons/fi';

interface FileUploadProps {
  onUploadComplete: (data: any) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');

  // Accept only CSV and Excel files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    // Reset error state
    setError(null);
    
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a CSV or Excel file');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!datasetName.trim()) {
      setError('Please provide a dataset name');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData to send the file and metadata
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', datasetName);
      formData.append('description', datasetDescription);
      
      // Send the file to the API
      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }
      
      const data = await response.json();
      onUploadComplete(data);
      
      // Reset the form
      setFile(null);
      setDatasetName('');
      setDatasetDescription('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading the file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="dataset-name" className="block text-sm font-medium">
            Dataset Name
          </label>
          <input
            id="dataset-name"
            type="text"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter dataset name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dataset-description" className="block text-sm font-medium">
            Description (Optional)
          </label>
          <textarea
            id="dataset-description"
            value={datasetDescription}
            onChange={(e) => setDatasetDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter dataset description"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Upload File (CSV or Excel)
          </label>
          <div
            {...getRootProps({
              className: `border-2 border-dashed rounded-md p-8 ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              } cursor-pointer`
            })}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag and drop a file here, or click to select a file"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported file types: CSV, Excel (.xls, .xlsx)
              </p>
            </div>
          </div>
        </div>
        
        {file && (
          <div className="bg-gray-50 p-4 rounded-md flex items-start space-x-3">
            <FiFile className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB • {file.type}
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-start space-x-3">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm ${
            uploading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Dataset'}
        </button>
      </form>
    </div>
  );
} 