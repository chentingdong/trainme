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
    <Modal dismissible show={show} onClose={hide} size='xlg' position='center'>
      <Modal.Header>
        <span>Add workout on: </span>
        <span> {format(date, 'EEEE, yyyy-MM-dd')}</span>
      </Modal.Header>
      <Modal.Body>
        <div className='grid grid-cols-5 h-176'>
          <div className='col-span-4 h-full overflow-auto'>
            <WorkoutEditor workout={selectedWorkout} />
          </div>
          <div className='col-span-1 border-l h-full overflow-auto border-gray-200 px-4'>
            <WorkoutList setSelectedWorkout={setSelectedWorkout} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-primary'>Schedule it</button>
      </Modal.Footer>
    </Modal>
  );
}
