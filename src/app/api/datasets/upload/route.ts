import { NextRequest, NextResponse } from 'next/server';
import { createDataset, datasetNameExists } from '@/services/datasetService';
import { processFile, validateFile } from '@/services/fileService';

/**
 * API Route: POST /api/datasets/upload
 * 
 * Purpose: Handle dataset file upload
 * Processes and validates uploaded CSV/Excel files and saves them to the database
 * 
 * @accepts FormData with:
 *   - file: The CSV or Excel file to upload
 *   - name: The dataset name (alphanumeric only)
 *   - description: Optional dataset description
 * 
 * @returns The created dataset object or error message
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';

    // Validate required input
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { message: 'Dataset name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate dataset name
    const nameExists = await datasetNameExists(name);
    if (nameExists) {
      return NextResponse.json(
        { message: 'A dataset with this name already exists. Please choose a different name.' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    // Process the file
    try {
      const processedFile = await processFile(file);
      
      if (processedFile.error) {
        return NextResponse.json(
          { message: processedFile.error },
          { status: 400 }
        );
      }

      // Save dataset to database
      const dataset = await createDataset(
        name, 
        description, 
        {
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type || (
            file.name.endsWith('.csv') 
              ? 'text/csv' 
              : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ),
          processedFile
        }
      );

      return NextResponse.json({
        message: 'File uploaded successfully',
        dataset
      }, { status: 201 });
    } catch (processingError) {
      return NextResponse.json(
        { message: `Error processing file: ${processingError instanceof Error ? processingError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: `An error occurred while processing the file: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/datasets/upload
 * 
 * Purpose: Informational endpoint
 * Informs clients that they should use POST for uploading datasets
 */
export async function GET() {
  return NextResponse.json({ message: 'Use POST to upload a dataset' });
} 