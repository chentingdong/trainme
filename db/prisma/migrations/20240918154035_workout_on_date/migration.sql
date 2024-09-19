/*
  Warnings:

  - The primary key for the `workout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `workout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `workout` will be added. If there are existing duplicate values, this will fail.

*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AlterTable
ALTER TABLE "workout" DROP CONSTRAINT "workouts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4();

-- CreateIndex
CREATE UNIQUE INDEX "workout_workout_id_key" ON "workout"("id");
