import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppSidebarProvider } from "@/components/navigation/sidebar-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Debt Collection Management",
  description: "Manage debt collection cases and debtors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Script
            src="https://unpkg.com/@elevenlabs/convai-widget-embed"
            strategy="lazyOnload"
          />
          <SignedOut>
            <header className="sticky top-0 z-50 flex justify-between items-center p-4 px-6 gap-4 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DC</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Debt Collection</span>
              </div>
              <div className="flex items-center gap-3">
                <SignInButton>
                  <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm sm:text-base px-3 sm:px-4 cursor-pointer transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6 cursor-pointer transition-all shadow-lg hover:shadow-xl">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </header>
          </SignedOut>
          <AppSidebarProvider>
            {children}
          </AppSidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
