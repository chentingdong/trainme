import { router } from '@/server/trpc';
import { stravaConnected } from './strava';

export const userRouter = router({
  stravaConnected,
});
