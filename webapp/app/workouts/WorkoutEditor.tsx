"use client";

import React, { useEffect, useState } from 'react';
import WorkoutChart from './WorkoutChart';
import { Label, Select, TextInput, Textarea } from 'flowbite-react';
import { defaultWorkout } from '@/prisma';
import { createWorkout, updateWorkout } from '../actions/workout';
import { useToast } from '../components/Toaster';
import type { workout as Workout } from '@prisma/client';
import { workoutTotalDistance, workoutTotalDuration } from '@/utils/distanceUtils';
import { useForm } from 'react-hook-form';

type Props = {
  workout?: Workout;
  setWorkout?: (workout: Workout) => void;
};

export default function WorkoutEditor({ workout, setWorkout }: Props) {
  if (!workout) workout = defaultWorkout;
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: workout.name || 'Unnamed workout',
      steps: workout.workout ? JSON.parse(workout.workout).join('\n') : '',
      description: workout.description || '',
    },
  });

  const toaster = useToast();

  useEffect(() => {
    if (workout?.workout) {
      setValue('steps', JSON.parse(workout.workout).join('\n'));
    }
  }, [workout, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await updateWorkout({ ...workout, name: data.name, workout: JSON.stringify(data.steps.split('\n')) });
      toaster.showToaster('Workout updated', 'success');
      if (setWorkout) setWorkout({ ...workout, name: data.name, workout: JSON.stringify(data.steps.split('\n')) });
    } catch (error) {
      toaster.showToaster('Failed to update workout: ' + error, 'error');
    }
  };

  const handleAddToCalendar = () => {
    if (workout?.id) {
      //create a record in date-workout table
      console.log('add to calendar', workout);
    }
  };

  const handleCreateWorkout = async () => {
    try {
      await createWorkout(workout);
      toaster.showToaster('Workout added to calendar', 'success');
    } catch (error) {
      toaster.showToaster('Failed to add workout to calendar: ' + error, 'error');
    }
  };

  if (!workout?.workout) {
    return <div>No workout selected</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-full justify-between'>
      <div className='px-4 grid grid-cols-12 gap-8'>
        <div className='col-span-2 flex flex-col justify-start gap-4'>
          <div className='form-group'>
            <Label htmlFor='type'>Type</Label>
            <Select id='type' className='form-control'>
              <option value='run'>Run</option>
              <option value='ride'>Ride</option>
              <option value='swim'>Swim</option>
            </Select>
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-distance'>Distance (km)</Label>
            <div>{workoutTotalDistance(watch('steps'))}</div>
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-duration'>Duration (minutes)</Label>
            <div>{workoutTotalDuration(watch('steps'))}</div>
          </div>
        </div>
        <div className='col-span-8'>
          <div>
            <Label htmlFor='name'>Workout</Label>
            <TextInput {...register('name')} placeholder="Workout Name" />
            <Label htmlFor='description'>Description</Label>
            <TextInput {...register('description')} placeholder="Workout Description" />
            <Label htmlFor='steps'>Steps</Label>
            <Textarea {...register('steps')} rows={12} />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4 mt-6">
          <button type="button" className='btn btn-primary' onClick={handleAddToCalendar}>Add to calendar</button>
          <button type="button" className='btn btn-primary' onClick={handleCreateWorkout}>Save workout</button>
        </div>
      </div>
      <div className='flex-grow-0'>
        <WorkoutChart workout={workout} />
      </div>
    </form>
  );
}
