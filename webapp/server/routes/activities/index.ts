import { getActivities, getPaginatedActivities } from '@/server/routes/activities/getActivities';
import { router } from '@/server/trpc';

export const activityRouter = router({
  getActivities,
  getPaginatedActivities,
});