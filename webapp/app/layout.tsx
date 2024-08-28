import { Inter } from "next/font/google";
import "./globals.scss";
import type { Metadata } from 'next'

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}