import { getMany } from '@/server/routes/activities/getMany';
import { router } from '@/server/trpc';
import { getWeeklyActivities, getWeeklyActivitiesSummary } from '@/server/routes/activities/getWeekly';

export const activityRouter = router({
  getMany,
  getWeeklyActivities,
  getWeeklyActivitiesSummary
});