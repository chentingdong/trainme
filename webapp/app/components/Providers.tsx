"use client";

import { trpc } from '@/app/api/trpc/client';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from '@/app/components/Toaster';

export function Providers({ children }: { children: React.ReactNode; }) {
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson
      })
    ]
  });

  const queryClient = new QueryClient();

  return (
    <ClerkProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </trpc.Provider>
    </ClerkProvider>
  );
}
