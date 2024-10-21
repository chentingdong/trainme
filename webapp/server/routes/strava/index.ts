import { router } from '@/server/trpc';
import { disconnect } from './disconnect';
import { updateRefreshToken } from './updateRefreshToken';
import { updateAccessToken } from './updateAccessToken';

export const stravaRouter = router({
  updateRefreshToken,
  updateAccessToken,
  disconnect,
});
