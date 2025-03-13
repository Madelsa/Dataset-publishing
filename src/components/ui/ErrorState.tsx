/**
 * Error State Component
 * 
 * Reusable component for displaying error states
 * Includes error message, icon, and optional retry button
 */

import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorStateProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * Optional title for the error
   * @default 'Error'
   */
  title?: string;
  
  /**
   * Optional callback for retry action
   */
  onRetry?: () => void;
  
  /**
   * Optional callback for back/cancel action
   */
  onBack?: () => void;
  
  /**
   * Label for retry button
   * @default 'Try Again'
   */
  retryLabel?: string;
  
  /**
   * Label for back button
   * @default 'Go Back'
   */
  backLabel?: string;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function ErrorState({
  message,
  title = 'Error',
  onRetry,
  onBack,
  retryLabel = 'Try Again',
  backLabel = 'Go Back',
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`bg-red-50 p-6 rounded-lg ${className}`}>
      <div className="flex items-start">
        <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
        <div>
          <h2 className="text-lg font-medium text-red-800 mb-1">{title}</h2>
          <p className="text-sm text-red-700">{message}</p>
          
          {(onRetry || onBack) && (
            <div className="mt-4 flex space-x-4">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                >
                  {retryLabel}
                </button>
              )}
              
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {backLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 