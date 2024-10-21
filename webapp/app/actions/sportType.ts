"use server";

import { db } from "@/prisma";
import type { Sport } from "@trainme/db";

// TODO: use trpc 
export async function getActiveSportTypes(): Promise<Sport[]> {
  const sports = await db.sport.findMany({
    where: {
      active: true,
    },
  });

  return sports;
}
