/*
  Warnings:

  - You are about to drop the column `type` on the `workout` table. All the data in the column will be lost.
  - You are about to drop the column `sport_type_id` on the `workout_schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `workout` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sport_type` on table `workout` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workout_id` on table `workout_schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schedule_date` on table `workout_schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_sport_type_id_fkey";

-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_workout_id_fkey";

-- AlterTable
CREATE SEQUENCE sport_type_id_seq;
ALTER TABLE "sport_type" ALTER COLUMN "id" SET DEFAULT nextval('sport_type_id_seq');
ALTER SEQUENCE sport_type_id_seq OWNED BY "sport_type"."id";

-- AlterTable
ALTER TABLE "workout" DROP COLUMN "type",
ALTER COLUMN "sport_type" SET NOT NULL,
ALTER COLUMN "sport_type" SET DEFAULT 'Run';

-- AlterTable
ALTER TABLE "workout_schedule" DROP COLUMN "sport_type_id",
ALTER COLUMN "workout_id" SET NOT NULL,
ALTER COLUMN "schedule_date" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workout_name_key" ON "workout"("name");

-- AddForeignKey
ALTER TABLE "workout_schedule" ADD CONSTRAINT "workout_schedule_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
