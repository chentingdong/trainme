"use client";

import { getCurrentWeek } from "@/utils/timeUtils";
import { formatDate } from "date-fns";
import ActivitiesSummary from '@/app/activities/WeeklySummary';
import WorkoutsSummary from '@/app/workouts/WeeklySummary';

type Props = {
  //any day of the week.
  aday: Date;
};

export default function CalendarWeekHeader({ aday }: Props) {
  const week = getCurrentWeek(aday);

  return (
    <div className="flex gap-8 items-center mx-8">
      <h2 className="mx-2 p-2 rounded-md">
        {formatDate(week[0], "MMMM")} {formatDate(week[0], "dd")} -{" "}
        {formatDate(week[6], "dd")}
      </h2>
      <div className="flex gap-2 items-start">
        <h3 className="uppercase">Action</h3>
        <ActivitiesSummary aday={aday} />
      </div>
      <div className="flex gap-2 items-start">
        <h3 className="uppercase">Plan </h3>
        <WorkoutsSummary aday={aday} />
      </div>
    </div>
  );
}
