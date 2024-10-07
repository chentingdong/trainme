"use onent";

import React from "react";
import { formatTimeSeconds } from "@/utils/timeUtils";
import { formatDistance } from "@/utils/distanceUtils";
import type { activity as Activity } from "@trainme/db";
import { endOfDay, format, startOfDay } from "date-fns";
import SportIcon from "../activities/SportIcon";
import { trpc } from '@/app/api/trpc/client';
import { useCalendarState } from '@/app/calendar/useCalendarState';

type Props = {
  date: Date;
};

export function CalendarDayActivities({ date }: Props) {
  const { setActivity } = useCalendarState();
  const { data: activities } = trpc.activities.getActivities.useQuery({
    filter: {
      start_date_local: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
    },
    orderBy: {
      start_date_local: 'asc'
    }
  });

  return (
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
  );
}

export function CalendarDayActivity({ activity }: { activity: Activity; }) {
  return (
    <div className="card">
      <div className="card-header text-sm flex items-center justify-between">
        <div className="flex items-center">
          <SportIcon type={activity.type} withColor={true} />
        </div>
        <div>
          {activity.start_date_local
            ? format(activity.start_date_local, "p")
            : "Invalid date"}
        </div>
      </div>
      <div className="card-body cursor-pointer flex justify-between">
        <div>{formatTimeSeconds(activity.moving_time || 0)}</div>
        <div>
          {(activity.distance ?? 0) > 0 &&
            formatDistance(activity.distance ?? 0)}{" "}
          miles
        </div>
      </div>
    </div>
  );
}