import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
const LOG_LEVELS = ['info', 'warn', 'error'];
const getPrismaClient = () => {
    if (process.env.VERCEL_ENV) {
        return new PrismaClient();
    }
    if (globalThis.prismaGlobal)
        return globalThis.prismaGlobal;
    const prismaOptions = {
        log: LOG_LEVELS
    };
    globalThis.prismaGlobal = new PrismaClient(prismaOptions);
    return globalThis.prismaGlobal;
};
const db = getPrismaClient();
export { db };
export const defaultWorkout = {
    id: '',
    name: 'Default Workout',
    date: new Date(),
    description: "",
    sportType: "Run",
    distance: null,
    duration: null,
    steps: ['1. 10m Z2 Warm up', '2. 10m Z4', '3. 10m Z2 Cool down'],
    feeling: null,
    rpe: null,
    notes: null,
    activityUuid: null,
    athleteId: 0,
};
