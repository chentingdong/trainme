import { db } from "@trainme/db";
// import { endOfMonth } from 'date-fns';
// import { startOfMonth } from 'date-fns';
import { getAthleteId } from '@/app/api/chat/utils';

export const getMonthlyDb = async (aday: Date) => {
  // const monthStart = startOfMonth(aday);  
  // const monthEnd = endOfMonth(aday);
  const monthStart = new Date(aday);
  monthStart.setDate(monthStart.getDate() - 10);
  const monthEnd = new Date(aday);
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
          gte: monthStart.toISOString(),
          lt: monthEnd.toISOString(),
        },
        athleteId: athleteId,
      },
  });

  return activities;
};

