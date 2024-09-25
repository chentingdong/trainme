"use client";

import { formatDate } from 'date-fns';
import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    // get date range for the week
    const getWeek = (date?: Date) => {
      if (!date) date = new Date();
      let week = [];
      // Get the start of the week (Sunday)
      let startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - (date.getDay() + 6) % 7);
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

  const backgroundImages = [
    'url(/art/20240725-Arles-7.jpg)',
    'url(/art/20240725-Arles-4.jpg)',
    'url(/art/20240725-Arles-9.jpg)',
    'url(/art/20240725-Arles-1.jpg)',
    'url(/art/20240725-Arles-5.jpg)',
    'url(/art/20240725-Arles-2.jpg)',
    'url(/art/20240725-Arles-3.jpg)',
  ]

  if (week.length === 0) return <Loading />;

  return (
    <div className='calendar-week'>
      <h2 className="text-center mx-2 p-2 rounded-md">
        {formatDate(week[0], 'MMMM')} {formatDate(week[0], 'dd')} - {formatDate(week[6], 'dd')}
      </h2>
      <div className='flex gap-3 justify-between p-2'>
        {week.map((date, index) => {
          return (
            <div key={index} className='w-full bg-cover bg-center'
              style={{ backgroundImage: backgroundImages[index] }}>
              <CalendarDay date={date} />
            </div>
          );
        })}
      </div>
    </div>
  );
}