"use client";

import React, { useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss';
import CalendarDay from './CalendarDay';
import ActivityDetail from './ActivityDetail';
import { Modal } from "flowbite-react";

const Page: React.FC = () => {
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const calendarRef = React.useRef<any>(null);

  const tileContent = useCallback(({ date, view }: { date: Date, view: string; }) => {
    return <CalendarDay date={date} view={view} setSelectedActivityId={setSelectedActivityId} />;
  }, []);

  const calendarHeader = ({ date }: { date: Date; }) => {
    return (
      <div className="flex items-center">
        <span className='flex-none btn btn-info' onClick={goToToday}>Today</span>
        <div className="flex-auto">{date.toLocaleDateString(undefined, { month: 'long' })} {date.getFullYear()}</div>
      </div>
    );
  };

  const goToToday = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (calendarRef.current) {
      calendarRef.current.setActiveStartDate(new Date());
    }
  }, []);

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="flex-grow">
        <Calendar
          className='custom-calendar'
          tileClassName='calendar-day'
          view='month'
          ref={calendarRef}
          navigationLabel={calendarHeader}
          tileContent={tileContent}
        />
      </div>
      <Modal dismissible
        show={selectedActivityId !== null}
        onClose={() => setSelectedActivityId(null)}
        size="xlg"
        position="top-center"
      >
        <Modal.Header>
          Activity Details
        </Modal.Header>
        <Modal.Body>
          <ActivityDetail activityId={selectedActivityId} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => setSelectedActivityId(null)}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Page;