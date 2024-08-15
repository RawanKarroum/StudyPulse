"use client";

import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
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
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-RD20E0Z376`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-RD20E0Z376', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />

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
