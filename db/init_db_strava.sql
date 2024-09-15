-- raw tables from strava api
-- https://developers.strava.com/docs/reference/


-- strava activity table

-- DROP TABLE IF EXISTS public.activities;
CREATE TABLE public.activities (
  "resource_state" double precision,
  "athlete" json,
  "name" text,
  "distance" double precision,
  "moving_time" double precision,
  "elapsed_time" double precision,
  "total_elevation_gain" double precision,
  "type" text,
  "sport_type" text,
  "workout_type" double precision,
  "id" double precision primary key,
  "start_date" text,
  "start_date_local" text,
  "timezone" text,
  "utc_offset" double precision,
  "location_city" text NULL,
  "location_state" text NULL,
  "location_country" text,
  "achievement_count" double precision,
  "kudos_count" double precision,
  "comment_count" double precision,
  "athlete_count" double precision,
  "photo_count" double precision,
  "map" json,
  "trainer" boolean,
  "commute" boolean,
  "manual" boolean,
  "private" boolean,
  "visibility" text,
  "flagged" boolean,
  "gear_id" text,
  "start_latlng" json,
  "end_latlng" json,
  "average_speed" double precision,
  "max_speed" double precision,
  "average_cadence" double precision,
  "average_temp" double precision,
  "has_heartrate" boolean,
  "average_heartrate" double precision,
  "max_heartrate" double precision,
  "heartrate_opt_out" boolean,
  "display_hide_heartrate_option" boolean,
  "elev_high" double precision,
  "elev_low" double precision,
  "upload_id" double precision,
  "upload_id_str" text,
  "external_id" text,
  "from_accepted_tag" boolean,
  "pr_count" double precision,
  "total_photo_count" double precision,
  "has_kudoed" boolean,
  "suffer_score" double precision,
  "average_watts" double precision,
  "max_watts" double precision,
  "weighted_average_watts" double precision,
  "kilojoules" double precision,
  "device_watts" boolean
);

COMMENT ON TABLE public.activities IS 'raw activities from strava api';

-- Laps table
DROP TABLE IF EXISTS public.laps;
CREATE TABLE public.laps (
  "id" double precision primary key,
  "resource_state" double precision,
  "name" text,
  "activity" json,
  "athlete" json,
  "elapsed_time" double precision,
  "moving_time" double precision,
  "start_date" text,
  "start_date_local" text,
  "distance" double precision,
  "start_index" double precision,
  "end_index" double precision,
  "total_elevation_gain" double precision,
  "average_speed" double precision,
  "max_speed" double precision,
  "average_cadence" double precision,
  "device_watts" boolean,
  "average_watts" double precision,
  "average_heartrate" double precision,
  "max_heartrate" double precision,
  "lap_index" double precision,
  "split" double precision,
  "pace_zone" double precision
);

COMMENT ON TABLE public.laps IS 'raw laps from strava api';

-- Workout table
DROP TABLE IF EXISTS public.workouts;
CREATE TABLE public.workouts (
  "id" double precision primary key,
  "type" text,
  "sport_type" text,
  "name" text,
  "description" text,
  "workout" text
);

COMMENT ON TABLE public.workouts IS 'raw workouts in trainme db';
COMMENT ON COLUMN public.workouts.type IS 'Type of the workout (e.g., run, bike)';
COMMENT ON COLUMN public.workouts.sport_type IS 'Specific sport type (e.g., road cycling, trail running)';
COMMENT ON COLUMN public.workouts.name IS 'Name of the workout';
COMMENT ON COLUMN public.workouts.description IS 'Description of the workout';
COMMENT ON COLUMN public.workouts.workout IS 'Detailed workout plan or data';

INSERT INTO public.workouts (id, type, sport_type, name, description, workout) 
VALUES (1, 'run', 'run', '5k', '5k run', '15m warm-up in Z2 HR (127-133bpm) (127-133 bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
0.8km Z4 power=1s Z4 HR (144-162bpm)
2m Z2 HR (127-133bpm)
10m Z1 HR (100-126bpm)
');


ALTER TABLE public.activities RENAME TO activity;
ALTER TABLE public.laps RENAME TO lap;
ALTER TABLE public.workouts RENAME TO workout;

