"use client";

import { create } from "zustand";

interface ScheduleStore {
  scheduleDate: Date;
  setScheduleDate: (date: Date | null) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  scheduleDate: new Date(),

  setScheduleDate: (date: Date | null) =>
    set({ scheduleDate: date || new Date() }),

}));
