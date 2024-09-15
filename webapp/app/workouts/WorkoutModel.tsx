import { Modal } from 'flowbite-react';
import React from 'react';
import { format } from 'date-fns';
import WorkoutList from './WorkoutList';
import WorkoutEditor from './WorkoutEditor';
import type { workout as Workout } from '@prisma/client';

type Props = {
  date: Date;
  show: boolean;
  hide: () => void;
};

export default function WorkoutModel({ date, show, hide }: Props) {
  const [selectedWorkout, setSelectedWorkout] = React.useState<Workout>();

  return (
    <Modal dismissible
      show={show}
      onClose={hide}
      size="xlg"
      position="center"
      className='text-gray-500 bg-black bg-opacity-50'
    >
      <Modal.Header>
        <span>Add workout on: </span>
        <span> {format(date, 'EEEE, yyyy-MM-dd')}</span>
      </Modal.Header>
      <Modal.Body>
        <WorkoutEditor workout={selectedWorkout} />
        <WorkoutList setSelectedWorkout={setSelectedWorkout} />
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-info'>Save</button>
      </Modal.Footer>
    </Modal>
  );
}