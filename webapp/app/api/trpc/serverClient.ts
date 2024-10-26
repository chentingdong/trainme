import { httpBatchLink } from '@trpc/client';
import { appRouter } from '@/server';
import { db } from '@trainme/db';

export const serverTrpc = appRouter.createCaller({
  db,
  links: [
    httpBatchLink({
      url: '/api/trpc'
    })
  ]
});
