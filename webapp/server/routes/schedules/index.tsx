import { router } from '@/server/trpc';
import { createSchedule } from '@/server/routes/schedules/createSchedule';
import { getSchedules } from '@/server/routes/schedules/getSchedules';
import { deleteSchedule } from '@/server/routes/schedules/deleteSchedule';

export const schedulesRouter = router({
  getSchedules,
  createSchedule,
  deleteSchedule
});