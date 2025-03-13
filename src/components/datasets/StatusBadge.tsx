/**
 * Status Badge Component
 * 
 * Displays a colored badge for dataset metadata or publication status
 * Different colors are used to represent different statuses:
 * - Pending: Purple (displayed as "Needs Metadata")
 * - Edited: Yellow (displayed as "Pending Review")
 * - Approved: Green
 * - Rejected: Red
 */

import React from 'react';
import { MetadataStatus } from '@/types/metadata.types';

interface StatusBadgeProps {
  /**
   * The status to display
   */
  status: MetadataStatus | 'REJECTED' | 'PUBLISHED';
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

// Map of status to color classes
const statusColorMap = {
  PENDING: 'bg-purple-100 text-purple-800',
  GENERATED: 'bg-blue-100 text-blue-800', // Keeping for backward compatibility
  EDITED: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800', // Keeping for backward compatibility
};

// Map of status to display text
const statusDisplayMap = {
  PENDING: 'Needs Metadata',
  GENERATED: 'Needs Metadata', // Fallback to similar status
  EDITED: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PUBLISHED: 'Approved', // Fallback to similar status
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
        ${statusColorMap[status]} ${className}`}
    >
      {statusDisplayMap[status]}
    </span>
  );
} 