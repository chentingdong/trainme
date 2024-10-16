import { useState } from "react";
import { fetchLatestActivitiesFromStrava } from "@/app/venders/strava/activities";
import { fetchActivityLaps } from "@/app/venders/strava/laps";
import type { Activity } from "@trainme/db";
import { useToast } from "@/app/components/Toaster";
import { fetchAthlete } from '@/app/venders/strava/athlete';

export const useStravaSync = () => {
  const { toast } = useToast();
  const [newActivityCount, setNewActivityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const syncStrava = async () => {
    setLoading(true);
    try {
      // fetch athlete first to get the latest data
      await fetchAthlete({ persist: true });
      return;
      // fetch activities
      const newActivities: Activity[] = await fetchLatestActivitiesFromStrava({ persist: true });
      // fetch laps for each activity
      for (const activity of newActivities) {
        await fetchActivityLaps({ activityId: activity.id, persist: true });
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
