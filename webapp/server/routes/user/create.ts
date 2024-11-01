import { db } from '@trainme/db';
import { protectedProcedure } from '@/server/trpc';
import { z } from 'zod';

export const create = protectedProcedure.input(z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string(),
})).mutation(async ({ ctx, input }) => {
  try {
    const { id } = input;
    if (ctx.userId !== id) {
      throw new Error("User ID mismatch");
    }

    const user = await db.user.findUnique({ where: { id } });
    if (user != null) {
      console.log('user already exists', user);
      return user;
    }

    const newUser = await db.user.create({ data: input });
    console.log('new user created', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user', error);
    throw error;
  }
}); 
