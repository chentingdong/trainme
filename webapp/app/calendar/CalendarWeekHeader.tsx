"use client";

import React from 'react';
import { getCurrentWeek } from '@/utils/timeUtils';
import { formatDate } from 'date-fns';
import Debug from '../components/Debug';
import { useActivityStore } from '../components/useActivityStore';

type Props = {
  //any day of the week.
  aday: Date;
};

export default function CalendarWeekHeader({ aday }: Props) {
  const week = getCurrentWeek(aday);
  const { weeklySummary } = useActivityStore();


  return (
    <div className='flex items-center mx-8'>
      <h2 className="mx-2 p-2 rounded-md">
        {formatDate(week[0], 'MMMM')} {formatDate(week[0], 'dd')} - {formatDate(week[6], 'dd')}
      </h2>
      <Debug data={weeklySummary} />
    </div>
  );
}