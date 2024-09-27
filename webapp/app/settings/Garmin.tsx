import React, { useState } from "react";
import Loading from "@/app/components/Loading";
import Debug from "@/app/components/Debug";
import { garminSyncActivities } from "@/app/actions/syncGarmin"; // Assuming this is the correct import
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const Garmin = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | string>(null);
  const [error, setError] = useState(null);
  const [cancelToken, setCancelToken] = useState<string | null>(null);

  const handleRefresh = async () => {
    const token = uuidv4();
    setCancelToken(token);
    setLoading(true);
    setError(null);

    try {
      const result = await garminSyncActivities(token);
      if (cancelToken !== token) {
        return; // Ignore the result if the token has changed
      }
      setData(result);
    } catch (err: any) {
      if (cancelToken === token) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCancelToken(null);
    setLoading(false);
  };

  return (
    <div>
      <h2>Garmin</h2>
      <p>Connect your Garmin account to let the app sync your activities.</p>
      <div className="py-4 flex gap-4">
        <button className="btn btn-primary" disabled>
          Connect to Garmin
        </button>
        {!loading && (
          <button
            className="btn btn-primary"
            title="This might take longer time. Please be patient."
            onClick={handleRefresh}
          >
            Sync Garmin Activities
          </button>
        )}
        {loading && (
          <button
            className="btn btn-warning flex gap-2 items-center"
            onClick={handleCancel}
          >
            Cancel Garmin Sync
            <Loading size={16} />
          </button>
        )}
      </div>
      {data && <Debug data={data} />}
      {error && <Debug data={error} />}
    </div>
  );
};

export default Garmin;
