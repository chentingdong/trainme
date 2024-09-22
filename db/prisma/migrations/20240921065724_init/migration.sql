-- CreateTable
CREATE TABLE "activity" (
    "resource_state" DOUBLE PRECISION,
    "athlete" JSON NOT NULL,
    "name" TEXT,
    "distance" DOUBLE PRECISION,
    "moving_time" DOUBLE PRECISION,
    "elapsed_time" DOUBLE PRECISION,
    "total_elevation_gain" DOUBLE PRECISION,
    "type" TEXT,
    "sport_type" TEXT,
    "workout_type" DOUBLE PRECISION,
    "id" DOUBLE PRECISION NOT NULL,
    "start_date" TEXT,
    "start_date_local" TEXT,
    "timezone" TEXT,
    "utc_offset" DOUBLE PRECISION,
    "location_city" TEXT,
    "location_state" TEXT,
    "location_country" TEXT,
    "achievement_count" DOUBLE PRECISION,
    "kudos_count" DOUBLE PRECISION,
    "comment_count" DOUBLE PRECISION,
    "athlete_count" DOUBLE PRECISION,
    "photo_count" DOUBLE PRECISION,
    "map" JSON,
    "trainer" BOOLEAN,
    "commute" BOOLEAN,
    "manual" BOOLEAN,
    "private" BOOLEAN,
    "visibility" TEXT,
    "flagged" BOOLEAN,
    "gear_id" TEXT,
    "start_latlng" JSON,
    "end_latlng" JSON,
    "average_speed" DOUBLE PRECISION,
    "max_speed" DOUBLE PRECISION,
    "average_cadence" DOUBLE PRECISION,
    "average_temp" DOUBLE PRECISION,
    "has_heartrate" BOOLEAN,
    "average_heartrate" DOUBLE PRECISION,
    "max_heartrate" DOUBLE PRECISION,
    "heartrate_opt_out" BOOLEAN,
    "display_hide_heartrate_option" BOOLEAN,
    "elev_high" DOUBLE PRECISION,
    "elev_low" DOUBLE PRECISION,
    "upload_id" DOUBLE PRECISION,
    "upload_id_str" TEXT,
    "external_id" TEXT,
    "from_accepted_tag" BOOLEAN,
    "pr_count" DOUBLE PRECISION,
    "total_photo_count" DOUBLE PRECISION,
    "has_kudoed" BOOLEAN,
    "suffer_score" DOUBLE PRECISION,
    "average_watts" DOUBLE PRECISION,
    "max_watts" DOUBLE PRECISION,
    "weighted_average_watts" DOUBLE PRECISION,
    "kilojoules" DOUBLE PRECISION,
    "device_watts" BOOLEAN,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "activity_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "lap" (
    "id" DOUBLE PRECISION NOT NULL,
    "resource_state" DOUBLE PRECISION,
    "name" TEXT,
    "activity" JSON,
    "athlete" JSON,
    "elapsed_time" DOUBLE PRECISION,
    "moving_time" DOUBLE PRECISION,
    "start_date" TEXT,
    "start_date_local" TEXT,
    "distance" DOUBLE PRECISION,
    "start_index" DOUBLE PRECISION,
    "end_index" DOUBLE PRECISION,
    "total_elevation_gain" DOUBLE PRECISION,
    "average_speed" DOUBLE PRECISION,
    "max_speed" DOUBLE PRECISION,
    "average_cadence" DOUBLE PRECISION,
    "device_watts" BOOLEAN,
    "average_watts" DOUBLE PRECISION,
    "average_heartrate" DOUBLE PRECISION,
    "max_heartrate" DOUBLE PRECISION,
    "lap_index" DOUBLE PRECISION,
    "split" DOUBLE PRECISION,
    "pace_zone" DOUBLE PRECISION,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "lap_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "workout" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "sport_type" TEXT,
    "name" TEXT,
    "description" TEXT,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "distance" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,

    CONSTRAINT "workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_date" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128),
    "workout_id" UUID NOT NULL,
    "activity_uuid" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN DEFAULT false,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "workout_date_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_id_key" ON "activity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_date_name_key" ON "workout_date"("name");

-- AddForeignKey
ALTER TABLE "workout_date" ADD CONSTRAINT "workout_date_activity_uuid_fkey" FOREIGN KEY ("activity_uuid") REFERENCES "activity"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_date" ADD CONSTRAINT "workout_date_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
