import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
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
// TODO: These should either in the db or somewhere hold all constants
export const defaultWorkout = {
    id: uuidv4(),
    name: "Base run",
    description: "",
    steps: ["10m Z1"],
    distance: null,
    duration: null,
    sportType: "Run",
};
export const emptyWorkout = {
    id: uuidv4(),
    name: "",
    description: "",
    steps: [],
    distance: null,
    duration: null,
    sportType: "",
};
//# sourceMappingURL=index.js.map