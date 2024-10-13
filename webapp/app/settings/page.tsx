"use client";

import React from "react";

import Garmin from "@/app/settings/Garmin";
import Strava from "./Strava";

const Page = () => {

  return (
    <div className="container">
      <div>
        <h1 className="h1">Connections</h1>
        <Strava />
        <Garmin />
      </div>
    </div>
  );
};

export default Page;
