/*
  Warnings:

  - You are about to drop the column `createdAt` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `sport_type_id` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `workout_schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `lap` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "workout" DROP CONSTRAINT "workout_sport_type_id_fkey";

-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_activity_uuid_fkey";

-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_workout_id_fkey";

-- DropIndex
DROP INDEX "sport_type_sport_type_key";

-- DropIndex
DROP INDEX "workout_name_key";

-- DropIndex
DROP INDEX "workout_steps_key";

-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "athlete" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sport_type" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "sport_type" DROP NOT NULL,
ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "active" DROP DEFAULT;
DROP SEQUENCE "sport_type_id_seq";

-- AlterTable
ALTER TABLE "workout" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "sport_type_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "sport_type" TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "steps" DROP DEFAULT;

-- AlterTable
ALTER TABLE "workout_schedule" DROP COLUMN "status",
ALTER COLUMN "workout_id" DROP NOT NULL,
ALTER COLUMN "feeling" DROP DEFAULT,
ALTER COLUMN "rpe" DROP DEFAULT,
ALTER COLUMN "schedule_date" DROP NOT NULL,
ALTER COLUMN "schedule_date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "lap_id_key" ON "lap"("id");
