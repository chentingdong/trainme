"use client";

import SportIcon from "@/app/activities/SportIcon";

import { FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { defaultWorkout, type Activity, type Workout } from "@trainme/db";
import { useCalendarState } from '@/app/calendar/useCalendarState';
import { CalendarDayActivities } from "./CalendarDayActivity";
import { CalendarDayWorkouts } from "./CalendarDayWorkouts";

type CalendarDayProps = {
  date: Date;
  activities: Activity[];
  workouts: Workout[];
  onWorkoutDrop: (workoutId: string, newDate: Date) => void;
};

function CalendarDay({ date, activities, workouts, onWorkoutDrop }: CalendarDayProps) {
  const { scheduleDate, setScheduleDate, setWorkout } = useCalendarState();

  const workoutButtonStyle: string = (() => {
    let cn = "btn btn-icon btn-workout border-none w-full";
    cn += " flex gap-4 items-center justify-center";
    cn += date?.getDate() === scheduleDate?.getDate() ? " active" : "";
    return cn;
  })();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const workoutId = event.dataTransfer.getData("workoutId");
    if (workoutId) {
      onWorkoutDrop(workoutId, date);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  function createWorkout(): void {
    setWorkout(defaultWorkout);
  }

  return (
    <div
      className="card rounded-sm justify-between h-full"
      onClick={() => setScheduleDate(date)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
      <div className="min-h-48 flex flex-col justify-between p-0 overflow-hidden bg-slate-200 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-70">
        <CalendarDayActivities activities={activities} />
        <CalendarDayWorkouts date={date} workouts={workouts} />
      </div>
      <div className="card-footer px-4 py-0.5">
        <button className={workoutButtonStyle} onClick={() => createWorkout()}>
          {format(date, "EEEE")}
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

export default CalendarDay;
