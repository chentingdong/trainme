import { create } from 'zustand';

interface ScheduleState {
  scheduleDate: Date | null;
  setScheduleDate: (date: Date | null) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  scheduleDate: new Date(),
  setScheduleDate: (date: Date | null) => set({ scheduleDate: date || new Date() }),
}));