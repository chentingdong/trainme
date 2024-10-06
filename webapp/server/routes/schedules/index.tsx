import { router } from '@/server/trpc';
import { createWorkoutSchedule } from '@/server/routes/schedules/createWorkoutSchedule';
import { getWorkoutSchedules } from '@/server/routes/schedules/getWorkoutSchedules';
import { deleteWorkoutSchedule } from '@/server/routes/schedules/deleteWorkoutSchedule';

export const schedulesRouter = router({
  getWorkoutSchedules,
  createWorkoutSchedule,
  deleteWorkoutSchedule
});