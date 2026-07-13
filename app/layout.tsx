import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationLoadingProvider } from "@/components/NavigationLoadingProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GCAP Calculator Analytics",
  description: "Calculator usage analytics for the GCAP Android app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={null}>
          <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
