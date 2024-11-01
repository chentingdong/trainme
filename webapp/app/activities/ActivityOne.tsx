import React from "react";
import SportIcon from "./SportIcon";
import ActivityLaps from "./ActivityLaps";
import ActivityMap from "./ActivityMap";
import type { ActivityWithLaps } from "@/utils/types";

type Props = {
  activity: ActivityWithLaps;
};

export default function ActivityOne({ activity }: Props) {
  return (
    <div>
      <div className="card-header flex items-center">
        <SportIcon type={activity.type} />
        <div className="mx-4">{activity.name}</div>
      </div>
      <div className="card-body">
        <div className="my-4">
          <div className="flex gap-4">
            <div>{activity.id}</div>
            <div>{activity.type}</div>
            <div>{activity.distance} meters</div>
            <div>{activity.movingTime} seconds</div>
            <div>{activity.totalElevationGain} meters</div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-8 h-128">
          <ActivityMap
            className="col-span-2"
            summaryPolyline={
              (activity.mapField as { summaryPolyline?: string; })?.summaryPolyline
            }
          />
          <ActivityLaps className="col-span-3" laps={activity.laps || []} />
        </div>
      </div>
      <div className="card-footer">{activity.distance}</div>
    </div>
  );
}
