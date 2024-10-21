import React from "react";
import { Inter } from "next/font/google";
import "./globals.scss";
import type { Metadata } from "next";
import Header from "./components/Header";
import { Toaster } from "./components/Toaster";
import { Suspense } from "react";
import Loading from "./components/Loading";
import { Providers } from '@/app/components/Providers';

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "TrainMe",
  description: "Self coaching for athletes",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClass = (): string => {
    const className =
      "bg-gray-100 text-gray-900 h-screen overflow-auto flex flex-col";
    return className;
  };
  return (
    <html lang="en">
      <body className={inter.className + bodyClass}>
        <Providers>
          <Header />
          <Toaster />
          <main className="flex-grow mt-8">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
