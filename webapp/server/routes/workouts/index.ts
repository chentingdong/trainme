import { router } from '@/server/trpc';
import { getById } from '@/server/routes/workouts/getById';
import { getMany } from '@/server/routes/workouts/getMany';
import { deleteById } from '@/server/routes/workouts/deleteById';
import { upsert } from '@/server/routes/workouts/upsert';
import { getWeeklyWorkoutsSummary } from '@/server/routes/workouts/getWeeklySummary';

export const workoutRouter = router({
  upsert,
  getById,
  getMany,
  deleteById,
  getWeeklyWorkoutsSummary
});
