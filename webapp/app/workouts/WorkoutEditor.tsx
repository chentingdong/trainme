"use client";

import { WorkoutChart } from "./WorkoutChart";
import { Label, TextInput, Textarea } from "flowbite-react";
import { addToCalendar, saveWorkout } from "../actions/workout";
import { useToast } from "../components/Toaster";
import type { workout as Workout } from "@prisma/client";
import SportTypeSelect from "../components/SportTypeSelect";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useWorkoutStore } from "@/app/components/useWorkoutStore";
import { defaultWorkout } from "@/prisma";
import WorkoutList from "./WorkoutList";
import { useScheduleStore } from "../components/useScheduleStore";

export default function WorkoutEditor() {
  const { workout, setWorkout, workoutNames } = useWorkoutStore();
  const { scheduleDate, setScheduleDate } = useScheduleStore();

  const { control, handleSubmit } = useForm<Workout>({
    values: workout ?? defaultWorkout,
    mode: "onChange",
  });

  const toaster = useToast();

  const onSubmit: SubmitHandler<Workout> = async (data) => {
    try {
      const updatedWorkout = { ...workout, ...data };
      setWorkout(updatedWorkout);
      await saveWorkout(updatedWorkout);
      toaster.showToaster("Workout updated", "success");
    } catch (error) {
      toaster.showToaster("Failed to update workout: " + error, "error");
    }
  };

  const handleAddToCalendar = async () => {
    if (workout?.id) {
      try {
        await saveWorkout(workout);
        await addToCalendar(workout.id, scheduleDate);
        setScheduleDate(null);
        toaster.showToaster("Workout added to calendar", "success");
      } catch (error) {
        toaster.showToaster(
          "Failed to add workout to calendar: " + error,
          "error",
        );
      }
    }
  };

  const handleSaveWorkout = async () => {
    try {
      if (workout && workout.steps) {
        await saveWorkout(workout);
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
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-4 p-2 m-0 h-full w-full bg-slate-100 dark:bg-black opacity-85"
    >
      <div className="col-span-3 h-full overflow-auto">
        <WorkoutList />
      </div>
      <div className="col-span-6 flex flex-col justify-end gap-4 bg-center bg-cover h-full">
        <Controller
          name="steps"
          control={control}
          render={({ field }) => {
            return (
              <Textarea
                id="steps"
                autoFocus
                className="flex-grow text-lg font-handwriting tracking-widest line-height-wide bg-opacity-70 w-144 mx-auto scroll"
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
        <div className="h-24 w-full px-2">
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
                    workoutNames.includes(value?.toString().trim() ?? "")
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
                  workoutNames.includes(value?.toString() ?? "")
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
