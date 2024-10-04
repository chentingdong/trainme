"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FcSynchronize } from "react-icons/fc";
import { RxActivityLog } from "react-icons/rx";
import { BsCalendar3 } from "react-icons/bs";

import { fetchLatestActivitiesFromStrava } from "@/app/api/strava/activities";
import type { activity as Activity } from "@trainme/db";
// import { useToast } from "./Toaster";
import { fetchActivityLaps } from "@/app/api/strava/laps";

const Header = () => {
  const [newActivityCount, setNewActivityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  // const { showToaster } = useToast();

  const syncStrava = async () => {
    setLoading(true);
    try {
      const newActivities: Activity[] =
        await fetchLatestActivitiesFromStrava(true);
      for (const activity of newActivities) {
        await fetchActivityLaps(activity.id, true);
      }
      setNewActivityCount(newActivities.length);
      // showToaster("Successfully synced activities", "success");
    } catch (error) {
      console.error(error);
      // showToaster("Failed to sync activities", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-slate-800 text-white p-2 fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center">
        <a href="/" className="text-xl font-normal flex gap-4">
          <div className="bg-blue-500 rounded-full h-7">
            <Image src="/TrainMe.webp" alt="Logo" width={32} height={32} />
          </div>
          <div className="text-blue-100">TrainMe</div>
        </a>
        <ul className="flex gap-4 items-center">
          <li>
            <a
              href="#"
              onClick={syncStrava}
              className="flex items-center gap-2"
            >
              <FcSynchronize
                className={loading ? "icon loading-icon" : "icon"}
              />
              Sync Strava
            </a>
          </li>
          <li>
            <a
              href="/calendar"
              className="hover:underline flex gap-2 items-center"
            >
              <BsCalendar3 className="icon" />
              Calendar
            </a>
          </li>
          <li className="relative flex gap-1 items-center">
            <a
              href="/activities"
              className="hover:underline flex gap-2 items-center"
            >
              <RxActivityLog className="icon" />
              Activities
            </a>
            {newActivityCount > 0 && (
              <span className="circle small bg-green-700">
                {newActivityCount}
              </span>
            )}
          </li>
          <li>
            <a href="/workouts" className="hover:underline">
              Workouts
            </a>
          </li>
          <li>
            <a href="/settings" className="hover:underline">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
