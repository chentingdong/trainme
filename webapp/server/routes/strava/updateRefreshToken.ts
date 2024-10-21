import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';
import { getRefreshToken } from '@/app/venders/strava/authorize/getRefreshToken';

export const updateRefreshToken = protectedProcedure
  .input(z.object({ code: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { code } = input;
    const { userId } = ctx;

    const result = await getRefreshToken({ userId, code });
    return result;
  });
