import type { workout as Workout } from "@trainme/db";
import type { sport_type as SportType } from "@trainme/db";

export type Map = {
  summary_polyline: string;
};

export type WorkoutWithSportType = Workout & { sport_type: SportType; };
