import { router } from '@/server/trpc';
import { getActivityLaps } from '@/server/routes/laps/getActivityLaps';

export const schedulesRouter = router({
  getActivityLaps,
});