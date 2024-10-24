import { getMany } from '@/server/routes/activities/getMany';
import { router } from '@/server/trpc';

export const activityRouter = router({
  getMany,
});