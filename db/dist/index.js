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
    name: '',
    date: new Date(),
    description: "",
    sportType: "Run",
    distance: null,
    duration: null,
    steps: [''],
    feeling: null,
    rpe: null,
    notes: null,
    activityUuid: null,
    athleteId: 0,
};
//# sourceMappingURL=index.js.map