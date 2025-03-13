/**
 * Metadata Section Component
 * 
 * Displays the metadata for a dataset:
 * - Title
 * - Description
 * - Keywords/tags
 * - Category
 */

import React from 'react';

interface Metadata {
  title?: string;
  description?: string;
  keywords?: string[];
  category?: string;
}

interface MetadataSectionProps {
  /**
   * The metadata object
   */
  metadata: Metadata | null;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export default function MetadataSection({
  metadata,
  className = ''
}: MetadataSectionProps) {
  if (!metadata) {
    return null;
  }
  
  const hasMetadata = !!metadata.title || !!metadata.description || 
    (metadata.keywords && metadata.keywords.length > 0) || !!metadata.category;
  
  if (!hasMetadata) {
    return null;
  }
  
  return (
    <div className={`px-6 py-5 border-t border-gray-200 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
      
      <div className="space-y-6">
        {metadata.title && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Title</h4>
            <p className="mt-1 text-base text-gray-900">{metadata.title}</p>
          </div>
        )}
        
        {metadata.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 text-base text-gray-900 whitespace-pre-line">
              {metadata.description}
            </p>
          </div>
        )}
        
        {metadata.keywords && metadata.keywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Keywords</h4>
            <div className="mt-1 flex flex-wrap gap-2">
              {metadata.keywords.map((keyword: string, index: number) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {metadata.category && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Category</h4>
            <p className="mt-1 text-base text-gray-900">{metadata.category}</p>
          </div>
        )}
      </div>
    </div>
  );
} 