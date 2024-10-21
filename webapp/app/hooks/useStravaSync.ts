"use client";

import { useState } from "react";
import { fetchLatestActivitiesFromStrava } from "@/app/venders/strava/activities";
import type { Activity } from "@trainme/db";
import { useToast } from "@/app/components/Toaster";
import { fetchAthlete } from '@/app/venders/strava/athlete';
import { trpc } from '@/app/api/trpc/client';

export const useStravaSync = () => {
  const { toast } = useToast();
  const [newActivityCount, setNewActivityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: accessToken } = trpc.strava.updateAccessToken.useQuery();

  if (!accessToken) {
    return { newActivityCount: 0, loading: false, syncStrava: async () => { } };
  }

  const syncStrava = async () => {
    setLoading(true);
    try {
      // fetch athlete
      await fetchAthlete({ accessToken: accessToken, persist: true });
      // fetch activities
      const newActivities: Activity[] = await fetchLatestActivitiesFromStrava({ persist: true });

      setNewActivityCount(newActivities.length);
      toast({ type: "success", content: "Successfully synced activities" });
    } catch (error) {
      console.error(error);
      toast({ type: "error", content: "Failed to sync activities" });
    } finally {
      setLoading(false);
    }
  };

  return { newActivityCount, loading, syncStrava };
};
