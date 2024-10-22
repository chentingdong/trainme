"use client";

import SportIcon from "@/app/activities/SportIcon";

import { PiPaperPlaneFill } from "react-icons/pi";
import { format } from "date-fns";
import type { Activity, Workout } from "@trainme/db";
import { useCalendarState } from '@/app/calendar/useCalendarState';
import { CalendarDayActivities } from "./CalendarDayActivity";
import { CalendarDayWorkouts } from "./CalendarDayWorkouts";

type CalendarDayProps = {
  date: Date;
  activities: Activity[];
  workouts: Workout[];
};

function CalendarDay({ date, activities, workouts }: CalendarDayProps) {
  const { scheduleDate, setScheduleDate } = useCalendarState();

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
              <SportIcon type={activity.sportType || ''} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-72 flex flex-col justify-between p-0 overflow-hidden bg-slate-200 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-70">
        <CalendarDayActivities activities={activities} />
        <CalendarDayWorkouts date={date} workouts={workouts} />
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
