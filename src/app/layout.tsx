import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // Shadcn utility
import Image from "next/image";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Expose as CSS variable
});

export const metadata: Metadata = {
  title: "Cascala Care Transition Dashboard",
  description: "AI-powered clinical intelligence for better care team actions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-cascala-gray-50 font-sans antialiased",
          fontInter.variable
        )}
      >
        <div className="min-h-screen flex flex-col bg-cascala-gray-50">
          <header className="bg-white border-b border-cascala-gray-200 sticky top-0 z-50 shadow-subtle">
            <nav className="container h-20 flex items-center justify-between">
              <div className="flex items-center">
                {/* Cascala Logo */}
                <Image
                  src="/cascala_logo.svg"
                  alt="Cascala Logo"
                  width={170}
                  height={39}
                  priority
                  className="hover:opacity-90 transition-opacity duration-200"
                />
              </div>
              {/* Navigation Links & Actions can be added here */}
            </nav>
          </header>
          <main className="flex-grow container py-8 md:py-12">
            {children}
          </main>
          <footer className="bg-white border-t border-cascala-gray-200 py-8">
            <div className="container text-center">
              <p className="text-sm text-cascala-gray-500">
                &copy; {new Date().getFullYear()} Cascala. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
