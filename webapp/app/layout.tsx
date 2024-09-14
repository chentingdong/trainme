import React from "react";
import { Inter } from "next/font/google";
import "./globals.scss";
import 'flowbite/dist/flowbite.css';
import type { Metadata } from 'next'
import Header from './components/Header';
import { Toaster, ToastProvider } from './components/Toaster';
import { Suspense } from 'react';
import Loading from './components/Loading';

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "TrainMe",
  description: "Self coaching for athletes",
  icons: {
    icon: '/favicon.ico?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + 'flex flex-col'}>
        <ToastProvider>
          <Header />
          <Toaster />
          <main className='flex flex-col p-4'>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}