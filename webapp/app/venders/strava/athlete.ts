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
  const { data: athlete } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (persist) {
    const athleteData = {
      id: athlete.id,
      firstname: athlete.firstname ?? "",
      lastname: athlete.lastname ?? "",
      city: athlete.city ?? "",
      country: athlete.country ?? "",
      sex: athlete.sex ?? "",
      premium: athlete.premium ?? false,
      athleteType: athlete.athlete_type ?? 0,
      datePreference: athlete.date_preference ?? "",
      createdAt: new Date(athlete.created_at),
      updatedAt: new Date(athlete.updated_at),
      badgeTypeId: athlete.badge_type_id ?? 0,
      resourceState: athlete.resource_state ?? 0,
      measurementPreference: athlete.measurement_preference ?? "",
      followerCount: athlete.follower_count ?? 0,
      friendCount: athlete.friend_count ?? 0,
      mutualFriendCount: athlete.mutual_friend_count ?? 0,
      profileMedium: athlete.profile_medium ?? "",
      profile: athlete.profile ?? "",
      weight: athlete.weight ?? 0,
    };

    await db.$transaction(async (tx) => {
      await tx.athlete.upsert({
        where: { id: athlete.id },
        update: athleteData,
        create: athleteData,
      });

      await db.user.update({
        where: { id: userId },
        data: {
          athleteId: athlete.id as number
        },
      });
    });
  }
}
