# Dataset Publishing Platform

A web application for uploading, processing, and publishing datasets in CSV and Excel formats with AI-assisted metadata generation.

## Features

- File upload component supporting CSV and Excel files
- File parsing and validation
- Dataset metadata display and editing
- AI-powered metadata generation in multiple languages
- PostgreSQL database integration for storing dataset information
- Responsive UI with TailwindCSS
- Simplified status badges for clear workflow status
- Dataset review workflow with approval/rejection
- Feedback system for reviewers

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, React Dropzone
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **File Processing**: XLSX.js (Excel)
- **AI Services**: Google Gemini AI (1.5 Flash model)

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- Google Gemini API key (for AI metadata generation)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Dataset-publishing
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up PostgreSQL:

   - **Install PostgreSQL** (if not already installed):

     - **macOS**: `brew install postgresql@14` or download from [postgresql.org](https://www.postgresql.org/download/macosx/)
     - **Windows**: Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)
     - **Linux**: Use your package manager (e.g., `sudo apt install postgresql-14`)

   - **Create a database**:

     ```bash
     # Connect to PostgreSQL
     psql -U postgres

     # Create the database
     CREATE DATABASE dataset_publishing;

     # Exit
     \q
     ```

4. Get a Gemini API key:

   - Go to [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Navigate to "Get API key"
   - Create a new API key or use an existing one
   - Copy the API key for the next step

5. Configure environment variables:

   - Create a `.env` file in the project root with the following content:

     ```
     # Database
     DATABASE_URL="postgresql://username:password@localhost:5432/dataset_publishing?schema=public"

     # Google Gemini API
     GEMINI_API_KEY="your_gemini_api_key"
     ```

   - Replace `username` and `password` with your PostgreSQL credentials
   - Replace `your_gemini_api_key` with the API key from step 4
   - Note: Other configuration parameters like file size limits are defined in the constants files

6. Run database migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a Dataset**

   - Enter a dataset name (required) and optional description
   - Drag and drop or select a CSV or Excel file (up to 50MB in size)
   - Click "Upload Dataset"

2. **Generate Metadata with AI**

   - After uploading a dataset, go to the metadata editor
   - The system automatically generates metadata using AI
   - Toggle between English and Arabic languages
   - Edit the generated metadata as needed
   - Save as draft or submit for review

3. **Review Workflow**

   - Datasets with completed metadata can be submitted for review
   - Reviewers can approve or reject datasets
   - Feedback can be provided during approval or rejection
   - Status badges indicate the current state of each dataset

4. **View Database Contents with Prisma Studio**
   - Run the following command to open Prisma Studio:
     ```bash
     npx prisma studio
     ```
   - Prisma Studio will start on [http://localhost:5555](http://localhost:5555)

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
- `metadataStatus` - Status of metadata (PENDING, GENERATED, EDITED, APPROVED)
- `metadataDraft` - Current draft of metadata being edited
- `publicationStatus` - Status of publication workflow (DRAFT, PENDING_REVIEW, REJECTED, PUBLISHED)
- `reviewComment` - Feedback from reviewers
- `fileMetadata` - One-to-one relation to FileMetadata
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update
- `publishedAt` - Timestamp of publication

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

## Database Management

### Creating a New Migration

When you make changes to your Prisma schema, create a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

### Applying Migrations to Production

To apply migrations to a production database:

```bash
npx prisma migrate deploy
```

### Resetting the Database

To completely reset your database (⚠️ CAUTION: this will delete all data):

```bash
npx prisma migrate reset
```

Or with force flag to skip confirmation:

```bash
npx prisma migrate reset --force
```

### Generating Prisma Client

After schema changes, regenerate the Prisma client:

```bash
npx prisma generate
```

## Development

To make changes to the database schema, modify the `prisma/schema.prisma` file and run:

```bash
npx prisma migrate dev --name <migration-name>
```

To reset your development database (caution: this will delete all data):

```bash
npx prisma migrate reset
```

## Requirements Completion

### Mini-Task 1: File Upload and Processing

- ✅ File upload component for CSV and Excel files
- ✅ Service for parsing and validating files
- ✅ Display of file information (rows, columns, etc.)
- ✅ Error handling
- ✅ Database schema for datasets

### Mini-Task 2: AI Metadata Generation

- ✅ AI-powered metadata generation for datasets
- ✅ Support for multiple languages (English, Arabic)
- ✅ Metadata editor with language switching
- ✅ Metadata persistence in database

### Mini-Task 3: Review Workflow

- ✅ Simplified status badges (Needs Metadata, Pending Review, Approved, Rejected)
- ✅ Review interface for datasets with "Pending Review" status
- ✅ Approval and rejection functionality with feedback
- ✅ Status tracking across the workflow
