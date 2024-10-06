import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@trainme/db";
import { WorkoutWithSportType } from '@/utils/types';

const globalForPrisma = global as unknown as {
  db: PrismaClient | undefined;
};

export const db =
  globalForPrisma.db ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export const defaultWorkout: WorkoutWithSportType = {
  id: uuidv4(),
  name: "Base run",
  description: "",
  steps: ["10m Z1"],
  distance: null,
  duration: null,
  sport_type_id: 1,
  sport_type: {
    id: 0,
    sport_type: '',
    type: '',
    active: null
  },
};

export const emptyWorkout: WorkoutWithSportType = {
  id: uuidv4(),
  name: "",
  description: "",
  steps: [],
  distance: null,
  duration: null,
  sport_type_id: 1,
  sport_type: {
    id: 0,
    sport_type: '',
    type: '',
    active: null
  },
};
