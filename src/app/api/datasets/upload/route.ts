import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processFile, validateFile } from '@/lib/fileProcessing';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';

    // Validate input
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

    // Validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    // Process the file
    const processedFile = await processFile(file);
    
    if (processedFile.error) {
      return NextResponse.json(
        { message: processedFile.error },
        { status: 400 }
      );
    }

    // Save dataset to database
    const dataset = await prisma.dataset.create({
      data: {
        name,
        description,
        fileMetadata: {
          create: {
            originalName: file.name,
            fileSize: file.size,
            fileType: file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
            rowCount: processedFile.rowCount,
            columnNames: processedFile.columnNames,
          }
        }
      },
      include: {
        fileMetadata: true
      }
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      dataset
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error processing file upload:', error);
    
    return NextResponse.json(
      { message: 'An error occurred while processing the file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to upload a dataset' });
} 