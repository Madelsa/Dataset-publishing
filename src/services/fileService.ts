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
import { parse } from 'csv-parse/sync';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.csv', '.xls', '.xlsx'];

/**
 * Validates a file for size and type
 * 
 * Checks if the file meets the platform's requirements:
 * - Size must be under 10MB
 * - File extension must be one of the allowed types (.csv, .xls, .xlsx)
 * 
 * @param file - The file to validate
 * @returns Validation result with status and error message if any
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size (max 10MB)
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Processes a file to extract data
 * 
 * Detects the file type and delegates to the appropriate parser:
 * - CSV files are parsed using the csv-parse library
 * - Excel files are parsed using the xlsx library
 * 
 * Extracts metadata like row count and column names for database storage
 * and AI metadata generation.
 * 
 * @param file - The file to process
 * @returns Processed file data with row count and column names
 */
export async function processFile(file: File): Promise<ProcessedFile> {
  try {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      return await parseCSV(file);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return await parseExcel(file);
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
 * Parses a CSV file
 * 
 * Reads the CSV file content and converts it to structured data:
 * - Uses the csv-parse library for reliable parsing
 * - Extracts column names from the header row
 * - Counts the number of data rows
 * - Handles empty files and parsing errors
 * 
 * @param file - The CSV file to parse
 * @returns Processed file data with row count and column names
 */
async function parseCSV(file: File): Promise<ProcessedFile> {
  try {
    // Try parsing with csv-parse
    const fileContent = await file.text();
    
    // Check if this might be an Excel-exported CSV (common formatting issues)
    if (fileContent.includes('\r\n') || fileContent.match(/[0-9]+\.[0-9]{3,}/g)) {
      // This might be an Excel-exported CSV with Excel-specific formats
      // Try parsing with XLSX for better handling
      return await parseAsExcelCSV(file, fileContent);
    }
    
    // Standard CSV parsing
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true // Handle Byte Order Mark if present
    });
    
    if (records.length === 0) {
      return {
        rowCount: 0,
        columnNames: [],
        error: 'CSV file is empty or has no valid data'
      };
    }
    
    // Extract column names from the first record
    const columnNames = Object.keys(records[0]);
    
    // Validate that we have actual column data
    const hasData = columnNames.length > 0 && records.some((record: Record<string, any>) => 
      columnNames.some(col => record[col] !== undefined && record[col] !== null && record[col] !== '')
    );
    
    if (!hasData) {
      return {
        rowCount: 0,
        columnNames: [],
        error: 'CSV file structure could not be properly detected'
      };
    }
    
    return {
      rowCount: records.length,
      columnNames,
      sampleData: records.slice(0, 5), // Include sample data for metadata generation
      fullData: records // Store the full dataset
    };
  } catch (error) {
    console.error('Error parsing CSV with csv-parse:', error);
    // Fall back to Excel parsing if csv-parse fails
    return await parseAsExcelCSV(file);
  }
}

/**
 * Parses a CSV file as if it were an Excel-exported CSV
 * 
 * Some CSV files, especially those exported from Excel, have special formatting
 * that the csv-parse library might not handle well. This function uses the XLSX
 * library as a fallback for better compatibility.
 * 
 * @param file - The CSV file to parse
 * @param content - Optional pre-loaded file content
 * @returns Processed file data with row count and column names
 */
async function parseAsExcelCSV(file: File, content?: string): Promise<ProcessedFile> {
  try {
    // If content wasn't provided, load it
    const arrayBuffer = content ? (new TextEncoder().encode(content)).buffer : await file.arrayBuffer();
    
    // Use XLSX to parse the CSV
    const workbook = XLSX.read(arrayBuffer, {type: content ? 'string' : 'array'});
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with header rows
    const records = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    
    if (records.length <= 1) { // Just header or empty
      return {
        rowCount: 0,
        columnNames: [],
        error: 'CSV file is empty or has only headers'
      };
    }
    
    // First row should be headers
    const headers = records[0] as string[];
    const columnNames = headers.map(h => String(h).trim());
    
    // Convert data to objects with column names
    const dataRecords = records.slice(1).map(row => {
      const record: Record<string, any> = {};
      columnNames.forEach((col, i) => {
        record[col] = i < (row as any[]).length ? (row as any[])[i] : null;
      });
      return record;
    });
    
    return {
      rowCount: dataRecords.length,
      columnNames,
      sampleData: dataRecords.slice(0, 5), // Include sample data for metadata generation
      fullData: dataRecords // Store the full dataset
    };
  } catch (error) {
    console.error('Error parsing CSV as Excel CSV:', error);
    return {
      rowCount: 0,
      columnNames: [],
      error: 'Error parsing CSV file - file may be corrupted or in an unsupported format'
    };
  }
}

/**
 * Parses an Excel file
 * 
 * Reads the Excel file content and converts it to structured data:
 * - Uses the xlsx library for reliable parsing
 * - Processes the first sheet in the workbook
 * - Extracts column names from the header row
 * - Counts the number of data rows
 * - Handles empty files and parsing errors
 * 
 * @param file - The Excel file to parse
 * @returns Processed file data with row count and column names
 */
async function parseExcel(file: File): Promise<ProcessedFile> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with proper headers
    const records = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      blankrows: false
    });
    
    if (records.length <= 1) { // Just headers or empty
      return {
        rowCount: 0,
        columnNames: [],
        error: 'Excel file is empty or has only headers'
      };
    }
    
    // First row should be headers
    const headers = records[0] as string[];
    const columnNames = headers.map(h => String(h).trim());
    
    // Convert data to objects with column names
    const dataRecords = records.slice(1).map(row => {
      const record: Record<string, any> = {};
      columnNames.forEach((col, i) => {
        record[col] = i < (row as any[]).length ? (row as any[])[i] : null;
      });
      return record;
    });
    
    return {
      rowCount: dataRecords.length,
      columnNames,
      sampleData: dataRecords.slice(0, 5), // Include sample data for metadata generation
      fullData: dataRecords // Store the full dataset
    };
  } catch (error) {
    console.error('Error parsing Excel:', error);
    return {
      rowCount: 0,
      columnNames: [],
      error: 'Error parsing Excel file'
    };
  }
} 