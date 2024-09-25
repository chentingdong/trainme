'use client';

import React from 'react';
import WorkoutChart from './WorkoutChart';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { addToCalendar, saveWorkout } from '../actions/workout';
import { useToast } from '../components/Toaster';
import type { workout as Workout } from '@prisma/client';
import SportTypeSelect from '../components/SportTypeSelect';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useWorkout } from '../components/WorkoutProvider';
import { defaultWorkout } from '@/prisma';
import WorkoutList from './WorkoutList';
import { useSchedule } from '../components/ScheduleProvider';

type Props = {};

export default function WorkoutEditor({ }: Props) {
  const { workout, setWorkout, workoutNames } = useWorkout();
  const { scheduleDate, setScheduleDate } = useSchedule();

  const { control, handleSubmit } = useForm<Workout>({
    values: workout ?? defaultWorkout,
    mode: 'onChange'
  });

  const toaster = useToast();

  const onSubmit: SubmitHandler<Workout> = (data) => {
    try {
      const updatedWorkout = { ...workout, ...data };
      toaster.showToaster('Workout updated', 'success');
      setWorkout(updatedWorkout);
    } catch (error) {
      toaster.showToaster('Failed to update workout: ' + error, 'error');
    }
  };

  const handleAddToCalendar = async () => {
    if (workout?.id) {
      try {
        await saveWorkout(workout);
        await addToCalendar(workout.id, scheduleDate);
        setScheduleDate(null);
        toaster.showToaster('Workout added to calendar', 'success');
      } catch (error) {
        toaster.showToaster(
          'Failed to add workout to calendar: ' + error,
          'error'
        );
      }
    }
  };

  const handleSaveWorkout = async () => {
    try {
      if (workout && workout.steps) {
        await saveWorkout(workout);
      } else {
        toaster.showToaster('Workout not saved', 'error');
      }
    } catch (error) {
      toaster.showToaster(
        'Failed to add workout to calendar: ' + error,
        'error'
      );
    }
  };

  if (!workout) {
    return <div>No workout selected</div>;
  }

  return (
    <div className='grid grid-cols-12 p-2 h-full w-full bg-slate-100 dark:bg-slate-800 opacity-90'>
      <div className='col-span-2 h-full overflow-auto'>
        <WorkoutList />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='col-span-10 h-full overflow-auto dark:text-white'
      >
        <div className='px-4 grid grid-cols-12 gap-8 h-full'>
          <div className='col-span-9 flex flex-col justify-end gap-4 bg-center bg-cover h-full'>
            <Controller
              name='steps'
              control={control}
              render={({ field }) => {
                return (
                  <Textarea
                    id='steps'
                    autoFocus
                    className='flex-grow text-md font-handwriting tracking-widest-2 text-yellow-200 bg-slate-500 bg-opacity-70 w-144 mx-auto'
                    value={
                      Array.isArray(field.value) ? field.value.join('\n') : field.value?.toString() || ''
                    }
                    onChange={(e) => {
                      const steps = e.target.value.split('\n');
                      field.onChange(steps);
                      setWorkout({ ...workout, steps: steps });
                    }}
                  />
                );
              }}
            />
            <div className="h-24 w-full px-2">
              <WorkoutChart workout={workout} />
            </div>
          </div>
          <div className='col-span-3 flex flex-col justify-between h-full overflow-auto'>
            <div>
              <div className='form-group'>
                <Label htmlFor='name'>Workout Name</Label>
                <Controller
                  name='name'
                  control={control}
                  rules={{
                    validate: {
                      notTaken: (value) =>
                        workoutNames.includes(value?.toString().trim()!)
                          ? 'Name taken'
                          : true,
                    },
                    required: 'Workout name is required',
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <TextInput
                        id='name'
                        placeholder='Workout Name'
                        value={field.value?.toString() ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          setWorkout({ ...workout, name: e.target.value.trim() });
                        }}
                      />
                      {fieldState.error && (
                        <span className='text-red-500 text-sm'>
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className='form-group'>
                <Label htmlFor='description'>Description</Label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      id='description'
                      placeholder='Workout Description'
                      value={workout.description ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        setWorkout({ ...workout, description: e.target.value });
                      }}
                    />
                  )}
                />
              </div>
              <div className='form-group'>
                <Label htmlFor='type'>Sport Type</Label>
                <Controller
                  name='sport_type_id'
                  control={control}
                  render={({ field }) => (
                    <SportTypeSelect
                      value={field.value?.toString() || ''}
                      onChange={(e) => {
                        const selected: string = e.target.value;
                        field.onChange(selected);
                        setWorkout({ ...workout, type: selected });
                      }}
                    />
                  )}
                />
              </div>
              <div className='form-group'>
                <Label htmlFor='workout-distance'>Distance (km)</Label>
                <Controller
                  name='distance'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      id='workout-distance'
                      placeholder='Enter distance'
                      type='number'
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e);
                        setWorkout({
                          ...workout,
                          distance: parseFloat(e.target.value) || null,
                        });
                      }}
                    />
                  )}
                />
              </div>
              <div className='form-group'>
                <Label htmlFor='workout-duration'>Duration (minutes)</Label>
                <Controller
                  name='duration'
                  control={control}
                  rules={{
                    validate: (value) =>
                      workoutNames.includes(value?.toString() ?? '')
                        ? 'Name taken'
                        : true,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <TextInput
                        id='workout-duration'
                        placeholder='Workout Name'
                        value={field.value?.toString() ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          setWorkout({ ...workout, name: e.target.value });
                        }}
                      />
                      {fieldState.error && (
                        <span className='text-red-500 text-sm'>
                          {fieldState.error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className='col-span-2 flex flex-col gap-4 my-6'>
              <button
                type='button'
                className={`btn ` + (!workout.id ? 'btn-disabled' : 'btn-primary')}
                onClick={handleAddToCalendar}
                disabled={!workout.id}
              >
                Add to calendar
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleSaveWorkout}
              >
                Save workout
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
