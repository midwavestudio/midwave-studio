import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "../lib/contexts/AuthContext";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Midwave Studio | Design & Software Development Agency",
  description: "Midwave Studio redefines digital craftsmanship for discerning clients across the United States, specializing in high-fidelity digital design and custom software solutions.",
  keywords: ["design agency", "software development", "luxury digital solutions", "high-end web design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add polyfill for clipboard API */}
        <Script id="clipboard-polyfill">{`
          // Clipboard API polyfill and error handling
          if (typeof window !== 'undefined') {
            window.addEventListener('error', function(e) {
              // Check if error is related to clipboard
              if (e && e.message && typeof e.message === 'string' && 
                  (e.message.includes('clipboard') || e.message.includes('Clipboard'))) {
                console.warn('Clipboard operation failed, but error was prevented from crashing the app:', e.message);
                // Prevent the error from bubbling up
                e.preventDefault();
                e.stopPropagation();
              }
            }, true);
          }
        `}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AuthProvider>
            {children}
            <Analytics />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
          </AuthProvider>
      </body>
    </html>
  );
}
