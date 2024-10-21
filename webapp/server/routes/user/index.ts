import { router } from '@/server/trpc';
import { stravaConnected } from './strava';
import { athlete } from './athlete';

export const userRouter = router({
  athlete,
  stravaConnected,
});
