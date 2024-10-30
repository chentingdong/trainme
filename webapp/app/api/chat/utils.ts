import { auth } from '@clerk/nextjs/server';
import { db } from '@trainme/db';

export const getAthleteId = async () => {
  const { userId } = await auth();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) { 
    throw new Error("User not found");
  }
  return user.athleteId; 
}