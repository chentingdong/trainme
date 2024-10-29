import { db } from "@trainme/db";
import { endOfMonth } from 'date-fns';
import { startOfMonth } from 'date-fns';
import { getAthleteId } from '@/app/api/chat/utils';

export const getMonthlyDb = async (aday: Date) => {
  const monthStart = startOfMonth(aday).toISOString();  
  const monthEnd = endOfMonth(aday).toISOString();

  const athleteId = await getAthleteId();

  const activities = await db.activity.findMany({
    select: {
        name: true,
        sportType: true,
        averageSpeed: true,
        averageHeartrate: true,
        averageCadence: true,
        averageWatts: true,
        laps: true,
      },
      where: {
        startDateLocal: {
          gte: monthStart,
          lt: monthEnd,
        },
        athleteId: athleteId,
      },
  });

  return activities;
};

