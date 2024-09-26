"use server";

import { prisma } from '@/prisma';
import { getCurrentWeek } from '@/utils/timeUtils';
import { formatDate } from 'date-fns';
import React from 'react';
import Debug from '../components/Debug';

type Props = {
  //any day of the week.
  aday?: Date;
};

export default async function CalendarWeekHeader({ aday }: Props) {
  const week = getCurrentWeek(aday);

  const activities = await prisma.activity.findMany({
    where: {
      start_date_local: {
        gte: week[0].toISOString(),
        lte: week[6].toISOString(),
      },
    }
  });


  return (
    <div className='flex items-center mx-8'>
      <h2 className="mx-2 p-2 rounded-md">
        {formatDate(week[0], 'MMMM')} {formatDate(week[0], 'dd')} - {formatDate(week[6], 'dd')}
      </h2>
      <Debug data={activities} />
    </div>
  );
}