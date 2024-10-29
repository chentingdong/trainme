import { getAthleteId } from '@/app/api/chat/utils';
import { db } from "@trainme/db";
// import { endOfMonth, startOfMonth } from 'date-fns';

export const getMonthlyDb = async (aday: Date) => {
  // const monthStart = startOfMonth(aday);  
  // const monthEnd = endOfMonth(aday);
  const monthStart = new Date(aday);
  monthStart.setDate(monthStart.getDate() - 10);
  const monthEnd = new Date(aday);

  const athleteId = await getAthleteId();

  const workouts = await db.workout.findMany({
    select: {
      name: true,
      date: true,
      description: true,
      sportType: true,
      distance: true,
      duration: true,
      feeling: true,
      rpe: true,
      notes: true,
      steps: true,
      activityUuid: true,
    },
    where: {
      athleteId: athleteId,
      date: {
        gte: monthStart.toISOString(),
        lt: monthEnd.toISOString(),
      },
    },
  });

  return workouts;
};
