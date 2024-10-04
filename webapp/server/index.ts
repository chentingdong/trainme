import { router } from './trpc';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { db } from '@trainme/db';
import superjson from 'superjson';
import { inferRouterOutputs } from '@trpc/server';
import { list } from '@/server/routes/workouts/list';

// Routers
export const appRouter = router({
  workouts: router({
    list
  }),
});

export const trpcSSRHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { db },
  transformer: superjson
});

export type AppRouter = typeof appRouter;
export type TRPCOutputs = inferRouterOutputs<AppRouter>;
