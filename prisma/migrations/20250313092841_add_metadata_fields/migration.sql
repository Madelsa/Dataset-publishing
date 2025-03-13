-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "metadataDraft" JSONB,
ADD COLUMN     "metadataLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "metadataStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "suggestedCategory" TEXT,
ADD COLUMN     "suggestedDescription" TEXT,
ADD COLUMN     "suggestedTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "suggestedTitle" TEXT;
