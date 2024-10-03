"use client";

import React, { useEffect, useState } from "react";
import ActivityIcon from "../activities/ActivityIcon";

import { PiPaperPlaneFill } from "react-icons/pi";
import { format } from "date-fns";
import { useScheduleStore } from "@/app/components/useScheduleStore";
import type { activity as Activity } from "@trainme/db";
import { getActivitiesByDate } from "@/app/api/strava/activities";
import { useActivityStore } from "../components/useActivityStore";
import type { workout_schedule as ScheduledWorkout } from "@trainme/db";
import Loading from "@/app/components/Loading";
import dynamic from "next/dynamic";

type CalendarDayProps = {
  date: Date;
};

const CalendarDayActivity = dynamic(
  async () => {
    const { CalendarDayActivity } = await import("./CalendarDayActivity");
    return CalendarDayActivity;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

const CalendarDayWorkout = dynamic(
  async () => {
    const { CalendarDayWorkout } = await import("./CalendarDayWorkout");
    return CalendarDayWorkout;
  },
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

function CalendarDay({ date }: CalendarDayProps) {
  const { setActivity } = useActivityStore();
  const { scheduleDate, setScheduleDate, refetchScheduledWorkouts } = useScheduleStore();

  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivitiesByDate(date).then((data) => {
      setActivities(data);
    });
  }, [date, setActivities]);

  useEffect(() => {
    refetchScheduledWorkouts(date).then((newScheduledWorkouts) => {
      setScheduledWorkouts(newScheduledWorkouts);
    });
  }, [date, refetchScheduledWorkouts, setScheduledWorkouts]);

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
              <ActivityIcon type={activity.type} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-72 flex flex-col justify-between p-0 overflow-hidden bg-slate-200 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-70">
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
        <ul className="mx-0.25 shadow-sm">
          {scheduledWorkouts?.map((scheduledWorkout) => (
            <li key={scheduledWorkout.id} className="my-1 cursor-pointer">
              <CalendarDayWorkout
                scheduledWorkout={scheduledWorkout}
                scheduledWorkouts={scheduledWorkouts}
                setScheduledWorkouts={setScheduledWorkouts} />
            </li>
          ))}
        </ul>
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
