"use client";

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss';
import CalendarDay from './CalendarDay';

const TrainingCalendar = () => {
  return (
    <div className="flex-grow flex flex-col p-4 bg-gradient-to-b from-gray-100 to-gray-300">
      <h1>Training Calendar</h1>
      <div className="flex-grow">
        <Calendar
          className='custom-calendar'
          tileClassName='calendar-day'
          tileContent={({ date, view }) => <CalendarDay date={date} view={view} />}
        />
      </div>
    </div>
  );
};

export default TrainingCalendar;