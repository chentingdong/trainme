"use server";

import { db } from "@/prisma";
import { sport_type as SportType } from "@trainme/db";

// TODO: use trpc 
export async function getActiveSportTypes(): Promise<SportType[]> {
  const sports = await db.sport_type.findMany({
    where: {
      active: true,
    },
  });

  return sports;
}
