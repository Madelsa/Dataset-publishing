import { METADATA_STATUS } from '@/types/metadata.types';

/**
 * Format a date to a readable string
 * @param date The date to format, can be a Date object, string, or number
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns Formatted file size string (e.g. "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes) || bytes < 0) return 'Unknown size';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  // Handle edge case for very large files
  if (i >= sizes.length) return 'Very large file';
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate a string to a specified length with ellipsis
 * @param str The string to truncate
 * @param maxLength The maximum length of the string
 * @returns Truncated string with ellipsis if necessary
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Get a relative time string (e.g. "2 hours ago", "yesterday")
 * @param date The date to format
 * @returns Relative time string
 */
export function getRelativeTimeString(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Get CSS class for metadata status badges
 */
export function getMetadataStatusClass(status: string): string {
  switch (status) {
    case METADATA_STATUS.NEEDS_METADATA:
      return 'bg-purple-100 text-purple-800';
    case METADATA_STATUS.PENDING_REVIEW:
      return 'bg-yellow-100 text-yellow-800';
    case METADATA_STATUS.APPROVED:
      return 'bg-green-100 text-green-800';
    case METADATA_STATUS.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get human-readable description for metadata status
 */
export function getMetadataStatusDescription(status: string): string {
  switch (status) {
    case METADATA_STATUS.NEEDS_METADATA:
      return 'Needs metadata to be completed';
    case METADATA_STATUS.PENDING_REVIEW:
      return 'Pending review by supervisor';
    case METADATA_STATUS.APPROVED:
      return 'Approved and published';
    case METADATA_STATUS.REJECTED:
      return 'Rejected with feedback';
    default:
      return '';
  }
} 