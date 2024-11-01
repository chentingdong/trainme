import { getMany } from '@/server/routes/activities/getMany';
import { router } from '@/server/trpc';
import { getWeeklyActivitiesSummary } from '@/server/routes/activities/getWeeklySummary';

export const activityRouter = router({
  getMany,
  getWeeklyActivitiesSummary
});