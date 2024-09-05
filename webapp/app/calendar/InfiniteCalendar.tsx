import React, { useState, useCallback, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FixedSizeList as List } from 'react-window';
import { addWeeks, startOfWeek, endOfWeek } from 'date-fns';

// Define the DateRange type
export type DateRange = {
  startDate: Date;
  endDate: Date;
};

const InfiniteScrollCalendar = () => {
  const [weeks, setWeeks] = useState<DateRange[]>([]); // Using DateRange type for the weeks state

  const generateMoreWeeks = (startDate: Date, numWeeks: number): DateRange[] => {
    const newWeeks: DateRange[] = [];
    let currentWeekStart = startOfWeek(startDate);

    for (let i = 0; i < numWeeks; i++) {
      const week: DateRange = {
        startDate: currentWeekStart,
        endDate: endOfWeek(currentWeekStart),
      };
      newWeeks.push(week);
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }

    return newWeeks;
  };

  const loadMoreWeeks = useCallback(() => {
    const lastWeekStartDate = weeks.length
      ? weeks[weeks.length - 1].startDate
      : new Date();
    const newWeeks = generateMoreWeeks(lastWeekStartDate, 5);
    setWeeks((prevWeeks) => [...prevWeeks, ...newWeeks]);
  }, [weeks]);

  useEffect(() => {
    const initialWeeks = generateMoreWeeks(new Date(), 5);
    setWeeks(initialWeeks);
  }, []);

  return (
    <List
      width="100%"
      height={600}
      itemCount={weeks.length}
      itemSize={80}
      onScroll={({ scrollOffset }) => {
        const threshold = 400;
        if (scrollOffset >= threshold) loadMoreWeeks();
      }}
    >
      {({ index, style }) => (
        <div style={style}>
          <Calendar
            className="custom-calendar"
            value={weeks[index].startDate}
            view="month"
          />
        </div>
      )}
    </List>
  );
};

export default InfiniteScrollCalendar;