import { db } from '@trainme/db';
import { AuthContext, router } from '@/server/trpc';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { inferRouterOutputs } from '@trpc/server';
import { workoutRouter } from '@/server/routes/workouts';
import { interceptStdout } from './stdoutInterceptor';
import { activityRouter } from '@/server/routes/activities';
import { sportRouter } from '@/server/routes/sports';
import { stravaRouter } from './routes/strava';
import { userRouter } from './routes/user';
import { httpBatchLink } from '@trpc/client';

// Apply the stdout interception
interceptStdout();

// Routers
export const appRouter = router({
  activities: activityRouter,
  workouts: workoutRouter,
  sports: sportRouter,
  strava: stravaRouter,
  user: userRouter
});

export const trpcSSRHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { db },
  transformer: superjson
});

export type AppRouter = typeof appRouter;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;



export const createTRPCContext = (): AuthContext => {
  return {
    db,
    links: [
      httpBatchLink({
        url: '/api/trpc'
      })
    ]
  };
};
