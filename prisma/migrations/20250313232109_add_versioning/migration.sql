-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "versionHistory" JSONB[],
ALTER COLUMN "publicationStatus" DROP DEFAULT;
