"use client";

import { formatTimeSeconds } from "@/utils/timeUtils";
import { formatDistance } from "@/utils/distanceUtils";
import type { Activity } from "@trainme/db";
import { format } from "date-fns";
import SportIcon from "../activities/SportIcon";
import { useCalendarState } from '@/app/calendar/useCalendarState';

type Props = {
  activities: Activity[];
};

export function CalendarDayActivities({ activities }: Props) {
  const { setActivity } = useCalendarState();

  return (<>
    <ul className="mx-0.25 shadow-sm">
      {activities?.map((activity, index) => (
        <li
          key={index}
          className="my-1 cursor-pointer"
          onClick={() => setActivity(activity)}
        >
          <CalendarDayActivity activity={activity} />
        </li>
      ))}
    </ul>
  </>
  );
}

export function CalendarDayActivity({ activity }: { activity: Activity; }) {
  return (
    <div className="card">
      <div className="card-header text-sm flex items-center justify-between">
        <div className="flex items-center">
          <SportIcon type={activity.sportType} withColor={true} />
        </div>
        <div>
          {activity.startDateLocal
            ? format(activity.startDateLocal, "p")
            : "Invalid date"}
        </div>
      </div>
      <div className="card-body cursor-pointer flex justify-between">
        <div>{formatTimeSeconds(activity.movingTime || 0)}</div>
        <div>
          {(activity.distance ?? 0) > 0 &&
            formatDistance(activity.distance ?? 0)}{" "}
          miles
        </div>
      </div>
    </div>
  );
}