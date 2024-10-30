'use client';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mt-24 flex justify-center">
      <SignIn
        routing="hash"
        forceRedirectUrl={`/user/callback`}
        fallbackRedirectUrl='/'
      />
    </div>
  );
}
