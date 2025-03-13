/**
 * Validation Utilities
 * 
 * A collection of helper functions for validating user input, form data,
 * and other application information.
 */

/**
 * Check if a string is empty (null, undefined, or contains only whitespace)
 * 
 * @param value - The string to check
 * @returns A boolean indicating if the string is empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === '';
}

/**
 * Check if a value is a valid number
 * 
 * @param value - The value to check
 * @returns A boolean indicating if the value is a valid number
 */
export function isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Check if a string contains only alphanumeric characters
 * 
 * @param value - The string to check
 * @returns A boolean indicating if the string is alphanumeric
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Check if a string is a valid email address
 * 
 * @param value - The string to check
 * @returns A boolean indicating if the string is a valid email
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Check if a value is within a numeric range
 * 
 * @param value - The value to check
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns A boolean indicating if the value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Check if a file size is within allowed limits
 * 
 * @param sizeInBytes - The file size in bytes
 * @param maxSizeInMB - The maximum allowed size in MB
 * @returns A boolean indicating if the file size is within limits
 */
export function isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

/**
 * Check if a file extension is in the list of allowed extensions
 * 
 * @param filename - The filename to check
 * @param allowedExtensions - The list of allowed extensions (e.g., ['.pdf', '.doc'])
 * @returns A boolean indicating if the file extension is allowed
 */
export function hasAllowedExtension(filename: string, allowedExtensions: string[]): boolean {
  const lowercaseName = filename.toLowerCase();
  return allowedExtensions.some(ext => lowercaseName.endsWith(ext));
} 