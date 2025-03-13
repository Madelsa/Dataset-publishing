/**
 * Empty State Component
 * 
 * Reusable component for displaying empty states (no data)
 * Includes a message, icon, and optional action button
 */

import React, { ReactNode } from 'react';
import { FiInfo } from 'react-icons/fi';

interface EmptyStateProps {
  /**
   * The message to display
   */
  message: string;
  
  /**
   * Optional title for the empty state
   * @default 'No Data Found'
   */
  title?: string;
  
  /**
   * Optional callback for primary action
   */
  onAction?: () => void;
  
  /**
   * Label for action button
   */
  actionLabel?: string;
  
  /**
   * Optional icon to display
   * @default FiInfo
   */
  icon?: ReactNode;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function EmptyState({
  message,
  title = 'No Data Found',
  onAction,
  actionLabel,
  icon = <FiInfo className="h-8 w-8 text-yellow-500" />,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`bg-yellow-50 p-6 rounded-lg text-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          {icon}
        </div>
        <h2 className="text-lg font-medium text-yellow-800 mb-2">{title}</h2>
        <p className="text-sm text-yellow-700 mb-6 max-w-md mx-auto">
          {message}
        </p>
        
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
} 