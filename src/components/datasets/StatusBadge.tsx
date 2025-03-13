/**
 * Status Badge Component
 * 
 * Displays a colored badge for dataset metadata or publication status
 * Different colors are used to represent different statuses:
 * - Pending: Yellow
 * - Generated: Blue
 * - Edited: Purple
 * - Approved: Green
 * - Published: Green with a different shade
 */

import React from 'react';
import { MetadataStatus } from '@/types/metadata.types';

interface StatusBadgeProps {
  /**
   * The status to display
   */
  status: MetadataStatus | 'PUBLISHED';
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

// Map of status to color classes
const statusColorMap = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  GENERATED: 'bg-blue-100 text-blue-800',
  EDITED: 'bg-purple-100 text-purple-800',
  APPROVED: 'bg-green-100 text-green-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
};

// Map of status to display text
const statusDisplayMap = {
  PENDING: 'Pending',
  GENERATED: 'AI Generated',
  EDITED: 'Edited',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
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