"use client";

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss';
import CalendarDay from './CalendarDay';
import ActivityDetail from './ActivityDetail';
import { Modal } from "flowbite-react";

const Page = () => {
  const [selectedActivityId, setSelectedActivityId] = React.useState<number | null>(null);

  // Memoize the tile content to prevent re-rendering of the calendar. 
  // TODO: not preventing, but seems fast for now.
  const memoizedTileContent = React.useCallback(({ date, view }: { date: Date; view: string; }) => (
    <CalendarDay date={date} view={view} setSelectedActivityId={setSelectedActivityId} />
  ), [setSelectedActivityId]);

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="flex-grow">
        <Calendar
          className='custom-calendar'
          tileClassName='calendar-day'
          tileContent={memoizedTileContent}
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