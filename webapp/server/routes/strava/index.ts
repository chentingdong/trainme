import { router } from '@/server/trpc';
import { disconnect } from './disconnect';
import { syncRefreshToken } from './syncRefreshToken';
import { syncAccessToken } from './syncAccessToken';
import { connected } from './connected';
import { syncAthlete } from '@/server/routes/strava/syncAthlete';
import { sync } from './sync';
export const stravaRouter = router({
  syncRefreshToken,
  syncAccessToken,
  connected,
  disconnect,
  syncAthlete,
  sync,
});
