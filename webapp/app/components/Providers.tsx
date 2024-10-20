"use client";

import { trpc } from '@/app/api/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log(publishableKey);
  return (
    <ClerkProvider afterSignOutUrl="/" publishableKey={publishableKey}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ClerkProvider>
  );
}
