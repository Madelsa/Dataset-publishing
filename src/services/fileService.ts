/**
 * File Service
 * 
 * Provides utilities for handling dataset files:
 * - Validates files for size and type constraints
 * - Processes CSV and Excel files to extract data
 * - Extracts metadata like row count and column names
 * - Handles errors gracefully with informative messages
 * 
 * This service is used during the dataset upload process to ensure
 * files meet requirements and to extract necessary information.
 */

import { FileValidationResult, ProcessedFile } from "@/types/dataset.types";
import * as XLSX from 'xlsx';
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, UPLOAD_ERROR_MESSAGES } from "@/constants/uploads";

/**
 * Validates a file for size and type
 * 
 * Checks if the file meets the platform's requirements:
 * - Size must be under the configured limit
 * - File extension must be one of the allowed types
 * 
 * @param file - The file to validate
 * @returns Validation result with status and error message if any
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: UPLOAD_ERROR_MESSAGES.SIZE_EXCEEDED
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: UPLOAD_ERROR_MESSAGES.INVALID_TYPE
    };
  }

  return { valid: true };
}

/**
 * Processes a file to extract data
 * 
 * Detects the file type and delegates to the appropriate parser:
 * - CSV and Excel files are both processed using the XLSX library
 * - Extracts metadata like row count and column names for database storage
 * - For large files, limits memory usage by only storing sample data
 * 
 * @param file - The file to process
 * @returns Processed file data with row count and column names
 */
export async function processFile(file: File): Promise<ProcessedFile> {
  try {
    const fileName = file.name.toLowerCase();

    // Use the unified parser for both CSV and Excel files
    if (fileName.endsWith('.csv') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return await parseFile(file);
    } else {
      return {
        rowCount: 0,
        columnNames: [],
        error: 'Unsupported file type'
      };
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return {
      rowCount: 0,
      columnNames: [],
      error: error instanceof Error ? error.message : 'Unknown error processing file'
    };
  }
}

/**
 * Unified parser for both CSV and Excel files
 * 
 * Handles both file types with optimized approaches:
 * - For CSV: Uses a lightweight custom parser that's fast and memory efficient
 * - For Excel: Uses XLSX.js with minimal memory footprint
 * 
 * @param file - The file to parse (CSV or Excel)
 * @returns Processed file data with row count and column names
 */
async function parseFile(file: File): Promise<ProcessedFile> {
  try {
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    
    // Use custom parser for all CSV files (more efficient)
    if (isCSV) {
      try {
        return await parseCSVEfficiently(file);
      } catch (csvError) {
        console.error("CSV parser error, falling back to XLSX:", csvError);
        // Fall back to XLSX parser if the CSV parser fails
      }
    }
    
    // Parse Excel files (or CSV files that failed with the custom parser)
    return await parseExcel(file);
  } catch (error) {
    console.error('Error parsing file:', error);
    return {
      rowCount: 0,
      columnNames: [],
      error: `Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Parse Excel files using the XLSX library
 * 
 * Simplified Excel parsing that only extracts what we need
 * 
 * @param file - The file to parse
 * @returns Processed file data
 */
async function parseExcel(file: File): Promise<ProcessedFile> {
  try {
    // Read the file as an array buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { rowCount: 0, columnNames: [], error: 'File contains no data sheets' };
    }
    
    const sheet = workbook.Sheets[sheetName];
    
    // Get header row
    const headers = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 })[0] as string[];
    if (!headers || headers.length === 0) {
      return { rowCount: 0, columnNames: [], error: 'File has no headers' };
    }
    
    const columnNames = headers.map(h => String(h).trim());
    
    // Get record count and ensure we have data rows
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const rowCount = range.e.r; // End row (0-indexed, excludes header)
    
    if (rowCount === 0) {
      return { rowCount: 0, columnNames, error: 'File contains headers but no data rows' };
    }
    
    // Extract sample data (up to 10 rows)
    const sampleRange = { 
      s: { r: 1, c: 0 }, 
      e: { r: Math.min(11, rowCount), c: range.e.c }
    };
    
    const sampleData = XLSX.utils.sheet_to_json(sheet, {
      header: columnNames,
      range: sampleRange,
      defval: null,
      blankrows: false
    }) as Record<string, any>[];
    
    return {
      rowCount,
      columnNames,
      sampleData: sampleData.slice(0, 10)
    };
  } catch (error) {
    console.error('Excel parsing error:', error);
    return {
      rowCount: 0, 
      columnNames: [],
      error: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Efficiently parse large CSV files by reading only necessary data
 * 
 * Simplified approach that focuses on reliability and extracting just what we need
 * 
 * @param file - The CSV file to parse
 * @returns Processed file data with row count and column names
 */
async function parseCSVEfficiently(file: File): Promise<ProcessedFile> {
  try {
    // Read just the beginning of the file (100KB is enough for samples)
    const chunkSize = 100 * 1024;
    const chunk = await readFileChunk(file, 0, Math.min(chunkSize, file.size));
    
    // Split into lines and find the header row
    const rows = chunk.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    
    if (rows.length < 2) {
      return { rowCount: 0, columnNames: [], error: 'Not enough rows in CSV file' };
    }
    
    // Parse the header row (simply split by comma for basic CSVs)
    const headerRow = rows[0];
    // Basic CSV parsing - for production you might want to handle quoted commas
    const columnNames = headerRow.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    if (columnNames.length === 0) {
      return { rowCount: 0, columnNames: [], error: 'No columns found in CSV header' };
    }
    
    // Build sample data from the first 10 data rows
    const sampleData = rows.slice(1, 11).map(row => {
      // Parse each row into fields
      const fields = parseCSVRowSimple(row);
      
      // Map fields to column names
      return columnNames.reduce((obj, colName, i) => {
        obj[colName] = i < fields.length ? fields[i] : null;
        return obj;
      }, {} as Record<string, any>);
    });
    
    // Estimate total rows (quick approximation based on file size and average row length)
    const avgRowLength = rows.slice(1).reduce((sum, row) => sum + row.length, 0) / (rows.length - 1);
    const estimatedRows = Math.max(Math.floor(file.size / avgRowLength), rows.length - 1);
    
    return {
      rowCount: estimatedRows,
      columnNames,
      sampleData
    };
  } catch (error) {
    console.error('CSV parsing error:', error);
    return {
      rowCount: 0,
      columnNames: [],
      error: error instanceof Error ? error.message : 'Unknown CSV parsing error'
    };
  }
}

/**
 * Simple CSV row parser
 * 
 * Handles basic CSV formatting including quoted values
 */
function parseCSVRowSimple(row: string): string[] {
  // Simple regex-based CSV parsing that handles quotes
  const matches = row.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || [];
  return matches
    .map(field => field.replace(/,$/g, '')) // Remove trailing commas
    .map(field => field.replace(/^"|"$/g, '')) // Remove surrounding quotes
    .map(field => field.replace(/""/g, '"')); // Replace double quotes with single quotes
}

/**
 * Helper function to read a chunk of a file
 * 
 * @param file - The file to read from
 * @param start - The starting byte position
 * @param end - The ending byte position
 * @returns A string containing the chunk data
 */
async function readFileChunk(file: File, start: number, end: number): Promise<string> {
  const slice = file.slice(start, end);
  const buffer = await slice.arrayBuffer();
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(buffer);
} 