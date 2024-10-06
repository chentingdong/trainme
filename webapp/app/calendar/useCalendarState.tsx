"use client";

import { create } from "zustand";
import type { activity as Activity } from "@trainme/db";
import type { workout as Workout } from "@trainme/db";

interface CalendarState {
  activity: Activity | null;
  setActivity: (activity: Activity | null) => void;
  workout: Workout | null;
  setWorkout: (workout: Workout | null) => void;
  scheduleDate: Date;
  setScheduleDate: (date: Date | null) => void;
}

export const useCalendarState = create<CalendarState>((set) => ({
  activity: null,
  setActivity: (activity: Activity | null) => set({ activity }),
  workout: null,
  setWorkout: (workout: Workout | null) => set({ workout }),
  scheduleDate: new Date(),
  setScheduleDate: (date: Date | null) => set({ scheduleDate: date || new Date() }),
}));