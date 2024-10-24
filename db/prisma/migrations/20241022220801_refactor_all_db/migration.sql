/*
  Warnings:

  - You are about to drop the column `athlete` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the `sport_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workout_schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `athlete_id` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Made the column `activity` on table `lap` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `athlete_id` to the `workout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F', 'Other');

-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_activity_uuid_fkey";

-- DropForeignKey
ALTER TABLE "workout_schedule" DROP CONSTRAINT "workout_schedule_workout_id_fkey";

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "athlete",
ADD COLUMN     "athlete_id" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "calories" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "lap" ALTER COLUMN "id" SET DEFAULT 0,
ALTER COLUMN "activity" SET NOT NULL,
ALTER COLUMN "activity" SET DATA TYPE JSONB;

-- AlterTable
ALTER TABLE "workout" ADD COLUMN     "activity_uuid" UUID,
ADD COLUMN     "athlete_id" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feeling" INTEGER,
ADD COLUMN     "notes" VARCHAR(255),
ADD COLUMN     "rpe" INTEGER,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- DropTable
DROP TABLE "sport_type";

-- DropTable
DROP TABLE "workout_schedule";

-- CreateTable
CREATE TABLE "athlete" (
    "id" DOUBLE PRECISION NOT NULL,
    "username" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "sex" "Sex",
    "premium" BOOLEAN,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "badge_type_id" INTEGER,
    "profile" TEXT,
    "profile_medium" TEXT,
    "friend" TEXT,
    "friend_count" INTEGER,
    "follower" TEXT,
    "follower_count" INTEGER,
    "mutual_friend_count" INTEGER,
    "athlete_type" INTEGER,
    "date_preference" TEXT,
    "measurement_preference" TEXT,
    "ftp" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "resource_state" INTEGER,

    CONSTRAINT "athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport" (
    "active" BOOLEAN,
    "id" SERIAL NOT NULL,
    "sport_type" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "strava_refresh_token" TEXT,
    "strava_access_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "athlete_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_athlete_id_idx" ON "activity"("athlete_id");

-- CreateIndex
CREATE INDEX "lap_activity_id_idx" ON "lap"("activity_id");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout" ADD CONSTRAINT "workout_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
