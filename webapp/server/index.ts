import { db } from '@trainme/db';
import { router } from '@/server/trpc';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { inferRouterOutputs } from '@trpc/server';
import { workoutRouter } from '@/server/routes/workouts';
import { schedulesRouter } from '@/server/routes/schedules';

// Routers
export const appRouter = router({
  workouts: workoutRouter,
  schedules: schedulesRouter,
});

export const trpcSSRHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { db },
  transformer: superjson
});

export type AppRouter = typeof appRouter;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
