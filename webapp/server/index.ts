import { db } from '@trainme/db';
import { router } from '@/server/trpc';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { inferRouterOutputs } from '@trpc/server';
import { workoutRouter } from '@/server/routes/workouts';
import { schedulesRouter } from '@/server/routes/schedules';
import { interceptStdout } from './stdoutInterceptor';
import { activityRouter } from '@/server/routes/activities';
import { sportRouter } from '@/server/routes/sports';

// Apply the stdout interception
interceptStdout();

// Routers
export const appRouter = router({
  activities: activityRouter,
  workouts: workoutRouter,
  schedules: schedulesRouter,
  sports: sportRouter
});

export const trpcSSRHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { db },
  transformer: superjson
});

export type AppRouter = typeof appRouter;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
