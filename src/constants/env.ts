/**
 * Environment Variables
 * 
 * Type-safe access to environment variables with validation 
 * and sensible defaults for development
 */

/**
 * Gets an environment variable with validation
 * 
 * @param key The environment variable key
 * @param defaultValue Optional default value for development
 * @param required Whether the variable is required in production
 * @returns The environment variable value
 */
export function getEnv(
  key: string, 
  defaultValue?: string, 
  required = true
): string {
  const value = process.env[key] || defaultValue;
  
  if (!value && required && process.env.NODE_ENV === 'production') {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  return value || '';
}

// Database
export const DATABASE_URL = getEnv(
  'DATABASE_URL', 
  'postgresql://postgres:postgres@localhost:5432/dataset_publishing'
);

// AI Services
export const GEMINI_API_KEY = getEnv(
  'GEMINI_API_KEY', 
  'YOUR_API_KEY', 
  process.env.NODE_ENV === 'production'
); 