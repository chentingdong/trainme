"use client";

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import SportIcon from "@/app/activities/SportIcon";
=======
import SportIcon from "../activities/SportIcon";
>>>>>>> 59c794b (rename file. workout save and schedule write to db successfully)

import { PiPaperPlaneFill } from "react-icons/pi";
import { format } from "date-fns";
import type { Activity } from "@trainme/db";
import { getActivitiesByDate } from "@/server/routes/strava/activities";
=======
import SportIcon from "@/app/activities/SportIcon";

import { PiPaperPlaneFill } from "react-icons/pi";
import { format } from "date-fns";
import { useScheduleStore } from "@/app/components/useScheduleStore";
import type { activity as Activity } from "@trainme/db";
import { getActivitiesByDate } from "@/app/api/strava/activities";
import { useActivityStore } from "../components/useActivityStore";
>>>>>>> 8caedcf (daily workout list works)
import Loading from "@/app/components/Loading";
import dynamic from "next/dynamic";
import { useCalendarState } from '@/app/calendar/useCalendarState';

const CalendarDayActivities = dynamic(
  async () => {
    const { CalendarDayActivities } = await import("./CalendarDayActivity");
    return CalendarDayActivities;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

const CalendarDayWorkouts = dynamic(
  async () => {
    const { CalendarDayWorkouts } = await import("./CalendarDayWorkouts");
    return CalendarDayWorkouts;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  },
);


type CalendarDayProps = {
  date: Date;
};

function CalendarDay({ date }: CalendarDayProps) {
  const { scheduleDate, setScheduleDate } = useCalendarState();

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivitiesByDate(date).then((data) => {
      setActivities(data);
    });
  }, [date, setActivities]);


  const workoutButtonStyle: string = (() => {
    let cn = "btn btn-icon btn-workout border-none w-full";
    cn += " flex gap-4 items-center justify-center";
    cn += date?.getDate() === scheduleDate?.getDate() ? " active" : "";
    return cn;
  })();

  return (
    <div
      className="card rounded-sm justify-between h-full"
      onClick={() => setScheduleDate(date)}
    >
      <div className="card-header p-1 flex justify-between">
        <div className="flex gap-2 items-center">{date.getDate()}</div>
        <div className="flex gap-2">
          {activities?.map((activity) => (
            <div key={activity.id}>
<<<<<<< HEAD
              <SportIcon type={activity.sportType || ''} />
=======
              <SportIcon type={activity.type || ''} />
>>>>>>> 59c794b (rename file. workout save and schedule write to db successfully)
            </div>
          ))}
        </div>
      </div>
      <div className="h-72 flex flex-col justify-between p-0 overflow-hidden bg-slate-200 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-70">
        <CalendarDayActivities date={date} />
        <CalendarDayWorkouts date={date} />
      </div>
      <div className="card-footer px-4 py-0.5">
        <button className={workoutButtonStyle}>
          {format(date, "EEEE")}
          <PiPaperPlaneFill width={200} />
        </button>
      </div>
    </div>
  );
}

export default CalendarDay;
