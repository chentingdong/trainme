import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@trainme/db";
import type { Workout } from '@trainme/db';

const globalForPrisma = global as unknown as {
  db: PrismaClient | undefined;
};

export const db =
  globalForPrisma.db ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

// TODO: These should either in the db or somewhere hold all constants
export const defaultWorkout: Workout = {
  id: uuidv4(),
  name: "Base run",
  description: "",
  steps: ["10m Z1"],
  distance: null,
  duration: null,
  sportType: "Run",
};

export const emptyWorkout: Workout = {
  id: uuidv4(),
  name: "",
  description: "",
  steps: [],
  distance: null,
  duration: null,
  sportType: "",
};
