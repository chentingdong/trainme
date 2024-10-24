"use client";

import { create } from "zustand";
import type { Activity, Workout } from "@trainme/db";
import { defaultWorkout } from "@trainme/db";

interface CalendarState {
  activity: Activity | null;
  setActivity: (activity: Activity | null) => void;
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  workout: Workout | null;
  setWorkout: (workout: Workout | null) => void;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  scheduleDate: Date;
  setScheduleDate: (date: Date) => void;
}

export const useCalendarState = create<CalendarState>((set) => ({
  activity: null,
  setActivity: (activity) => set({ activity }),
  activities: [],
  setActivities: (activities) => set({ activities }),
  workout: defaultWorkout,
  setWorkout: (workout) => set({ workout }),
  workouts: [],
  setWorkouts: (workouts) => set({ workouts }),
  scheduleDate: new Date(),
  setScheduleDate: (date) => set({ scheduleDate: date }),
}));
