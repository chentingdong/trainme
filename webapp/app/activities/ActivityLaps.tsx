"use client";
import React, { useRef } from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { formatTimeSeconds } from "@/utils/timeUtils";
import { formatDistance } from "@/utils/distanceUtils";
import type { Lap } from "@trainme/db";

type Props = {
  laps: Lap[]; 
  className?: string;
};

export default function ActivityLaps({ laps, className }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Convert average speed (m/s) to pace (min/mile)
  const lapWithPace = laps?.map((lap) => {
    if (lap.averageSpeed === null || lap.averageSpeed === undefined) {
      return {
        ...lap,
        pace: null,
        formattedPace: null,
      };
    }

    const paceInMinutesPerMile = 26.8224 / lap.averageSpeed; // Convert m/s to min/mile
    const minutes = Math.floor(paceInMinutesPerMile);
    const seconds = Math.round((paceInMinutesPerMile - minutes) * 60);
    const pace = `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as mm:ss/mile

    return {
      ...lap,
      pace: paceInMinutesPerMile,
      formattedPace: pace,
    };
  });

  const barSize = 20;

  return (
    <div
      ref={chartRef}
      className={className}
      style={{ width: "100%", maxHeight: barSize * laps?.length }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 grid grid-cols-4">
          <div>Lap</div>
          <div>Time</div>
          <div>Dist (miles)</div>
          <div>Pace (min/mile)</div>
        </div>
        <div className="col-span-1">Pace</div>
      </div>
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="col-span-1 h-full">
          {lapWithPace?.map((lap, index) => (
            <div className="gap-2 grid grid-cols-4" key={index}>
              <div>{index + 1}</div>
              <div>{formatTimeSeconds(lap.elapsedTime ?? 0)}</div>
              <div>{formatDistance(lap.distance ?? 0)}</div>
              <div>{lap.formattedPace}</div>
            </div>
          ))}
        </div>
        <div className="col-span-1 flex flex-col h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={lapWithPace}
              layout="vertical"
              barSize={barSize * 0.8} // Fixed horizontal width for bars
              barCategoryGap={2} // Set a fixed pixel value for the gap between bars
              barGap={0} // No gap between bars within the same category
            >
              <XAxis type="number" dataKey="pace" hide />
              <YAxis type="category" dataKey="id" hide />
              <Bar dataKey="pace" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
