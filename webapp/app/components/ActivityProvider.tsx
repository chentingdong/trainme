"use client";

import type { activity as Activity } from '@prisma/client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ActivityContextType {
  activity: Activity | null | undefined;
  setActivity: (activity: Activity | null) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within a ActivityProvider');
  }
  return context;
};

import React from 'react';

export const ActivityProvider = ({ children }: { children: ReactNode; }) => {
  const [activity, setActivity] = useState<Activity | null | undefined>();

  const value = { activity, setActivity };
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};