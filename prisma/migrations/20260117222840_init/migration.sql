/*
  Warnings:

  - You are about to drop the column `url` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `url` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "url";
