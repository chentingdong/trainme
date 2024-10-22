import { router } from '@/server/trpc';
import { athlete } from './athlete';

export const userRouter = router({
  athlete,
});
