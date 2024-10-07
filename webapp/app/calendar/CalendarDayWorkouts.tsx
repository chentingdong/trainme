"use client";

import Loading from "@/app/components/Loading";
import { WorkoutChart } from "../workouts/WorkoutChart";
import { useCalendarState } from "@/app/calendar/useCalendarState";
import { cn } from "@/utils/helper";
import SportIcon from "@/app/activities/SportIcon";
import { IoClose } from "react-icons/io5";
import { trpc } from '@/app/api/trpc/client';
import { emptyWorkout } from '@/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export function CalendarDayWorkouts({
  date
}: {
  date: Date;
  }) {

  const utils = trpc.useUtils();
  const { scheduleDate, workout: editorWorkout, setWorkout: setEditorWorkout } = useCalendarState();

  const { data: workoutSchedules, isLoading, isError } = trpc.schedules.getWorkoutSchedules.useQuery({
    filter: {
      schedule_date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });

  const deleteWorkoutSchedule = trpc.schedules.deleteWorkoutSchedule.useMutation({
    onSuccess: () => {
      utils.schedules.getWorkoutSchedules.invalidate({
        filter: {
          schedule_date: {
            gte: startOfDay(scheduleDate),
            lte: endOfDay(scheduleDate),
          },
        },
      });
    },
    onError: (error) => {
      throw new Error("Failed to delete workout: " + error);
    },
  });

  const handleUnscheduleWorkout = (id: string) => {
    deleteWorkoutSchedule.mutate({ id: id });
    setEditorWorkout(emptyWorkout);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading workouts</div>;
  if (!workoutSchedules) return <div>No workouts</div>;

  return (
    <ul className="mx-0.25 shadow-sm">
      {workoutSchedules?.map((workoutSchedule) => (
        <li key={workoutSchedule.id} className="my-1 cursor-pointer">
          <div
            className={cn([
              "card cursor-pointer border-2",
              workoutSchedule.workout_id === editorWorkout?.id
                ? "border-yellow-300"
                : "border-transparent",
            ])}
            onClick={() => workoutSchedule.workout && setEditorWorkout(workoutSchedule.workout)}
          >
            <div className="card-header flex justify-between items-center gap-2 p-0">
              <SportIcon type={workoutSchedule.workout.sport_type || ''} withColor={false} />
              <div className="flex-grow">{workoutSchedule.workout?.name}</div>
              <button className="btn btn-icon btn-danger" onClick={() => handleUnscheduleWorkout(workoutSchedule.id)}>
                <IoClose />
              </button>
            </div>
            <div className="card-body">
              <div className="h-10 w-full text-2xs">
                <WorkoutChart workout={workoutSchedule.workout} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
