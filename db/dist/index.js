import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
const LOG_LEVELS = ['warn', 'error'];
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
    name: "Default Run",
    date: new Date(),
    description: "",
    sportType: "Run",
    distance: null,
    duration: null,
    steps: ['30m Z2'],
    feeling: null,
    rpe: null,
    notes: null,
    activityUuid: null,
    athleteId: 0,
};
//# sourceMappingURL=index.js.map