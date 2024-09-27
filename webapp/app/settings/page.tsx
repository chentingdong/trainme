"use client";

import React from "react";

import Garmin from "./Garmin";
import Strava from "./Strava";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { signOut } = useAuth();

  return (
    <div className="container">
      <div>
        <h1 className="h1">Account</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
        >
          Logout
        </button>

        <h1 className="h1">Connections</h1>
        <Strava />
        <Garmin />
      </div>
    </div>
  );
};

export default Page;
