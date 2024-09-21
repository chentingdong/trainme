"use client";

import React from 'react';
import WorkoutChart from './WorkoutChart';
import { Label, Select, TextInput, Textarea } from 'flowbite-react';
import { defaultWorkout } from '@/prisma';
import { createWorkout } from '../actions/workout';
import { useToast } from '../components/Toaster';
import type { workout as Workout } from '@prisma/client';

import { workoutTotalDistance, workoutTotalDuration } from '@/utils/distanceUtils';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm
} from 'react-hook-form'

type Props = {};

export default function WorkoutEditor({ }: Props) {
  const [workout, setWorkout] = React.useState<Workout | null>(defaultWorkout);

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { dirtyFields, defaultValues },
  } = useForm<Workout>({
    defaultValues: defaultWorkout,
  });

  const toaster = useToast();

  const onSubmit: SubmitHandler<Workout> = data => {
    try {
      const updatedWorkout = { ...workout, ...data };
      toaster.showToaster('Workout updated', 'success');
      setWorkout(updatedWorkout);
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

  if (!workout) {
    return <div>No workout selected</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
      <div className='px-4 grid grid-cols-12 gap-8'>
        <div className='col-span-2 flex flex-col justify-start gap-4'>
          <div className='form-group'>
            <Label htmlFor='type'>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select id='type' {...field} value={field.value ?? '-'} className='form-control'>
                  <option value='run'>Run</option>
                  <option value='ride'>Ride</option>
                  <option value='swim'>Swim</option>
                </Select>
              )}
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-distance'>Distance (km)</Label>
            <Controller
              name="workout.distance"
              control={control}
              render={({ field }) => (
                <TextInput id='workout-distance' placeholder="Enter distance" {...field} value={field.value?.toString() ?? ''} />
              )}
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-duration'>Duration (minutes)</Label>
            <Controller
              name="workout.duration"
              control={control}
              render={({ field }) => (
                <TextInput id='workout-duration' placeholder="Enter duration" {...field} value={field.value?.toString() ?? ''} />
              )}
            />
          </div>
        </div>
        <div className='col-span-8'>
          <div className='grid grid-col gap-2'>
            <Label htmlFor='name'>Workout</Label>
            <Controller
              name="workout.name"
              control={control}
              render={({ field }) => (
                <TextInput
                  id='name'
                  placeholder="Workout Name"
                  value={field.value?.toString() ?? ''}
                  onChange={(e) => setWorkout(prevWorkout =>
                    prevWorkout ? { ...prevWorkout, name: e.target.value } : null)}
                />
              )}
            />
            <Label htmlFor='description'>Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextInput
                  id='description'
                  placeholder="Workout Description"
                  value={workout.description ?? ''}
                  onChange={(e) => setWorkout(prevWorkout =>
                    prevWorkout ? { ...prevWorkout, description: e.target.value } : null)}
                />
              )}
            />
            <Label htmlFor='steps'>Steps</Label>
            <Controller
              name="workout"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Textarea
                    autoFocus
                    rows={10}
                    value={Array.isArray(value) ? value.join('\n') : ''}
                    onChange={(e) => {
                      const steps = e.target.value.split('\n');
                      onChange(steps);
                      setWorkout(prevWorkout => prevWorkout ? { ...prevWorkout, workout: steps } : null);
                    }}
                  />
                );
              }}
            />
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

