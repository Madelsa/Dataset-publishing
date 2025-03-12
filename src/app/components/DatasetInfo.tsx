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
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{dataset.name}</h2>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-200 shadow-sm">
          Successfully Uploaded
        </span>
      </div>
      
      {dataset.description && (
        <div className="flex items-start mb-6 text-gray-700">
          <FiInfo className="h-5 w-5 mr-3 mt-0.5 text-indigo-500 flex-shrink-0" />
          <p className="text-base">{dataset.description}</p>
        </div>
      )}
      
      <div className="bg-indigo-50 rounded-md p-5 mb-6 border border-indigo-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <FiFile className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800 mb-1">File Name</p>
              <p className="text-base font-medium text-gray-800">{dataset.fileMetadata.originalName}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiGrid className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800 mb-1">Rows</p>
              <p className="text-base font-medium text-gray-800">{dataset.fileMetadata.rowCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiList className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800 mb-1">Columns</p>
              <p className="text-base font-medium text-gray-800">{dataset.fileMetadata.columnNames.length}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiCalendar className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800 mb-1">Uploaded</p>
              <p className="text-base font-medium text-gray-800">{formatDate(dataset.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-indigo-100">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Size: <span className="text-gray-800">{formatFileSize(dataset.fileMetadata.fileSize)}</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            Type: <span className="text-gray-800">{dataset.fileMetadata.fileType}</span>
          </p>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => setShowColumns(!showColumns)}
        >
          <h3 className="font-semibold text-gray-800">Column Information</h3>
          <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            {showColumns ? 'Hide Columns' : 'Show Columns'}
          </button>
        </div>
        
        {showColumns && (
          <div className="p-5 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dataset.fileMetadata.columnNames.map((column, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-3 rounded-md text-sm font-medium text-gray-800 border border-gray-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
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