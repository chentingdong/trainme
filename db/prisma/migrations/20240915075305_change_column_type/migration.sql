/*
  Warnings:

  - The `workout` column on the `workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "workout" DROP COLUMN "workout",
ADD COLUMN     "workout" JSONB;
