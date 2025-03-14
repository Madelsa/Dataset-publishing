/*
  Warnings:

  - You are about to drop the column `publicationStatus` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Dataset` table. All the data in the column will be lost.
  - You are about to drop the column `versionHistory` on the `Dataset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "publicationStatus",
DROP COLUMN "publishedAt",
DROP COLUMN "version",
DROP COLUMN "versionHistory";
