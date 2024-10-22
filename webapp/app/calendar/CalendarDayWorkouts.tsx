"use client";

import Loading from "@/app/components/Loading";
import { WorkoutChart } from "../workouts/WorkoutChart";
import { useCalendarState } from "@/app/calendar/useCalendarState";
import { cn } from "@/utils/helper";
import SportIcon from "@/app/activities/SportIcon";
import { IoClose } from "react-icons/io5";
import { trpc } from '@/app/api/trpc/client';
import { startOfDay, endOfDay } from 'date-fns';

export function CalendarDayWorkouts({
  date
}: {
  date: Date;
  }) {

  const { workout: editorWorkout, setWorkout: setEditorWorkout } = useCalendarState();

  const { data: workouts, isLoading, isError, refetch: refetchWorkouts } = trpc.workouts.getMany.useQuery({
    filter: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });

  const { mutate: deleteWorkout } = trpc.workouts.deleteById.useMutation({
    onSuccess: () => {
      refetchWorkouts();
    },
    onError: (error) => {
      throw new Error("Failed to delete workout: " + error);
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading workouts</div>;
  if (!workouts) return <div>No workouts</div>;

  return (
    <ul className="mx-0.25 shadow-sm">
      {workouts.map(workout => {
        return (
          <li key={workout.id} className="my-1 cursor-pointer">
            <div
              className={cn([
                "card cursor-pointer border-2",
                workout.id === editorWorkout?.id
                  ? "border-yellow-300"
                  : "border-transparent",
              ])}
              onClick={() => workout && setEditorWorkout(workout)}
            >
              <div className="card-header flex justify-between items-center gap-2 p-0">
                <SportIcon type={workout?.sportType || ''} withColor={false} />
                <div className="flex-grow">{workout?.name}</div>
                <button className="btn btn-icon btn-danger" onClick={() => deleteWorkout({ id: workout.id })}>
                  <IoClose />
                </button>
              </div>
              <div className="card-body">
                <div className="h-10 w-full text-2xs">
                  <WorkoutChart workout={workout || undefined} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
