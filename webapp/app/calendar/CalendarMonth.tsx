'use client';

import React, { useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss';
import CalendarDay from './CalendarDay';
import { ActivityDetailModal } from './ActivityDetail';
import WorkoutModel from '../workouts/WorkoutModel';

const CalendarMonth: React.FC = () => {
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [workoutDate, setWorkoutDate] = useState<Date | null>(null);
  const calendarRef = React.useRef<any>(null);

  const tileContent = ({ date }: { date: Date; }) => {
    return (
      <CalendarDay
        date={date}
      />
    );
  };

  const calendarHeader = ({ date }: { date: Date; }) => {
    return (
      <div className='flex items-center'>
        <span className='flex-none btn btn-info' onClick={goToToday}>
          Today
        </span>
        <div className='flex-auto'>
          {date.toLocaleDateString(undefined, { month: 'long' })}{' '}
          {date.getFullYear()}
        </div>
      </div>
    );
  };

  const goToToday = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (calendarRef.current) {
        calendarRef.current.setActiveStartDate(new Date());
      }
    },
    []
  );

  return (
    <div className='flex-grow flex flex-col'>
      <div className='flex-grow'>
        <Calendar
          className='custom-calendar'
          tileClassName='calendar-day'
          view='month'
          ref={calendarRef}
          navigationLabel={calendarHeader}
          tileContent={tileContent}
        />
      </div>
      <ActivityDetailModal
        activityId={selectedActivityId}
        show={selectedActivityId !== null}
        close={() => setSelectedActivityId(null)}
      />
      <WorkoutModel
        show={workoutDate !== null}
        hide={() => setWorkoutDate(null)}
        date={workoutDate || new Date()}
      />
    </div>
  );
};

export default CalendarMonth;
