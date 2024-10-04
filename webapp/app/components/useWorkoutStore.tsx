"use client";

import { create } from "zustand";
import { workout as Workout } from "@trainme/db";
import { defaultWorkout } from "@/prisma";
import { createWorkout, getWorkoutById, getWorkouts, saveWorkout } from '@/app/actions/workout';

// Zustand store for workouts
interface WorkoutStore {
  workouts: Workout[];
  workout: Workout | null;
  refreshWorkouts: () => Promise<void>;
  refetchWorkout: (id: string) => void;
  setWorkout: (workout: Workout) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => Promise<Workout>;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  workout: defaultWorkout,

  // Reload the list of workouts from db.
  refreshWorkouts: async () => {
    const newWorkouts = await getWorkouts();
    set({ workouts: newWorkouts });
  },

  // Set the current workout
  setWorkout: (workout: Workout) => set(() => ({ workout })),

  // Refetch workout from db
  refetchWorkout: async (id: string) => {
    const newWorkout = await getWorkoutById(id);
    set({ workout: newWorkout, });
  },

  // Add a new workout
  addWorkout: async (workout: Workout) => {
    if (!workout.name) throw new Error("Workout name is required");
    const newWorkout = await createWorkout(workout);

    if (newWorkout !== null) {
      set((state) => ({ 
        workout: newWorkout,
        workouts: [...state.workouts, newWorkout],
      }));
    } else {
      throw new Error("Failed to create workout");
    }
  },

  // Update an existing workout
  updateWorkout: async (workout: Workout): Promise<Workout> => {
    const newWorkout = await saveWorkout(workout);
    if (newWorkout) {
      set((state) => ({
        workouts: state.workouts.map((workout) =>
          workout.id === newWorkout.id ? newWorkout : workout
        ),
      }));
      return newWorkout;
    } else {
      throw new Error("Failed to update workout");
    }
  },
}));
