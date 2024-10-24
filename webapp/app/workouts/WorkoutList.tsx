"use client";

import React from "react";
import { Button } from "flowbite-react";
import { FiPlus } from "react-icons/fi";
import { useCalendarState } from '@/app/calendar/useCalendarState';
import SportIcon from '@/app/activities/SportIcon';
import { defaultWorkout } from '@trainme/db';

export default function WorkoutList() {
  const { workout, setWorkout, workouts } = useCalendarState();
  const selected = (id: string) => (workout?.id === id ? " selected" : "");
  const handleCreateWorkout = () => {
    setWorkout(defaultWorkout);
  };

  return (
    <div className="h-full gap-1 px-2 overflow-y-auto scroll">
      <div className="col-span-2 flex justify-between items-center">
        <h3 className="h3">Workouts</h3>
        <button className="btn btn-icon text-center" onClick={handleCreateWorkout}>
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
            <SportIcon type={workout.sportType} />
            <div className="ml-2 font-semibold text-sm">
              {workout.name || "No name"}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
