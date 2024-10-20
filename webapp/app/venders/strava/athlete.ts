"use server";

import { auth } from '@clerk/nextjs/server';
import { db } from "@trainme/db";
import axios from "axios";

type GetAthleteParams = {
  accessToken: string;
  persist: boolean;
};

export async function fetchAthlete({ accessToken, persist = true }: GetAthleteParams): Promise<void> {
  const url = "https://www.strava.com/api/v3/athlete";
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (persist) {
    // TODO: use Prisma.AthleteCreateInput mapping
    const athlete = {
      id: data.id,
      firstname: data.firstname ?? "",
      lastname: data.lastname ?? "",
      city: data.city ?? "",
      country: data.country ?? "",
      sex: data.sex ?? "",
      premium: data.premium ?? false,
      athleteType: data.athlete_type ?? 0,
      datePreference: data.date_preference ?? "",
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      badgeTypeId: data.badge_type_id ?? 0,
      resourceState: data.resource_state ?? 0,
      measurementPreference: data.measurement_preference ?? "",
      followerCount: data.follower_count ?? 0,
      friendCount: data.friend_count ?? 0,
      mutualFriendCount: data.mutual_friend_count ?? 0,
      profileMedium: data.profile_medium ?? "",
      profile: data.profile ?? "",
      weight: data.weight ?? 0,
    };

    await db.$transaction(async (tx) => {
      await tx.athlete.upsert({
        where: { id: data.id },
        update: athlete,
        create: athlete,
      });

      await db.user.update({
        where: { id: userId },
        data: {
          athleteId: data.id as number
        },
      });
    });
  }
}
