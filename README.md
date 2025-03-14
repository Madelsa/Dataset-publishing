# Dataset Publishing Platform

A web application for uploading, processing, and publishing datasets in CSV and Excel formats with AI-assisted metadata generation.

## Features

- File upload component supporting CSV and Excel files
- File parsing and validation
- Dataset metadata display and editing
- AI-powered metadata generation in multiple languages
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

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Madelsa/Dataset-publishing.git
   cd Dataset-publishing
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up PostgreSQL:

   - **Install PostgreSQL** (if not already installed):

     - **macOS**: `brew install postgresql@14` or download from [postgresql.org](https://www.postgresql.org/download/macosx/)

   - **Start PostgreSQL Service**:

     ```bash
     # Start PostgreSQL service with Homebrew
     brew services start postgresql@14

     # Check service status
     brew services list | grep postgres
     ```

   - **Create a database**:

     ```bash
     # Create the database
     createdb dataset_publishing_platform
     ```

   - **Database Connection Issues**:

     If you encounter permission issues like `User 'postgres' was denied access`, update your `.env` file to use your system username:

     ```
     # Replace 'postgres' with your system username
     DATABASE_URL="postgresql://yourusername:postgres@localhost:5432/dataset_publishing_platform?schema=public"
     ```

     You can get your system username with:

     ```bash
     whoami
     ```

   - **View Database Contents**:

     You can view your database in several ways:

     1. Using psql (command line):

     ```bash
     # List all tables
     psql -d dataset_publishing_platform -c "\dt"

     # Describe a specific table (note: use quotes for case sensitivity)
     psql -d dataset_publishing_platform -c "\d \"Dataset\""
     ```

     2. Using Prisma Studio (GUI):

     ```bash
     npx prisma studio
     ```

     Then visit http://localhost:5555 in your browser

     3. Using a PostgreSQL GUI client:

     - pgAdmin: https://www.pgadmin.org/download/
     - Postico (macOS): https://eggerapps.at/postico/
     - TablePlus: https://tableplus.com/

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

   - Datasets with completed metadata can be submitted for review (status: "Pending Review")
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

### PostgreSQL Management Commands

#### Starting and Stopping PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql@14

# Stop PostgreSQL service
brew services stop postgresql@14

# Check PostgreSQL service status
brew services list | grep postgres
```

#### Viewing Database Information

```bash
# List all PostgreSQL databases
psql -l | cat

# Connect to a specific database
psql -d database_name

# List all tables in a database
psql -d database_name -c "\dt"

# Describe a specific table (note: use quotes for case sensitivity)
psql -d database_name -c "\d \"TableName\""
```

#### Managing Databases

```bash
# Create a new database
createdb database_name

# Drop (delete) a database
dropdb database_name
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

- ✅ Standardized status values (Needs Metadata, Pending Review, Approved, Rejected)
- ✅ Review interface for datasets with "Pending Review" status
- ✅ Approval and rejection functionality with feedback
- ✅ Status tracking across the workflow
