import { db, PrismaClient } from '@trainme/db';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export type AuthContext = {
  db: PrismaClient;
  links?: Array<{ url: string; }>;
  userId?: string;
  orgId?: string;
};

const t = initTRPC.context<AuthContext>().create({
  transformer: superjson
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Perform authentication inside the middleware
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    });
  }

  // Extend the context with userId
  const authContext: AuthContext = {
    ...ctx,
    userId,
    db
  };

  return next({
    ctx: authContext
  });
});
