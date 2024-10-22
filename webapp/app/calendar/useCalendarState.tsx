"use client";

import { create } from "zustand";
import type { Activity } from "@trainme/db";
import type { Workout } from "@trainme/db";
import { defaultWorkout } from '@trainme/db';

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
  workout: defaultWorkout,
  setWorkout: (workout: Workout | null) => set({ workout }),
  scheduleDate: new Date(),
  setScheduleDate: (date: Date | null) => set({ scheduleDate: date || new Date() }),
}));