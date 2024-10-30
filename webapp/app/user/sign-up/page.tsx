"use client";

import { SignUp, useUser } from '@clerk/nextjs';

export default function Page() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="mt-14 flex justify-center">
        <SignUp
          routing="hash"
          forceRedirectUrl={`/user/callback`}
          fallbackRedirectUrl='/settings'
        />
      </div>
    );
  }

  return <div>Welcome!</div>;
}
