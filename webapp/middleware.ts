// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
    middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      '/',
      '/user/sign-in',
      '/user/sign-up',
      '/user/callback',
      '/user/sso-callback', // Deprecated
    ],
  },
});

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/user/sign-in(.*)",
//   "/user/sso-callback(.*)",
//   "/user/sign-up(.*)",
// ]);

// export default clerkMiddleware(
//   async (auth, request) => {
//     if (!isPublicRoute(request)) {
//       await auth.protect();
//     }
//   },
//   { clockSkewInMs: 60000 },
// );

export const config = {
  // Skip Next.js internals and all static files, unless found in search params
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/((?!.*\\..*|_next).*)',
  ],
};
