"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/app/api/trpc/client';

export default function Page() {
  const searchParams = useSearchParams();
  const { isSignedIn, user } = useUser();

  const router = useRouter();

  const { mutateAsync: createUser } = trpc.user.create.useMutation();

  useEffect(() => {
    const saveUserAndRedirect = async () => {

      if (isSignedIn && user) {
        try {
          const newUser = await createUser({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? '',
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            imageUrl: user.imageUrl ?? '',
          });
          console.log('created new user: ', newUser);
          // Redirect to the original URL
          const redirectUrl = searchParams.get('redirect_url') || '/settings';
          router.push(redirectUrl);
        } catch (error) {
          console.error('Error saving user:', error);
          // Handle error (e.g., show a notification)
        }
      }
    };

    saveUserAndRedirect();
  }, [isSignedIn, user, searchParams, router, createUser]);

  return <div className="mt-14 flex justify-center">Setting up your account...</div>;
};

