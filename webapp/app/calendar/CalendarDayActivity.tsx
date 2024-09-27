"use onent";

import React from 'react';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import type { activity as Activity } from '@prisma/client';
import { format } from 'date-fns';
import ActivityIcon from '../activities/ActivityIcon';

type Props = {
  activity: Activity;
};
export function CalendarDayActivity({ activity }: Props) {
  return (
    <div className='card'>
      <div className='card-header text-sm flex items-center justify-between'>
        <div className='flex items-center' >
          <ActivityIcon type={activity.type} withColor={true} />
        </div>
        <div>{activity.start_date_local ? format(activity.start_date_local, 'p') : 'Invalid date'}</div>
      </div>
      <div className='card-body cursor-pointer flex justify-between'>
        <div>{formatTimeSeconds(activity.moving_time || 0)}</div>
        <div>{(activity.distance ?? 0) > 0 && formatDistance(activity.distance ?? 0)} miles</div>
      </div>
    </div>
  );
}