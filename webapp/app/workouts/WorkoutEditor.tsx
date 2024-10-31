'use client';

import { WorkoutChart } from './WorkoutChart';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { useToast } from '@/app/components/Toaster';
import SportTypeSelect from '../components/SportTypeSelect';

import { Controller, useForm } from 'react-hook-form';
import { defaultWorkout } from '@trainme/db';
import { trpc } from '@/app/api/trpc/client';
import type { Workout } from '@trainme/db';
import { useCalendarState } from '@/app/calendar/useCalendarState';
import { cn } from '@/utils/helper';
import {
  workoutTotalDistance,
  workoutTotalDuration,
} from '@/utils/distanceUtils';


export default function WorkoutEditor() {
  const { scheduleDate, workout, setWorkout, setWorkouts } = useCalendarState();
  const { toast } = useToast();

  const { control } = useForm<Workout>({
    values: workout ?? defaultWorkout,
    mode: 'onChange',
  });

  const { data: workouts, refetch: refetchWorkouts } =
    trpc.workouts.getMany.useQuery({});

  const { mutate: upsertWorkout } = trpc.workouts.upsert.useMutation({
    onSuccess: async () => {
      const updatedWorkouts = await refetchWorkouts();
      if (updatedWorkouts.data) {
        setWorkouts(updatedWorkouts.data);
      }
    },
    onError: (error) => {
      toast({ type: 'error', content: 'Failed to create workout: ' + error });
    },
  });

  if (!workout) return <></>;

  const saveWorkoutSteps = (steps: string[]) => {
    const totalDistance = workoutTotalDistance(steps);
    const totalDuration = workoutTotalDuration(steps);

    setWorkout({
      ...workout,
      steps: steps,
      distance: totalDistance,
      duration: totalDuration,
    });
  };

  return (
    <form className='grid grid-cols-9 gap-4 p-2 m-0 h-full w-full bg-slate-100 dark:bg-black opacity-85 text-2xs'>
      <div className='col-span-4 bg-center bg-cover h-full'>
        <Controller
          name='steps'
          control={control}
          render={({ field }) => {
            return (
              <Textarea
                id='steps'
                autoFocus
                className='h-full workout-board'
                value={
                  Array.isArray(field.value)
                    ? field.value.join('\n')
                    : field.value?.toString() || ''
                }
                onChange={(e) => {
                  const steps = e.target.value.split('\n');
                  field.onChange(steps);
                  saveWorkoutSteps(steps);
                }}
              />
            );
          }}
        />
      </div>
      <div className='col-span-5 flex flex-col justify-between h-full overflow-auto'>
        <div className='flex-2 flex flex-col gap-0.5'>
          <div className='form-group'>
            <Label htmlFor='name'>Workout Name</Label>
            <Controller
              name='name'
              control={control}
              rules={{
                validate: {
                  notTaken: (value) =>
                    workouts
                      ?.map((workout: Workout) => workout.name)
                      .includes(value?.toString().trim() ?? '')
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
              name='sportType'
              control={control}
              render={({ field }) => (
                <SportTypeSelect
                  value={field.value ?? ''}
                  onChange={(e, selectedSport) => {
                    field.onChange(selectedSport);
                    setWorkout({ ...workout, sportType: selectedSport });
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
                  workouts
                    ?.map((workout: Workout) => workout.name)
                    .includes(value?.toString() ?? '')
                    ? 'Name taken'
                    : true,
              }}
              render={({ field, fieldState }) => (
                <div>
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
                </div>
              )}
            />
          </div>
        </div>
        <div className='flex-1 flex flex-col gap-1.5'>
          <div className='my-4 text-sm'>
            If workout is linked to an activity:
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-feeling'>Feeling</Label>
            <Controller
              name='feeling'
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    id='default-range'
                    type='range'
                    min='0'
                    max='10'
                    value={workout.feeling ?? 0}
                    onChange={(e) => {
                      const feeling = parseInt(e.target.value);
                      field.onChange(feeling);
                      setWorkout({ ...workout, feeling });
                    }}
                    className='range-slider'
                  />
                </div>
              )}
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-rpe'>RPE</Label>
            <Controller
              name='rpe'
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    id='workout-rpe'
                    type='range'
                    min='0'
                    max='10'
                    value={workout.rpe ?? 0}
                    onChange={(e) => {
                      const rpe = parseInt(e.target.value);
                      field.onChange(rpe);
                      setWorkout({ ...workout, rpe });
                    }}
                    className='range-slider'
                  />
                </div>
              )}
            />
          </div>
          <div className='form-group'>
            <Label htmlFor='workout-notes'>Notes</Label>
            <Controller
              name='notes'
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea
                    id='workout-notes'
                    className='workout-notes'
                    placeholder='Workout Notes'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      field.onChange(e);
                      setWorkout({ ...workout, notes: e.target.value });
                    }}
                  />
                </div>
              )}
            />
          </div>
        </div>
        <div className='h-20 w-full px-2 my-2'>
          <WorkoutChart workout={workout} />
        </div>
        <div className='flex justify-end'>
          <button
            type='button'
            className={cn(
              `btn ${workout.id ? 'btn-primary' : 'btn-warning'}`,
              'col-span-2'
            )}
            onClick={() =>
              upsertWorkout({ workout: { ...workout, date: scheduleDate } })
            }
          >
            {workout.id ? 'Update workout' : 'Create workout'}
          </button>
        </div>
      </div>
    </form>
  );
}
