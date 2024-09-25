import { create } from 'zustand';
import type { activity as Activity } from '@prisma/client';

interface ActivityState {
  activity: Activity | null | undefined;
  setActivity: (activity: Activity | null) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activity: null,
  setActivity: (activity: Activity | null) => set({ activity }),
}));