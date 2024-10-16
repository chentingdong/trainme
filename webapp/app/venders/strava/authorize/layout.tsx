import React from 'react';

export default function StravaAuthorizeLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="container text-white my-20">
      {children}
    </div>
  );
}
