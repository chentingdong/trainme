"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from '@/app/components/Toaster';
import { useState } from 'react';
import { trpc } from '@/app/api/trpc/client';

export function Providers({ children }: { children: React.ReactNode; }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson
        })
      ]
    })
  )

  const queryClient = new QueryClient();
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={publishableKey} signUpUrl="/user/sign-up" signInUrl="/user/sign-in">
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
