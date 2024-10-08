import { router } from '@/server/trpc';
import { getSportTypes } from '@/server/routes/sports/getSportTypes';

export const sportRouter = router({
  getSportTypes,
});