"use client";

import { create } from "zustand";
import { deleteScheduledWorkoutById, getScheduledWorkoutsByDate } from '@/app/actions/schedule';
import { workout as Workout } from "@trainme/db";
import { workout_schedule as WorkoutSchedule } from '@trainme/db';
import { addToCalendar } from '@/app/actions/workout';

interface ScheduleStore {
  scheduleDate: Date;
  setScheduleDate: (date: Date | null) => void;
  scheduleWorkout: (workout: Workout, workoutDate: Date) => Promise<WorkoutSchedule>;
  unScheduleWorkout: (id: string) => void;
  refetchScheduledWorkouts: (date: Date) => Promise<WorkoutSchedule[]>;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  scheduleDate: new Date(),

  setScheduleDate: (date: Date | null) =>
    set({ scheduleDate: date || new Date() }),

  refetchScheduledWorkouts: async (date: Date): Promise<WorkoutSchedule[]> => {
    return await getScheduledWorkoutsByDate(date);
  },

  // Schedule a workout
  scheduleWorkout: async (workout: Workout, workoutDate: Date) => {
    const schedule = await addToCalendar(workout.id, workoutDate);
    if (!schedule) {
      throw new Error("Failed to schedule workout");
    }
    return schedule;
  },

  // Unschedule a workout by ID
  unScheduleWorkout: async (id: string) => {
    const success = await deleteScheduledWorkoutById(id);
    if (success) {
      // remove scheduled workout from scheduled list
    } else {
      throw new Error("Failed to unschedule workout");
    }
  },
}));
