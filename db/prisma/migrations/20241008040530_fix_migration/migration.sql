-- AddForeignKey
ALTER TABLE "lap" ADD CONSTRAINT "lap_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
