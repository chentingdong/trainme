import { db, PrismaClient } from '@trainme/db';
import { AnyRouter, initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { TRPCLink } from '@trpc/client';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { getAthleteId } from '@/app/api/chat/utils';

export type AuthContext = {
  db: PrismaClient;
  links?: Array<TRPCLink<AnyRouter>>;
  userId?: string;
  athleteId?: string;
};

const t = initTRPC.context<AuthContext>().create({
  transformer: superjson
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Perform authentication inside the middleware
  const { user } = await withAuth({ ensureSignedIn: true });
  
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    });
  }

  const athleteId = await getAthleteId();
  // Extend the context with userId
  const authContext: AuthContext = {
    ...ctx,
    userId: user.id,
    athleteId: athleteId,
    db
  };

  return next({
    ctx: authContext
  });
});
