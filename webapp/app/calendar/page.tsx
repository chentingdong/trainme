"use client";

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.scss';
import CalendarDay from './CalendarDay';
import ActivityDetail from '../activities/ActivityDetail';
import { Modal } from "flowbite-react";
import 'flowbite/dist/flowbite.min.css';

const Page = () => {
  const [selectedActivityId, setSelectedActivityId] = React.useState<number | null>(null);

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="flex-grow">
        <Calendar
          className='custom-calendar'
          tileClassName='calendar-day'
          tileContent={({ date, view }) => (
            <CalendarDay date={date} view={view}
              setSelectedActivityId={setSelectedActivityId}
            />
          )}
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