// Not used anymore
"use server";

import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const activeTokens = new Set<string>();

export const garminSyncActivities = async (token: string) => {
  activeTokens.add(token);
  try {
    // Simulate a long-running operation
    for (let i = 0; i < 10; i++) {
      if (!activeTokens.has(token)) {
        throw new Error("Aborted");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const script = "../etl/garmindb_cli.py";
    const logFile = "../logs/garmindb_cli_latest.log";
    const pythonScript = `python ${script} --activities --download --import --analyze --latest >> ${logFile}`;
    console.log(`Running: ${pythonScript}`);
    const { stdout, stderr } = await execPromise(pythonScript);
    if (stderr) {
      console.error(`Error: ${stderr}`);
      throw new Error("Error running Python script");
    }
    return stdout;
  } catch (error) {
    console.error(error);
    activeTokens.delete(token);
  }
};
