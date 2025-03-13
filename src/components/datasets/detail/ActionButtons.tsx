/**
 * Action Buttons Component
 * 
 * Displays action buttons for a dataset:
 * - Edit metadata button
 * - Delete button
 * - Other actions
 */

import React from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';

interface ActionButtonsProps {
  /**
   * The dataset ID
   */
  datasetId: string;
  
  /**
   * Whether the dataset has metadata
   */
  hasMetadata?: boolean;
  
  /**
   * Optional callback for delete action
   */
  onDelete?: () => void;
  
  /**
   * Optional callback for download action
   */
  onDownload?: () => void;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function ActionButtons({
  datasetId,
  hasMetadata = false,
  onDelete,
  onDownload,
  className = ''
}: ActionButtonsProps) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      <Link
        href={`/datasets/${datasetId}/metadata`}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <FiEdit2 className="mr-1.5 -ml-0.5 h-4 w-4" />
        {hasMetadata ? 'Edit Metadata' : 'Add Metadata'}
      </Link>
      
      {onDownload && (
        <button
          onClick={onDownload}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <FiDownload className="mr-1.5 -ml-0.5 h-4 w-4" />
          Download
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={onDelete}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          <FiTrash2 className="mr-1.5 -ml-0.5 h-4 w-4" />
          Delete
        </button>
      )}
    </div>
  );
} 