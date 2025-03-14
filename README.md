# Dataset Publishing Platform

A web application for uploading, processing, and publishing datasets in CSV and Excel formats with AI-assisted metadata generation.

## Features

- File upload component supporting CSV and Excel files
- File parsing and validation
- Dataset metadata display and editing
- AI-powered metadata generation in multiple languages (English and Arabic)
- PostgreSQL database integration for storing dataset information
- Responsive UI with TailwindCSS
- Standardized status values (Needs Metadata, Pending Review, Approved, Rejected)
- Dataset review workflow with approval/rejection
- Feedback system for reviewers

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, React Dropzone
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **File Processing**: XLSX.js (Excel)
- **AI Services**: Google Gemini AI (1.5 Flash model)
- **Type Safety**: TypeScript with constant-based enums

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- Google Gemini API key (for AI metadata generation)

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Madelsa/Dataset-publishing.git
cd Dataset-publishing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. PostgreSQL Setup

#### Installation (if not already installed)

- **macOS**: `brew install postgresql@14` or download from [postgresql.org](https://www.postgresql.org/download/macosx/)

#### Start PostgreSQL Service

```bash
# Start PostgreSQL service with Homebrew
brew services start postgresql@14

# Check service status
brew services list | grep postgres
```

#### Create a Database

```bash
# Create the database
createdb dataset_publishing
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dataset_publishing?schema=public"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"
```

Notes:

- Replace `username` and `password` with your PostgreSQL credentials
- For the `username`, you can use your system username (find it with `whoami` command)
- The default `password` is usually `postgres`
- If you encounter permission issues, ensure you're using the correct username in the connection string

### 5. Get a Gemini API Key

- Go to [Google AI Studio](https://ai.google.dev/)
- Sign in with your Google account
- Navigate to "Get API key"
- Create a new API key or use an existing one
- Add the API key to your `.env` file

### 6. Set Up the Database

Run database migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

### 7. View Database Contents

Use Prisma Studio to view and manage database records:

```bash
npx prisma studio
```

This will open Prisma Studio at [http://localhost:5555](http://localhost:5555)

### 8. Start the Development Server

```bash
npm run dev
```

### 9. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Upload a Dataset

- Enter a dataset name (required) and optional description
- Drag and drop or select a CSV or Excel file (up to 50MB in size)
- Click "Upload Dataset"

### 2. Generate Metadata with AI

- After uploading a dataset, go to the metadata editor
- The system automatically generates metadata using AI
- Toggle between English and Arabic languages
- Edit the generated metadata as needed
- Save as draft or submit for review

### 3. Review Workflow

- Datasets with completed metadata can be submitted for review (status: "Pending Review")
- Reviewers can approve or reject datasets
- Feedback can be provided during approval or rejection
- Status badges indicate the current state of each dataset

## AI Metadata Generation

The application uses Google's Gemini 1.5 Flash model to generate metadata for datasets:

- **Model**: Gemini 1.5 Flash - An efficient, cost-effective model for text generation
- **Capabilities**: Generates title, description, tags, and category based on dataset content
- **Language Support**: English and Arabic metadata generation
- **Implementation**: The AI analyzes dataset column names and sample rows to understand the data

## Project Structure

- `src/app/components/` - React components
  - `FileUpload.tsx` - Component for uploading files
  - `DatasetInfo.tsx` - Component for displaying dataset information
  - `MetadataEditor.tsx` - Component for editing AI-generated metadata
  - `StatusBadge.tsx` - Component for displaying workflow status
- `src/app/api/datasets/` - API routes
  - `upload/route.ts` - API endpoint for file uploads
  - `[id]/metadata/route.ts` - API endpoint for metadata operations
  - `[id]/publish/route.ts` - API endpoint for publication workflow
- `src/lib/` - Utility functions
  - `prisma.ts` - Prisma client singleton
  - `aiMetadata.ts` - AI integration for metadata
- `src/services/` - Business logic services
  - `datasetService.ts` - Dataset management services
  - `fileService.ts` - File parsing and validation services
  - `metadataService.ts` - Metadata generation services
- `src/utils/` - Utility functions
  - `formatting.ts` - Text and data formatting utilities
  - `dataset.utils.ts` - Dataset-specific utilities
  - `api.utils.ts` - API response utilities
- `src/types/` - TypeScript type definitions
  - `metadata.types.ts` - Status value constants and type definitions
- `prisma/` - Database schema and migrations
  - `schema.prisma` - Prisma schema for Dataset and FileMetadata models

## Database Schema

### Dataset

- `id` - UUID primary key
- `name` - Dataset name
- `description` - Optional description
- `suggestedTitle` - AI-generated title
- `suggestedDescription` - AI-generated description
- `suggestedTags` - AI-generated tags
- `suggestedCategory` - AI-generated category
- `metadataLanguage` - Language of metadata ('en' or 'ar')
- `metadataStatus` - Status of metadata (NEEDS METADATA, PENDING REVIEW, APPROVED, REJECTED)
- `metadataDraft` - Current draft of metadata being edited
- `reviewComment` - Feedback from reviewers
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
- `sampleData` - Sample data for AI metadata generation (limited to 10 rows)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

## Database Management Reference

### Common Prisma Commands

```bash
# Create/update migrations
npx prisma migrate dev --name <migration-name>

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ CAUTION: deletes all data)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### PostgreSQL Commands Reference

```bash
# Start/stop PostgreSQL service
brew services start postgresql@14
brew services stop postgresql@14

# List all PostgreSQL databases
psql -l | cat

# Connect to a specific database
psql -d dataset_publishing

# List all tables in connected database
psql -d dataset_publishing -c "\dt"

# Describe a specific table
psql -d dataset_publishing -c "\d \"Dataset\""

# Create/drop a database
createdb database_name
dropdb database_name
```

## Troubleshooting

### Database Connection Issues

If you encounter connection issues:

1. Ensure PostgreSQL is running (`brew services list | grep postgres`)
2. Check your username in the DATABASE_URL (should match your system username)
3. Verify the database exists (`psql -l | cat`)
4. Make sure port 5432 is not blocked by another service

### File Upload Problems

- Maximum file size is 50MB
- Supported formats are CSV and Excel (.xlsx, .xls)
- Check browser console for detailed error messages
