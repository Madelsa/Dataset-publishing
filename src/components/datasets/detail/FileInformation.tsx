/**
 * File Information Component
 * 
 * Displays detailed information about a dataset's file:
 * - Original filename
 * - File type
 * - File size
 * - Creation and update timestamps
 */

import React from 'react';
import { FiFileText, FiCalendar, FiClock, FiTag, FiGrid } from 'react-icons/fi';
import { FileMetadata } from '@/types/dataset.types';
import { formatDate, formatFileSize } from '@/utils/formatting';

interface FileInformationProps {
  /**
   * The file metadata object
   */
  fileMetadata?: FileMetadata;
  
  /**
   * Dataset creation timestamp
   */
  createdAt: Date | string;
  
  /**
   * Dataset last update timestamp
   */
  updatedAt: Date | string;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function FileInformation({
  fileMetadata,
  createdAt,
  updatedAt,
  className = ''
}: FileInformationProps) {
  return (
    <div className={`px-6 py-5 ${className}`}>
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
  );
} 