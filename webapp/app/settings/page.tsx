"use client";

import React from "react";
import Strava from "./Strava";
import Athlete from "./Athlete"; // Add this import statement

const Page = () => {

  return (
    <div className="container">
      <div>
        <h2 className="h1">Settings</h2>
        <Strava />
        <Athlete />
      </div>
    </div>
  );
};

export default Page;
