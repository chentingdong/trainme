import { create } from "zustand";
import type { activity as Activity } from "@trainme/db";

interface ActivityState {
  activity: Activity | null | undefined;
  setActivity: (activity: Activity | null) => void;
  weeklySummary: Activity[];
  setWeeklySummary: (activities: Activity[]) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,
  setActivity: (activity: Activity | null) => set({ activity }),
  weeklySummary: [],
  setWeeklySummary: (activities: Activity[]) =>
    set({ weeklySummary: activities }),
}));
