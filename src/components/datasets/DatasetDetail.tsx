/**
 * Dataset Detail Component
 * 
 * Displays comprehensive information about a dataset:
 * - Shows dataset name and description
 * - Displays file information (name, type, size, location)
 * - Shows creation and update timestamps
 * - Renders metadata if available (title, description, keywords, category)
 * - Provides buttons for downloading the dataset and editing metadata
 * 
 * Handles file download functionality with error handling and loading states.
 * 
 * @param dataset - The dataset object containing all information to display
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FiFileText, 
  FiCalendar, 
  FiClock, 
  FiTag, 
  FiGrid, 
  FiLink, 
  FiDownload, 
  FiEdit2, 
  FiAlertCircle 
} from 'react-icons/fi';
import { Dataset } from '@/types/dataset.types';
import { formatDate, formatFileSize } from '@/utils/formatting';

interface DatasetDetailProps {
  dataset: Dataset;
}

export default function DatasetDetail({ dataset }: DatasetDetailProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    fileMetadata,
    metadata
  } = dataset;

  const hasMetadata = !!metadata?.title || !!metadata?.description;
  
  /**
   * Handle file download
   * 
   * Fetches the dataset file from the server and triggers a download
   * in the browser. Manages loading state and error handling.
   */
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);
      
      // Request the file from the server
      const response = await fetch(`/api/datasets/${id}/download`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to download file');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileMetadata?.originalName || `${name}-dataset${fileMetadata?.fileType ? '.' + fileMetadata.fileType.split('/').pop() : ''}`;
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Click the link to start the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message || 'An error occurred while downloading the file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <div className="flex space-x-3">
            <Link
              href={`/datasets/${id}/metadata`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FiEdit2 className="mr-1.5 -ml-0.5 h-4 w-4" />
              {hasMetadata ? 'Edit Metadata' : 'Add Metadata'}
            </Link>
            
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <FiDownload className="mr-1.5 -ml-0.5 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
        
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      {error && (
        <div className="px-6 py-3 bg-red-50">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-6 py-5">
        <h3 className="text-lg font-medium text-gray-900 mb-4">File Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileMetadata?.originalName && (
            <div className="flex items-start">
              <FiFileText className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Original Filename</p>
                <p className="mt-1 text-sm text-gray-900">{fileMetadata.originalName}</p>
              </div>
            </div>
          )}
          
          {fileMetadata?.fileType && (
            <div className="flex items-start">
              <FiTag className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">File Type</p>
                <p className="mt-1 text-sm text-gray-900">{fileMetadata.fileType}</p>
              </div>
            </div>
          )}
          
          {fileMetadata?.fileSize && (
            <div className="flex items-start">
              <FiGrid className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">File Size</p>
                <p className="mt-1 text-sm text-gray-900">{formatFileSize(Number(fileMetadata.fileSize))}</p>
              </div>
            </div>
          )}
          
          {fileMetadata?.storageLocation && (
            <div className="flex items-start">
              <FiLink className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Storage Location</p>
                <p className="mt-1 text-sm text-gray-900 truncate max-w-xs">{fileMetadata.storageLocation}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <FiCalendar className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FiClock className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-sm text-gray-900">{formatDate(updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {hasMetadata && (
        <div className="px-6 py-5 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
          
          <div className="space-y-6">
            {metadata?.title && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="mt-1 text-base text-gray-900">{metadata.title}</p>
              </div>
            )}
            
            {metadata?.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-base text-gray-900 whitespace-pre-line">{metadata.description}</p>
              </div>
            )}
            
            {metadata?.keywords && metadata.keywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Keywords</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {metadata.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {metadata?.category && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="mt-1 text-base text-gray-900">{metadata.category}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 