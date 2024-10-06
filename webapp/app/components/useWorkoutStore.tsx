"use client";

import { create } from "zustand";
import type { workout as Workout } from "@trainme/db";
import { defaultWorkout } from "@/prisma";

// Zustand store for workouts
interface WorkoutStore {
  workout: Workout | null;
  setWorkout: (workout: Workout) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: defaultWorkout,

  // Set the current workout
  setWorkout: (workout: Workout) => set(() => ({ workout })),
}));
