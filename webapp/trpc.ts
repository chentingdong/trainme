import { db, PrismaClient } from '@trainme/db';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

type BaseContext = {
  db: PrismaClient;
  links?: any;
};
type AuthContext = BaseContext & {
  userId: string;
  orgId: string;
};

const t = initTRPC.context<BaseContext>().create({
  transformer: superjson
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Perform authentication inside the middleware
  const { userId, orgId } = auth();

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    });
  }

  if (!orgId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Missing orgId'
    });
  }

  // Set app.orgId in the db session
  await ctx.db.$executeRawUnsafe(`SET app.orgId = '${orgId}'`);

  // Extend the context with userId and orgId
  const authContext: AuthContext = {
    ...ctx,
    userId,
    orgId,
    db
  };

  return next({
    ctx: authContext
  });
});

// Admins extend the protectedProcedure to check if the user is logged in.
export const adminProcedure = protectedProcedure.use(async opts => {
  const { orgRole } = auth();
  const isAdmin = orgRole === 'org:owner' || orgRole === 'org:admin';
  if (!isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next();
});
