// import { useEffect, useState } from 'react';
// import { getSignInUrl, getSignUpUrl, withAuth } from '@workos-inc/authkit-nextjs';

// // This is in the workos-inc package, not exported.
// export interface User {
//     object: 'user';
//     id: string;
//     email: string;
//     emailVerified: boolean;
//     profilePictureUrl: string | null;
//     firstName: string | null;
//     lastName: string | null;
//     createdAt: string;
//     updatedAt: string;
// }

// export const useUser = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const session = await withAuth({ ensureSignedIn: true });
//       setUser(session.user); 
//       setLoading(false);
//     };

//     fetchUser().catch(error => {
//       console.error('Error fetching user:', error);
//       setLoading(false);
//     });
//   }, []);

//   return { user, loading };
// };

// export const useSignInUrl = () => {
//   const [signInUrl, setSignInUrl] = useState<string | null>(null);  
//   useEffect(() => {
//     getSignInUrl().then((url: string) => setSignInUrl(url));
//   }, []);
//   return signInUrl;
// };

// export const useSignUpUrl = () => {
//   const [signUpUrl, setSignUpUrl] = useState<string | null>(null);
//   useEffect(() => {
//     getSignUpUrl().then((url: string) => setSignUpUrl(url));
//   }, []);
//   return signUpUrl;
// };  
