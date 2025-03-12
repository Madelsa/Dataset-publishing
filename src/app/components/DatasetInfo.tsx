'use client';

import { useState } from 'react';
import { FiFile, FiInfo, FiGrid, FiList, FiCalendar } from 'react-icons/fi';

interface FileMetadata {
  id: string;
  datasetId: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  rowCount: number;
  columnNames: string[];
  createdAt: string;
  updatedAt: string;
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileMetadata: FileMetadata;
  createdAt: string;
  updatedAt: string;
}

interface DatasetInfoProps {
  dataset: Dataset;
}

export default function DatasetInfo({ dataset }: DatasetInfoProps) {
  const [showColumns, setShowColumns] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{dataset.name}</h2>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Successfully Uploaded
        </span>
      </div>
      
      {dataset.description && (
        <div className="flex items-start mb-4 text-gray-600">
          <FiInfo className="h-5 w-5 mr-2 mt-0.5" />
          <p>{dataset.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <FiFile className="h-5 w-5 text-indigo-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">File Name</p>
              <p className="font-medium">{dataset.fileMetadata.originalName}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiGrid className="h-5 w-5 text-indigo-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Rows</p>
              <p className="font-medium">{dataset.fileMetadata.rowCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiList className="h-5 w-5 text-indigo-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Columns</p>
              <p className="font-medium">{dataset.fileMetadata.columnNames.length}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiCalendar className="h-5 w-5 text-indigo-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Uploaded</p>
              <p className="font-medium">{formatDate(dataset.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">Size: {formatFileSize(dataset.fileMetadata.fileSize)}</p>
          <p className="text-sm text-gray-500">Type: {dataset.fileMetadata.fileType}</p>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setShowColumns(!showColumns)}
        >
          <h3 className="font-medium">Column Information</h3>
          <button className="text-indigo-600">
            {showColumns ? 'Hide Columns' : 'Show Columns'}
          </button>
        </div>
        
        {showColumns && (
          <div className="p-4 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dataset.fileMetadata.columnNames.map((column, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  {column}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 