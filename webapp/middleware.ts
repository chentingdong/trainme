import { clerkMiddleware } from "@clerk/nextjs/server";

import { createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up"]);

export default clerkMiddleware(
  (auth, request) => {
    if (!isPublicRoute(request)) {
      auth().protect();
    }
  },
  { clockSkewInMs: 60000 },
);

export const config = {
  // Skip Next.js internals and all static files, unless found in search params
  matcher: [
    '/ingest/:path*',
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
