import { router } from '@/server/trpc';
import { getWorkouts } from '@/server/routes/workouts/getWorkouts';
import { getWorkout } from '@/server/routes/workouts/getWorkout';
import { updateWorkout } from '@/server/routes/workouts/updateWorkout';

export const workoutRouter = router({
  getWorkouts,
  getWorkout,
  updateWorkout
});