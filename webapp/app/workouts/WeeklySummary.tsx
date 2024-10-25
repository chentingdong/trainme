import { trpc } from '@/app/api/trpc/client';
import SportIcon from '@/app/activities/SportIcon';
import { formatTimeShort } from '@/utils/timeUtils';
import { WeeklyWorkoutsSummaryType } from '@/server/routes/workouts/getWeekly';

type Props = {
  //any day of the week.
  aday: Date;
};

export default function WeeklySummary({ aday }: Props) {
  const { data: weeklySummary } = trpc.workouts.getWeeklyWorkoutsSummary.useQuery({ aday }, {
    refetchInterval: false
  });

  return (
    <div className="flex flex-row gap-2">
      {weeklySummary?.map((s: WeeklyWorkoutsSummaryType) => (
        <div key={s.sportType} className="flex items-center gap-1">
          <SportIcon type={s.sportType} className="w-5 h-5" />
          {s._sum.distance > 0 && (
            <div className="flex flex-col text-center">
              <label className="mr-1 font-bold uppercase text-3xs">distance</label>
              <div className="text-2xs">{s._sum.distance.toFixed(2)} km</div>
            </div>
          )}
          {s._sum.duration > 0 && (
            <div className="flex flex-col text-center">
              <label className="mr-1 font-bold uppercase text-3xs">time</label>
              <div className="text-2xs">{formatTimeShort(s._sum.duration * 60)}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
