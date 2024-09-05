import { formatDateWeek } from '@/utils/timeUtils';
import { Modal } from 'flowbite-react';
import React from 'react';

type Props = {
  date: Date;
  show: boolean;
  hide: () => void;
};

export default function WorkoutEditor({ date, show, hide }: Props) {
  return (
    <Modal dismissible
      show={show}
      onClose={hide}
      size="xlg"
      position="bottom-center"
      className='text-gray-500 bg-black bg-opacity-50'
    >
      <Modal.Header>
        <span>Add workout on: </span>
        <span> {formatDateWeek(date)}</span>
      </Modal.Header>
      <Modal.Body>
        <div className='p-4'>
          <div className='form-group'>
            <label htmlFor='workout-type'>Type</label>
            <select id='workout-type' className='form-control'>
              <option value='run'>Run</option>
              <option value='ride'>Ride</option>
              <option value='swim'>Swim</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='workout-distance'>Distance</label>
            <input id='workout-distance' type='number' className='form-control' />
          </div>
          <div className='form-group'>
            <label htmlFor='workout-duration'>Duration</label>
            <input id='workout-duration' type='time' className='form-control' />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-info'>Save</button>
      </Modal.Footer>
    </Modal>
  );
}