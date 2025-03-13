/**
 * Dataset Card Component
 * 
 * Displays a card representation of a single dataset:
 * - Shows dataset name, description, and file information
 * - Displays creation date and file size/type
 * - Indicates metadata status with a colored badge
 * - Provides action buttons for viewing details, editing metadata, and deletion
 * - Handles deletion confirmation with a browser dialog
 * 
 * Used by the DatasetGrid component to display multiple datasets in a grid layout.
 * 
 * @param dataset - The dataset object to display
 * @param onDelete - Optional callback function for dataset deletion
 */

'use client';

import { FiFile, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { Dataset, DatasetListItem, MetadataStatus } from '@/types/dataset.types';
import { formatDate, formatFileSize } from '@/utils/formatting';
import StatusBadge from './StatusBadge';

interface DatasetCardProps {
  dataset: Dataset | DatasetListItem;
  onDelete?: (id: string) => void;
}

export default function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
  const {
    id,
    name,
    description,
    createdAt,
  } = dataset;
  
  // Get metadata status
  const metadataStatus = 'metadataStatus' in dataset 
    ? dataset.metadataStatus 
    : 'hasMetadata' in dataset && dataset.hasMetadata
      ? 'EDITED' // Best approximation for DatasetListItem
      : 'PENDING';
  
  // Check if the dataset object has the hasMetadata property
  const hasMetadata = 'hasMetadata' in dataset 
    ? dataset.hasMetadata 
    : 'metadataStatus' in dataset 
      ? dataset.metadataStatus !== 'PENDING' 
      : false;
  
  // Check if the dataset object has fileMetadata
  const fileMetadata = 'fileMetadata' in dataset ? dataset.fileMetadata : undefined;

  /**
   * Handle delete button click
   * 
   * Shows a confirmation dialog and calls the onDelete callback
   * if the user confirms the deletion
   */
  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
        onDelete(id);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/datasets/${id}`}
              className="text-indigo-600 hover:text-indigo-700 p-1.5 rounded-full hover:bg-gray-50"
              title="View dataset details"
            >
              <FiFile className="h-5 w-5" />
              <span className="sr-only">View</span>
            </Link>
            
            {hasMetadata ? (
              <Link 
                href={`/datasets/${id}/metadata`}
                className="text-green-600 hover:text-green-700 p-1.5 rounded-full hover:bg-gray-50"
                title="Edit metadata"
              >
                <FiEdit2 className="h-5 w-5" />
                <span className="sr-only">Edit Metadata</span>
              </Link>
            ) : (
              <Link 
                href={`/datasets/${id}/metadata`}
                className="text-yellow-600 hover:text-yellow-700 p-1.5 rounded-full hover:bg-gray-50"
                title="Add metadata"
              >
                <FiEdit2 className="h-5 w-5" />
                <span className="sr-only">Add Metadata</span>
              </Link>
            )}
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 p-1.5 rounded-full hover:bg-gray-50 cursor-pointer"
                title="Delete dataset"
              >
                <FiTrash2 className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-500">
            <FiFile className="mr-1.5 h-4 w-4" />
            <span className="truncate">
              {fileMetadata?.fileType || 'Unknown'} • {fileMetadata?.fileSize ? formatFileSize(Number(fileMetadata.fileSize)) : 'Unknown size'}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <FiClock className="mr-1.5 h-4 w-4" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <StatusBadge status={metadataStatus} />
          
          {/* Add publication status badge if available */}
          {'publicationStatus' in dataset && dataset.publicationStatus === 'PUBLISHED' && (
            <StatusBadge status="PUBLISHED" className="ml-2" />
          )}
        </div>
      </div>
    </div>
  );
} 