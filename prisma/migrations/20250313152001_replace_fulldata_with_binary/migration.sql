/*
  Warnings:

  - You are about to drop the column `fullData` on the `FileMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FileMetadata" DROP COLUMN "fullData",
ADD COLUMN     "fileBinary" BYTEA;
