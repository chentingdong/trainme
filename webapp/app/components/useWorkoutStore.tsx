import { create } from "zustand";
import { workout as Workout } from "@prisma/client";
import { defaultWorkout } from "@/prisma";

// Zustand store for workouts
interface WorkoutState {
  workouts: Workout[];
  workout: Workout | null;
  workoutNames: string[];
  setWorkouts: (workouts: Workout[]) => void;
  setWorkout: (workout: Workout) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  workout: defaultWorkout,
  workoutNames: [],

  // Set the entire list of workouts
  setWorkouts: (workouts: Workout[]) =>
    set((state) => ({
      workouts,
      workoutNames: workouts
        .map((workout) => workout.name)
        .filter((name): name is string => name !== null),
    })),

  // Set the current workout
  setWorkout: (workout: Workout) => set(() => ({ workout })),

  // Add a new workout
  addWorkout: (workout: Workout) => {
    if (!workout.name) throw new Error("Workout name is required");

    set((state) => ({
      workouts: [...state.workouts, workout],
      workoutNames: [...state.workoutNames, workout.name ?? ""],
    }));
  },

  // Update an existing workout
  updateWorkout: (updatedWorkout: Workout) =>
    set((state) => ({
      workouts: state.workouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout,
      ),
      workoutNames: state.workouts
        .map((workout) => workout.name)
        .filter((name): name is string => name !== null),
    })),

  // Delete a workout by ID
  deleteWorkout: (id: string) =>
    set((state) => ({
      workouts: state.workouts.filter((workout) => workout.id !== id),
      workoutNames: state.workouts
        .filter((workout) => workout.id !== id)
        .map((workout) => workout.name)
        .filter((name): name is string => name !== null),
    })),
}));
