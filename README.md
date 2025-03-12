# Dataset Publishing Platform

A web application for uploading, processing, and publishing datasets in CSV and Excel formats.

## Features

- File upload component supporting CSV and Excel files
- File parsing and validation
- Dataset metadata display
- PostgreSQL database integration for storing dataset information
- Responsive UI with TailwindCSS

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, React Dropzone
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **File Processing**: PapaParse (CSV), XLSX.js (Excel)

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dataset-publishing-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure PostgreSQL:

   - Create a PostgreSQL database named `dataset_publishing_platform`
   - Update the `.env` file with your PostgreSQL connection details:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/dataset_publishing_platform?schema=public"
     ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a Dataset**

   - Enter a dataset name (required) and optional description
   - Drag and drop or select a CSV or Excel file
   - Click "Upload Dataset"

2. **View Dataset Information**

   - After successful upload, view detailed information about the dataset
   - Toggle to see column information
   - Upload another dataset if needed

3. **View Database Contents with Prisma Studio**
   - Run the following command to open Prisma Studio:
     ```bash
     npx prisma studio
     ```
   - Prisma Studio will start on [http://localhost:5555](http://localhost:5555)
   - Browse and manage your datasets and file metadata through the visual interface

## Sample Data

For testing purposes, the following sample data files are included:

- `sample_data.csv` - A CSV file with fictional sales data (20 records)
- `sample_data.xlsx` - An Excel file with the same fictional sales data

These files can be used to test the upload and processing functionality of the platform.

## Project Structure

- `src/app/components/` - React components
  - `FileUpload.tsx` - Component for uploading files
  - `DatasetInfo.tsx` - Component for displaying dataset information
- `src/app/api/datasets/` - API routes
  - `upload/route.ts` - API endpoint for file uploads
- `src/lib/` - Utility functions
  - `prisma.ts` - Prisma client singleton
  - `fileProcessing.ts` - Functions for file parsing and validation
- `prisma/` - Database schema and migrations
  - `schema.prisma` - Prisma schema for Dataset and FileMetadata models

## Database Schema

### Dataset

- `id` - UUID primary key
- `name` - Dataset name
- `description` - Optional description
- `fileMetadata` - One-to-one relation to FileMetadata
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

### FileMetadata

- `id` - UUID primary key
- `datasetId` - Foreign key reference to Dataset
- `originalName` - Original filename
- `fileSize` - File size in bytes
- `fileType` - MIME type of file
- `rowCount` - Number of rows in the dataset
- `columnNames` - Array of column names
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

## Development

To make changes to the database schema, modify the `prisma/schema.prisma` file and run:

```bash
npx prisma migrate dev --name <migration-name>
```

To reset your development database (caution: this will delete all data):

```bash
npx prisma migrate reset
```

## Mini-Task 1 Requirements Completion

- ✅ File upload component for CSV and Excel files
- ✅ Service for parsing and validating files
- ✅ Display of file information (rows, columns, etc.)
- ✅ Error handling
- ✅ Database schema for datasets
