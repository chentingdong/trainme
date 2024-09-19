-- DropIndex
DROP INDEX "workout_workout_id_key";

-- AlterTable
ALTER TABLE "workout" ADD CONSTRAINT "workout_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "workout_date" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "workout_id" UUID NOT NULL,
    "date" TEXT DEFAULT now(),
    "completed" BOOLEAN DEFAULT false,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "workout_date_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_date" ADD CONSTRAINT "workout_date_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
