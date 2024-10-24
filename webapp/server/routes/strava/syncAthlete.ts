import { protectedProcedure } from '@/server/trpc';
import { auth } from '@clerk/nextjs/server';
import { db, Prisma } from '@trainme/db';
import axios from "axios";

export async function fetchAthlete(accessToken: string): Promise<void> {
  const url = "https://www.strava.com/api/v3/athlete";
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // TODO: use Prisma.AthleteCreateInput mapping
  const athlete = {
    id: data.id,
    username: data.username,
    firstname: data.firstname,
    lastname: data.lastname,
    city: data.city,
    state: data.state,
    country: data.country,
    sex: data.sex,
    premium: data.premium,
    athleteType: data.athlete_type,
    datePreference: data.date_preference,
    badgeTypeId: data.badge_type_id,
    resourceState: data.resource_state,
    measurementPreference: data.measurement_preference,
    friend: data.friend,
    friendCount: data.friend_count,
    follower: data.follower,
    followerCount: data.follower_count,
    mutualFriendCount: data.mutual_friend_count,
    profile: data.profile,
    profileMedium: data.profile_medium,
    weight: data.weight,
    ftp: data.ftp,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
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


export const syncAthlete = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.userId;
  const user = await db.user.findUnique({ where: { id: userId } });
  const accessToken = user?.stravaAccessToken;
  if (!accessToken) {
    throw new Error('No access token found for user, need to connect to Strava.');
  }
  await fetchAthlete(accessToken);
});
