import { NextRequest, NextResponse } from 'next/server';
import { getDatasetById } from '@/services/datasetService';
import * as ExcelJS from 'exceljs';

/**
 * API Route: GET /api/datasets/[id]/download
 * 
 * Purpose: Download a dataset file
 * Returns the file data for the client to download
 * 
 * @param params.id - The unique identifier of the dataset to download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params in Next.js 14+
    const { id } = await Promise.resolve(params);
    
    // Get the dataset with its file metadata
    const dataset = await getDatasetById(id);
    
    if (!dataset || !dataset.fileMetadata) {
      return NextResponse.json(
        { message: 'Dataset or file metadata not found' },
        { status: 404 }
      );
    }
    
    // Get the file details
    const columnNames = dataset.fileMetadata.columnNames;
    const sampleData = dataset.fileMetadata.sampleData || [];
    const originalName = dataset.fileMetadata.originalName;
    const fileType = dataset.fileMetadata.fileType || '';
    
    // Determine if we should return an Excel file or CSV based on the original file extension
    const isExcel = originalName.endsWith('.xlsx') || originalName.endsWith('.xls') || 
                    fileType.includes('spreadsheetml') || fileType.includes('excel');
    
    if (isExcel) {
      // Generate Excel file
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');
      
      // Add header row
      worksheet.addRow(columnNames);
      
      // Add data rows - use all available sample data
      if (sampleData && Array.isArray(sampleData) && sampleData.length > 0) {
        sampleData.forEach(row => {
          const rowValues = columnNames.map(col => row[col] || '');
          worksheet.addRow(rowValues);
        });
      }
      
      // Generate xlsx buffer
      const buffer = await workbook.xlsx.writeBuffer();
      
      // Create response with appropriate headers
      const response = new NextResponse(buffer);
      response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.headers.set('Content-Disposition', `attachment; filename="${originalName}"`);
      
      return response;
    } else {
      // Generate CSV file
      let csvContent = columnNames.join(',') + '\n';
      
      // Add all sample data rows
      if (sampleData && Array.isArray(sampleData) && sampleData.length > 0) {
        sampleData.forEach(row => {
          const rowValues = columnNames.map(col => {
            const value = row[col];
            // Format the value properly for CSV
            if (value === undefined || value === null) {
              return '';
            } else if (typeof value === 'string') {
              // Escape quotes and wrap in quotes if contains comma
              if (value.includes(',') || value.includes('"')) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            } else {
              return String(value);
            }
          });
          csvContent += rowValues.join(',') + '\n';
        });
      }
      
      // Create response with appropriate headers
      const response = new NextResponse(csvContent);
      response.headers.set('Content-Type', 'text/csv');
      response.headers.set('Content-Disposition', `attachment; filename="${originalName}"`);
      
      return response;
    }
  } catch (error) {
    console.error('Error downloading dataset:', error);
    return NextResponse.json(
      { message: 'Error downloading dataset' },
      { status: 500 }
    );
  }
} 