import { list } from '@/server/routes/workouts/list';
import { router } from '@/server/trpc';

export const workoutRouter = router({
  list,
});