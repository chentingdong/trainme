import { db } from '@trainme/db';
import { protectedProcedure } from '@/server/trpc';

export const athlete = protectedProcedure.query(async ({ ctx }) => {
  const { userId } = ctx;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user?.athleteId != null) {
    const athlete = await db.athlete.findFirst({ where: { id: user.athleteId } });
    return athlete;
  }
  return null;
});
