import { router } from '@/server/trpc';
import { athlete } from './athlete';
import { create } from './create';

export const userRouter = router({
  athlete,
  create,
});
