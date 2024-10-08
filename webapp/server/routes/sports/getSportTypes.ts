import { protectedProcedure } from '@/server/trpc';
import { db } from '@trainme/db';

export const getSportTypes = protectedProcedure
  .query(async () => {
    const sportTypes = await db.sport_type.findMany({
      where: {
        active: true,
      },
    });

    return sportTypes;
  });