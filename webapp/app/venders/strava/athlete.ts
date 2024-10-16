"use server";

import { db } from "@trainme/db";
import axios from "axios";
import { trpc } from '@/app/api/trpc/client';
type GetAthleteParams = {
  persist: boolean;
};

export async function fetchAthlete({ persist = true }: GetAthleteParams): Promise<void> {
  const accessToken = trpc.strava.updateAccessToken.useQuery();

  const url = "https://www.strava.com/api/v3/athlete";
  const { data: athlete } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (persist) {
    await db.athlete.upsert({
      where: { id: athlete.id },
      update: athlete,
      create: athlete,
    });
  }
}
