"use server";

import { prisma } from "@/prisma";
import { sport_type as SportType } from "@trainme/db";

export async function getActiveSportTypes(): Promise<SportType[]> {
  const sports = await prisma.sport_type.findMany({
    where: {
      active: true,
    },
  });

  return sports;
}
