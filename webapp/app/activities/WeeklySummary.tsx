import { trpc } from '@/app/api/trpc/client';
import SportIcon from '@/app/activities/SportIcon';
import { WeeklyActivitiesSummaryType } from '@/server/routes/activities/getWeekly';
import { formatTimeShort } from '@/utils/timeUtils';

type Props = {
  //any day of the week.
  aday: Date;
};
export default function WeeklySummary({ aday }: Props) {
  const { data: weeklySummary } = trpc.activities.getWeeklyActivitiesSummary.useQuery({ aday }, {
    refetchInterval: false
  });

  return (
    <div className="flex flex-row gap-2">
      {weeklySummary?.map((s: WeeklyActivitiesSummaryType) => (
        <div key={s.sportType} className="flex items-center gap-1">
          <SportIcon type={s.sportType} className="w-5 h-5" />
          {s._sum.distance > 0 && (
            <div className="flex flex-col text-center items-start">
              <label className="mr-1 font-bold uppercase text-3xs">distance</label>
              <div className="text-2xs">{s._sum.distance} km</div>
            </div>
          )}
          {s._sum.movingTime > 0 && (
            <div className="flex flex-col text-center items-start">
              <label className="mr-1 font-bold uppercase text-3xs">time</label>
              <div className="text-2xs">{formatTimeShort(s._sum.movingTime)}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}