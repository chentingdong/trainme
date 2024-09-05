import { Inter } from "next/font/google";
import "./globals.scss";
import 'flowbite/dist/flowbite.css';
import type { Metadata } from 'next'
import Header from './components/Header';

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
        <Header />
        <main className='flex flex-col p-4'>
          {children}
        </main>
      </body>
    </html>
  );
}