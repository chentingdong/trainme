"use server";

import { db } from "@/prisma";
import { sport_type as SportType } from "@trainme/db";

export async function getActiveSportTypes(): Promise<SportType[]> {
  const sports = await db.sport_type.findMany({
    where: {
      active: true,
    },
  });

  return sports;
}
