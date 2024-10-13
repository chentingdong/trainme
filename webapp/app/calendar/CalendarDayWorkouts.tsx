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
import { JsonValue } from '@prisma/client/runtime/library';
import { Key } from 'react';

export function CalendarDayWorkouts({
  date
}: {
  date: Date;
  }) {

  const utils = trpc.useUtils();
  const { scheduleDate, workout: editorWorkout, setWorkout: setEditorWorkout } = useCalendarState();

  const { data: schedules, isLoading, isError } = trpc.schedules.getSchedules.useQuery({
    filter: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });

  const deleteSchedule = trpc.schedules.deleteSchedule.useMutation({
    onSuccess: () => {
      utils.schedules.getSchedules.invalidate({
        filter: {
          date: {
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
    deleteSchedule.mutate({ id: id });
    setEditorWorkout(emptyWorkout);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading workouts</div>;
  if (!schedules) return <div>No workouts</div>;

  return (
    <ul className="mx-0.25 shadow-sm">
      {schedules?.map((schedule: { id: Key | null | undefined; workoutId: string | undefined; workout: { name: string | null; distance: number | null; id: string; sportType: string; description: string | null; duration: number | null; steps: JsonValue | null; } | null | undefined; }) => (
        <li key={schedule.id} className="my-1 cursor-pointer">
          <div
            className={cn([
              "card cursor-pointer border-2",
              schedule.workoutId === editorWorkout?.id
                ? "border-yellow-300"
                : "border-transparent",
            ])}
            onClick={() => schedule.workout && setEditorWorkout(schedule.workout)}
          >
            <div className="card-header flex justify-between items-center gap-2 p-0">
              <SportIcon type={schedule.workout?.sportType || ''} withColor={false} />
              <div className="flex-grow">{schedule.workout?.name}</div>
              <button className="btn btn-icon btn-danger" onClick={() => handleUnscheduleWorkout(schedule.id as string)}>
                <IoClose />
              </button>
            </div>
            <div className="card-body">
              <div className="h-10 w-full text-2xs">
                <WorkoutChart workout={schedule.workout || undefined} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
