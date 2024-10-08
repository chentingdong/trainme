import type { activity as Activity } from "@trainme/db";
import type { lap as Lap } from "@trainme/db";

export type Map = {
  summary_polyline: string;
};

export type ActivityWithLaps = Activity & { laps?: Lap[]; };