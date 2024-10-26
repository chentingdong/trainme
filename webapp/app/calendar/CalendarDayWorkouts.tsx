"use client";

import { WorkoutChart } from "../workouts/WorkoutChart";
import { useCalendarState } from "@/app/calendar/useCalendarState";
import { cn } from "@/utils/helper";
import SportIcon from "@/app/activities/SportIcon";
import { IoClose } from "react-icons/io5";
import { trpc } from '@/app/api/trpc/client';
import { Workout } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

type Props = {
  date: Date;
  workouts: Workout[];
};

export function CalendarDayWorkouts({ date, workouts }: Props) {
  const { workout: editorWorkout, setWorkout: setEditorWorkout, setWorkouts } = useCalendarState();

  const { refetch: refetchWorkouts } = trpc.workouts.getMany.useQuery({
    filter: {
      date: {
        gte: startOfWeek(date),
        lt: endOfWeek(date)
      }
    }
  });

  const { mutate: deleteWorkout } = trpc.workouts.deleteById.useMutation({
    onSuccess: async () => {
      const weeklyWorkouts = await refetchWorkouts();
      if (weeklyWorkouts.data) {
        setWorkouts(weeklyWorkouts.data);
      }
    },
    onError: (error) => {
      throw new Error("Failed to delete workout: " + error);
    },
  });

  if (!workouts) return <></>;

  return (
    <ul className="mx-0.25 shadow-sm">
      {workouts.map(workout => {
        return (
          <li
            key={workout.id} className="my-1 cursor-pointer"
            draggable={true}
            onDragStart={(event) => event.dataTransfer.setData("workoutId", workout.id)}
          >
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
