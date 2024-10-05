"use client";

import React from "react";
import { Button } from "flowbite-react";
import ActivityIcon from "../activities/ActivityIcon";
import { useWorkoutStore } from "../components/useWorkoutStore";
import { emptyWorkout } from "@/prisma";
import { FiPlus } from "react-icons/fi";
import { trpc } from '@/app/api/trpc/client';
import Loading from '@/app/loading';

export default function WorkoutList() {
  const { workout, setWorkout } = useWorkoutStore();
  const selected = (id: string) => (workout?.id === id ? " selected" : "");
  const { data: workouts, isLoading, isError } = trpc.workouts.getWorkouts.useQuery({});

  const handleNewWorkout = () => {
    setWorkout(emptyWorkout);
  };

  if (isLoading) return <Loading />;
  if (isError || !workouts) return <div>Error loading workouts</div>;

  return (
    <div className="h-full gap-1 px-2 overflow-y-auto scroll">
      <div className="col-span-2 flex justify-between items-center">
        <h3 className="h3">Workouts</h3>
        <button className="btn btn-icon text-center" onClick={handleNewWorkout}>
          <FiPlus />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {workouts.map((workout) => (
          <Button
            key={workout.id}
            className={
              `col-span-2 btn btn-info p-0 flex items-center justify-start` +
              selected(workout.id)
            }
            onClick={() => setWorkout(workout)}
          >
            <ActivityIcon type={workout.type} />
            <div className="ml-2 font-semibold text-sm">
              {workout.name || "No name"}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
