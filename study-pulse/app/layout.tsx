"use client";

import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname?.startsWith("/landing");

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {!isLandingPage && (
            <>
              <SignedOut>
                {/* Link or Button to redirect to the landing page */}
              </SignedOut>
              <SignedIn>
                <Navbar />
              </SignedIn>
            </>
          )}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
