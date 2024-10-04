"use client";

import { WorkoutChart } from "./WorkoutChart";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useToast } from "../components/Toaster";
import type { workout as Workout } from "@trainme/db";
import SportTypeSelect from "../components/SportTypeSelect";

import { Controller, useForm } from "react-hook-form";
import { useWorkoutStore } from "@/app/components/useWorkoutStore";
import { defaultWorkout } from "@/prisma";
import { useScheduleStore } from "../components/useScheduleStore";

export default function WorkoutEditor() {
  const { workout, setWorkout, updateWorkout, workouts } = useWorkoutStore();
  const { scheduleDate, scheduleWorkout, refetchScheduledWorkouts } = useScheduleStore();

  const { control } = useForm<Workout>({
    values: workout ?? defaultWorkout,
    mode: "onChange",
  });

  const toaster = useToast();

  const handleAddToCalendar = async () => {
    if (workout?.id) {
      try {
        const updatedWorkout = await updateWorkout(workout);
        await scheduleWorkout(updatedWorkout, scheduleDate);
        // TODO: not working because it's not refreshing that day's scheduled workouts
        await refetchScheduledWorkouts(scheduleDate);

        toaster.showToaster("Workout added to calendar", "success");
      } catch (error) {
        toaster.showToaster(
          "Failed to add workout to calendar: " + error,
          "error",
        );
      }
    }
  };

  const handleSaveWorkout = () => {
    try {
      if (workout && workout.steps) {
        updateWorkout(workout);
        setWorkout(workout);
        toaster.showToaster("Workout saved", "success");
      } else {
        toaster.showToaster("Workout not saved", "error");
      }
    } catch (error) {
      toaster.showToaster(
        "Failed to add workout to calendar: " + error,
        "error",
      );
    }
  };

  if (!workout) {
    return <div>No workout selected</div>;
  }

  return (
    <form
      className="grid grid-cols-9 gap-4 p-2 m-0 h-full w-full bg-slate-100 dark:bg-black opacity-85"
    >
      <div className="col-span-6 flex flex-col justify-end gap-4 bg-center bg-cover h-full">
        <Controller
          name="steps"
          control={control}
          render={({ field }) => {
            return (
              <Textarea
                id="steps"
                autoFocus
                className="flex-grow workout-board"
                value={
                  Array.isArray(field.value)
                    ? field.value.join("\n")
                    : field.value?.toString() || ""
                }
                onChange={(e) => {
                  const steps = e.target.value.split("\n");
                  field.onChange(steps);
                  setWorkout({ ...workout, steps: steps });
                }}
              />
            );
          }}
        />
        <div className="h-1/3 min-h-18 w-full px-2">
          <WorkoutChart workout={workout} />
        </div>
      </div>
      <div className="col-span-3 flex flex-col justify-between h-full overflow-auto">
        <div>
          <div className="form-group">
            <Label htmlFor="name">Workout Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{
                validate: {
                  notTaken: (value) =>
                    workouts.map(workout => workout.name).includes(value?.toString().trim() ?? "")
                      ? "Name taken"
                      : true,
                },
                required: "Workout name is required",
              }}
              render={({ field, fieldState }) => (
                <div>
                  <TextInput
                    id="name"
                    placeholder="Workout Name"
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setWorkout({ ...workout, name: e.target.value.trim() });
                    }}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
          <div className="form-group">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="description"
                  placeholder="Workout Description"
                  value={workout.description ?? ""}
                  onChange={(e) => {
                    field.onChange(e);
                    setWorkout({ ...workout, description: e.target.value });
                  }}
                />
              )}
            />
          </div>
          <div className="form-group">
            <Label htmlFor="type">Sport Type</Label>
            <Controller
              name="sport_type"
              control={control}
              render={({ field }) => (
                <SportTypeSelect
                  value={field.value ?? ""}
                  onChange={(e, selectedSport) => {
                    field.onChange(selectedSport);
                    setWorkout({ ...workout, sport_type: selectedSport });
                  }}
                />
              )}
            />
          </div>
          <div className="form-group">
            <Label htmlFor="workout-distance">Distance (km)</Label>
            <Controller
              name="distance"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="workout-distance"
                  placeholder="Enter distance"
                  type="number"
                  value={field.value ?? ""}
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
          <div className="form-group">
            <Label htmlFor="workout-duration">Duration (minutes)</Label>
            <Controller
              name="duration"
              control={control}
              rules={{
                validate: (value) =>
                  workouts
                    .map(workout => workout.name)
                    .includes(value?.toString() ?? "")
                    ? "Name taken"
                    : true,
              }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    id="workout-duration"
                    placeholder="Workout Name"
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setWorkout({ ...workout, name: e.target.value });
                    }}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="form-group">
            <label />
            <div className="col-span-2 flex flex-col gap-4 my-6">
              <button
                type="button"
                className={
                  `btn ` + (!workout.id ? "btn-disabled" : "btn-primary")
                }
                onClick={handleAddToCalendar}
                disabled={!workout.id}
              >
                Add to calendar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveWorkout}
              >
                Save workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

