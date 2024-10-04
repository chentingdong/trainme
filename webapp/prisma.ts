import { v4 as uuidv4 } from "uuid";
import type { workout as Workout } from "@trainme/db";
import { PrismaClient } from "@trainme/db";

const globalForPrisma = global as unknown as {
  db: PrismaClient | undefined;
};

export const db =
  globalForPrisma.db ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export const defaultWorkout: Workout = {
  id: uuidv4(),
  type: "",
  sport_type: "",
  name: "Base run",
  description: "",
  steps: ["10m Z1"],
  distance: null,
  duration: null,
};

export const emptyWorkout: Workout = {
  id: uuidv4(),
  type: "",
  sport_type: "",
  name: "",
  description: "",
  steps: [],
  distance: null,
  duration: null,
};
