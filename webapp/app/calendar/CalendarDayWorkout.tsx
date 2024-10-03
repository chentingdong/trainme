"use client";

import React, { useEffect } from "react";
import Loading from "@/app/components/Loading";
import { WorkoutChart } from "../workouts/WorkoutChart";
import { useWorkoutStore } from "@/app/components/useWorkoutStore";
import type { workout_schedule as ScheduledWorkout } from "@trainme/db";
import { cn } from "@/utils/helper";
import ActivityIcon from "../activities/ActivityIcon";
import { IoClose } from "react-icons/io5";
import { useScheduleStore } from '@/app/components/useScheduleStore';

export function CalendarDayWorkout({
  scheduledWorkout,
  scheduledWorkouts,
  setScheduledWorkouts,
}: {
    scheduledWorkout: ScheduledWorkout;
    scheduledWorkouts: ScheduledWorkout[];
    setScheduledWorkouts: (scheduledWorkouts: ScheduledWorkout[]) => void;
}) {
  const { workout, refetchWorkout } = useWorkoutStore();
  const {
    workout: editorWorkout,
    setWorkout: setEditorWorkout,
  } = useWorkoutStore();
  const { unScheduleWorkout } = useScheduleStore();

  useEffect(() => {
    if (scheduledWorkout.workout_id) {
      refetchWorkout(scheduledWorkout.workout_id);
    }
  }, []);

  const handleUnschedule = () => {
    unScheduleWorkout(scheduledWorkout.id);
    setScheduledWorkouts(scheduledWorkouts.filter(workout => workout.id !== scheduledWorkout.id));
  };

  if (!workout) return <Loading />;

  return (
    <div
      className={cn([
        "card cursor-pointer border-2",
        workout.id === editorWorkout?.id
          ? "border-yellow-300"
          : "border-transparent",
      ])}
      onClick={() => setEditorWorkout(workout)}
    >
      <div className="card-header flex justify-between items-center gap-2 p-0">
        <ActivityIcon type={workout.type} withColor={false} />
        <div className="flex-grow">{workout.name}</div>
        <button className="btn btn-icon btn-danger" onClick={handleUnschedule}>
          <IoClose />
        </button>
      </div>
      <div className="card-body">
        <div className="h-10 w-full text-2xs">
          <WorkoutChart workout={workout} />
        </div>
      </div>
    </div>
  );
}
