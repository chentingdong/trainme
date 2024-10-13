import type { Activity } from "@trainme/db";
import type { Lap } from "@trainme/db";

export type MapField = {
  id: string;
  polyline: string | null;
  resource_state: number;
  // need to get from strava athletes/{id}, so not always populated.
  summaryPolyline?: string;
};

export type ActivityWithLaps = Activity & { laps?: Lap[]; };