// "use client";

// import { SignUp } from '@clerk/nextjs';
// import { useUser } from '@/app/components/useUser';

// export default function Page() {
//   const { user } = useUser();

//   if (!user) {
//     return (
//       <div className="mt-14 flex justify-center">
//         <SignUp
//           routing="hash"
//           forceRedirectUrl={`/user/sso-callback`}
//           fallbackRedirectUrl='/settings'
//         />
//       </div>
//     );
//   }

//   return <div>Welcome!</div>;
// }
