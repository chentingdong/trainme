"use client";

import { create } from "zustand";
import type { workout as Workout } from "@trainme/db";
import { defaultWorkout } from "@/prisma";

interface WorkoutStore {
  workout: Workout | null;
  setWorkout: (workout: Workout) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workout: defaultWorkout,
  setWorkout: (workout: Workout) => set(() => ({ workout }))
}));
