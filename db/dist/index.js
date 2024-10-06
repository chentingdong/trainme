import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
const LOG_LEVELS = ['query', 'info', 'warn', 'error'];
const getPrismaClient = () => {
    if (process.env.VERCEL_ENV) {
        return new PrismaClient();
    }
    if (globalThis.prismaGlobal)
        return globalThis.prismaGlobal;
    const prismaOptions = {
        log: LOG_LEVELS.map((level) => ({
            emit: 'stdout',
            level: level
        })),
    };
    globalThis.prismaGlobal = new PrismaClient(prismaOptions);
    return globalThis.prismaGlobal;
};
const db = getPrismaClient();
export { db };
//# sourceMappingURL=index.js.map