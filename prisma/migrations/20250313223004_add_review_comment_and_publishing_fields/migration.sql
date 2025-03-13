/*
  Warnings:

  - You are about to drop the column `currentVersionId` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the `DatasetReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DatasetVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dataset" DROP CONSTRAINT "Dataset_currentVersionId_fkey";

-- DropForeignKey
ALTER TABLE "DatasetReview" DROP CONSTRAINT "DatasetReview_datasetId_fkey";

-- DropForeignKey
ALTER TABLE "DatasetVersion" DROP CONSTRAINT "DatasetVersion_datasetId_fkey";

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "currentVersionId",
DROP COLUMN "metadata",
ADD COLUMN     "publicationStatus" TEXT DEFAULT 'DRAFT',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ALTER COLUMN "metadataStatus" SET DEFAULT 'PENDING';

-- DropTable
DROP TABLE "DatasetReview";

-- DropTable
DROP TABLE "DatasetVersion";
