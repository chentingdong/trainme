import { Prisma, PrismaClient, Workout } from '@prisma/client';
export * from '@prisma/client';
declare const db: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { db };
export declare const defaultWorkout: Workout;
