"use client";

import { create } from "zustand";
import type { Activity, Workout } from "@trainme/db";
import { defaultWorkout } from "@trainme/db";

interface CalendarState {
  activity: Activity | null;
  setActivity: (activity: Activity | null) => void;
  workout: Workout | null;
  setWorkout: (workout: Workout | null) => void;
  scheduleDate: Date;
  setScheduleDate: (date: Date) => void;
}

export const useCalendarState = create<CalendarState>((set) => ({
  activity: null,
  setActivity: (activity) => set({ activity }),
  workout: defaultWorkout,
  setWorkout: (workout) => set({ workout }),
  scheduleDate: new Date(),
  setScheduleDate: (date) => set({ scheduleDate: date }),
}));
