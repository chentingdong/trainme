import { appRouter } from '@/server';
import { db } from '@trainme/db';
import { httpBatchLink } from '@trpc/client';

export const serverClient = appRouter.createCaller({
  db,
  links: [
    httpBatchLink({
      url: '/api/trpc'
    })
  ]
});
