/**
 * Status Badge Component
 * 
 * Displays a colored badge for dataset status
 * Different colors are used to represent different statuses:
 * - Needs Metadata: Purple
 * - Pending Review: Yellow
 * - Approved: Green
 * - Rejected: Red
 */

import React from 'react';

export type DisplayStatus = 'NEEDS_METADATA' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

interface StatusBadgeProps {
  /**
   * The status to display
   */
  status: DisplayStatus;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

// Map of status to color classes
const statusColorMap = {
  NEEDS_METADATA: 'bg-purple-100 text-purple-800',
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

// Map of status to display text
const statusDisplayMap = {
  NEEDS_METADATA: 'Needs Metadata',
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
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