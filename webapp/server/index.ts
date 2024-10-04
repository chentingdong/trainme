import { router } from './trpc';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { db } from '@trainme/db';
import superjson from 'superjson';
import { inferRouterOutputs } from '@trpc/server';
import { workoutRouter } from '@/server/routes/workouts';

export const appRouter = router({
  workouts: workoutRouter,
});

export const trpcSSRHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { db },
  transformer: superjson
});

export type AppRouter = typeof appRouter;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
