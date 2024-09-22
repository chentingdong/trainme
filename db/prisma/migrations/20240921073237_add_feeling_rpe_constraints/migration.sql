-- AlterTable
ALTER TABLE "workout_date" ADD COLUMN     "feeling" INTEGER DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "rpe" INTEGER DEFAULT 0;
