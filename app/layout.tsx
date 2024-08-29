'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

import { Header } from "./ui/Header";
import { WalletHandler } from "./wallet";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-NZ1F6WL2PM" />
      <Script
        type="text/javascript"
        src="https://www.bugherd.com/sidebarv2.js?apikey=mdyh8j9rijiqijf1qow8tw"
        async
      />
      <body className={`${inter.className} text-white bg-black`}>
        <QueryClientProvider client={queryClient}>
          <WalletHandler>
            <Header />
            {children}
            <Toaster />
          </WalletHandler>
        </QueryClientProvider>
      </body>
    </html >
  );
}