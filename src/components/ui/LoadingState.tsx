/**
 * Loading State Component
 * 
 * Reusable component for displaying loading states
 * Can be customized with different sizes and messages
 */

import React from 'react';

interface LoadingStateProps {
  /**
   * Optional message to display
   */
  message?: string;
  
  /**
   * Size of the loading spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'medium',
  className = '' 
}: LoadingStateProps) {
  const spinnerSizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-indigo-500 ${spinnerSizeClasses[size]}`}></div>
      {message && (
        <p className="mt-4 text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
} 