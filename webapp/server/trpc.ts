import { db, PrismaClient, User } from '@trainme/db';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { TRPCLink } from '@trpc/client';

type BaseContext = {
  db: PrismaClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links?: TRPCLink<any>[];
};
type AuthContext = BaseContext & {
  userId: string;
  user: User;
};

const t = initTRPC.context<BaseContext>().create({
  transformer: superjson
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Perform authentication inside the middleware
  const { userId } = auth();

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    });
  }

  // Fetch the user data
  const user = await db.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found'
    });
  }

  // Extend the context with userId and user
  const authContext: AuthContext = {
    ...ctx,
    userId,
    user,
    db
  };

  return next({
    ctx: authContext
  });
});
