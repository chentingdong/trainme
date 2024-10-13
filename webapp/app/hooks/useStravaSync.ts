import { useState } from "react";
import { fetchLatestActivitiesFromStrava } from "@/app/api/strava/activities";
import { fetchActivityLaps } from "@/app/api/strava/laps";
import type { Activity } from "@trainme/db";
import { useToast } from "@/app/components/Toaster";

export const useStravaSync = () => {
  const { toast } = useToast();
  const [newActivityCount, setNewActivityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const syncStrava = async () => {
    setLoading(true);
    try {
      const newActivities: Activity[] = await fetchLatestActivitiesFromStrava(true);
      for (const activity of newActivities) {
        await fetchActivityLaps(activity.id, true);
      }
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
