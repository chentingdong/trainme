"use client";

import React from "react";
import WorkoutEditor from "./WorkoutEditor";
import WorkoutList from "./WorkoutList";

export default function Page() {
  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      <div className="col-span-1 border-l h-full border-blue-200 p-4">
        <WorkoutList />
      </div>
      <div className="col-span-4 p-4">
        <WorkoutEditor />
      </div>
    </div>
  );
}
