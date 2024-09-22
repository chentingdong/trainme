"use client";

import { formatDate } from 'date-fns';
import React, { useState } from 'react';
import CalendarDay from './CalendarDay';
import './calendar.scss';
import Loading from '../loading';

type Props = {
  aday?: Date; //any day of the week.
};

export default function CalendarWeek({ aday }: Props) {
  // if didn't specify which day of the week, today is as good as any.
  if (!aday) aday = new Date();

  const [week, setWeek] = useState<Date[]>([]);
  const [workoutDate, setWorkoutDate] = useState<Date | null>(null);

  React.useEffect(() => {
    // get date range for the week
    const getWeek = (date?: Date) => {
      if (!date) date = new Date();
      let week = [];
      // Get the start of the week (Sunday)
      let startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      startOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day

      for (let i = 0; i <= 6; i++) {
        let aday = new Date(startOfWeek);
        aday.setDate(startOfWeek.getDate() + i);
        week.push(aday);
      }
      return week;
    };

    setWeek(getWeek(aday));
  }, [aday]);



  if (week.length === 0) return <Loading />;

  return (
    <div className='calendar-week flex flex-col flex-grow'>
      <h2 className="text-center mx-2 p-2 rounded-md">
        {formatDate(week[0], 'MMMM')} {formatDate(week[0], 'dd')} - {formatDate(week[6], 'dd')}
      </h2>
      <div className='flex gap-3 justify-between h-full p-2'>
        {week.map((date, index) => {
          return (
            <div key={index} className='w-full'>
              <CalendarDay
                date={date}
                workoutDate={workoutDate || date}
                setWorkoutDate={setWorkoutDate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}