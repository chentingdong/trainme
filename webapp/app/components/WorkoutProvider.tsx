"use client";
// workout provider

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { workout as Workout } from '@prisma/client';
import React from 'react';
import { defaultWorkout } from '@/prisma';
import { getWorkouts } from '../actions/workout';

interface WorkoutContextType {
  workouts: Workout[];
  workoutNames: string[];
  setWorkouts: (workouts: Workout[]) => void;
  workout: Workout | null;
  setWorkout: (workout: Workout) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }: { children: ReactNode; }) => {
  const [workout, setWorkout] = useState<Workout>(defaultWorkout);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const workoutNames = useMemo(() => workouts.map((workout) => workout.name), [workouts]);
  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const addWorkout = (workout: Workout) => {
    setWorkouts((currentWorkouts) => [...currentWorkouts, workout]);
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts((currentWorkouts) => currentWorkouts.map((currentWorkout) => {
      if (currentWorkout.id === workout.id) {
        return workout;
      }
      return currentWorkout;
    }));
  };


  const deleteWorkout = (id: string) => {
    setWorkouts((currentWorkouts) => currentWorkouts.filter((workout) => workout.id !== id));
  };

  const filteredWorkoutNames = workoutNames.filter((name): name is string => name !== null);

  const value = {
    workouts,
    workoutNames: filteredWorkoutNames,
    setWorkouts,
    workout,
    setWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout
  };

  return (
    <WorkoutContext.Provider value={value} >
      {children}
    </WorkoutContext.Provider>
  );
};  