'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface ScheduleContextType {
  scheduleDate: Date | null;
  setScheduleDate: (date: Date | null) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: { children: ReactNode; }) => {
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());

  const value = {
    scheduleDate: scheduleDate || new Date(),
    setScheduleDate,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
