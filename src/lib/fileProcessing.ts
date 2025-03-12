import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ParsedFile {
  data: any[];
  rowCount: number;
  columnNames: string[];
  error?: string;
}

/**
 * Parse a CSV file using PapaParse
 */
export const parseCSV = (file: File): Promise<ParsedFile> => {
  return new Promise((resolve, reject) => {
    try {
      // For server-side processing, we need to get the file content as text first
      file.text().then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as any[];
            const columnNames = results.meta.fields || [];
            
            resolve({
              data,
              rowCount: data.length,
              columnNames,
            });
          },
          error: (error: any) => {
            reject({
              error: error.message,
              data: [],
              rowCount: 0,
              columnNames: [],
            });
          },
        });
      }).catch((error: any) => {
        reject({
          error: error instanceof Error ? error.message : 'Failed to read file content',
          data: [],
          rowCount: 0,
          columnNames: [],
        });
      });
    } catch (error) {
      reject({
        error: error instanceof Error ? error.message : 'Unknown error parsing CSV',
        data: [],
        rowCount: 0,
        columnNames: [],
      });
    }
  });
};

/**
 * Parse an Excel file using XLSX.js
 */
export const parseExcel = async (file: File): Promise<ParsedFile> => {
  try {
    // Get file content as ArrayBuffer
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    // Get the first worksheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      return {
        data: [],
        rowCount: 0,
        columnNames: [],
        error: 'Excel file is empty',
      };
    }
    
    // First row is the header
    const columnNames = jsonData[0] as string[];
    
    // Data without the header
    const rows = jsonData.slice(1).map((row: any) => {
      const obj: Record<string, any> = {};
      columnNames.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
    
    return {
      data: rows,
      rowCount: rows.length,
      columnNames,
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to parse Excel file',
      data: [],
      rowCount: 0,
      columnNames: [],
    };
  }
};

/**
 * Process a file based on its type
 */
export const processFile = async (file: File): Promise<ParsedFile> => {
  try {
    const fileType = file.type;
    
    // Check file extension for Excel files
    const fileName = file.name.toLowerCase();
    const isExcel = 
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileName.endsWith('.xls') || 
      fileName.endsWith('.xlsx');
    
    // Check file type for CSV
    const isCSV = 
      fileType === 'text/csv' || 
      fileName.endsWith('.csv');
    
    if (isCSV) {
      return parseCSV(file);
    } else if (isExcel) {
      return parseExcel(file);
    } else {
      return {
        error: `Unsupported file type: ${fileType}. Please upload a CSV or Excel file.`,
        data: [],
        rowCount: 0,
        columnNames: [],
      };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error processing file',
      data: [],
      rowCount: 0,
      columnNames: [],
    };
  }
};

/**
 * Validate file size and type
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of 10MB`,
    };
  }
  
  // Validate file type
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.csv', '.xls', '.xlsx'];
  
  if (!validExtensions.some(ext => fileName.endsWith(ext))) {
    return {
      valid: false,
      error: 'Invalid file type. Only CSV and Excel files are supported.',
    };
  }
  
  return { valid: true };
}; 