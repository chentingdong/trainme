"use client";

import React from "react";
import Strava from "./Strava";
import { Card } from 'flowbite-react';

const Page = () => {

  return (
    <div className="container">
      <h2 className="h2">Settings</h2>
      <div className="">
        <Card className="p-4">
          <Strava />
        </Card>
      </div>
    </div>
  );
};

export default Page;
