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
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable
        )}
      >
        <div className="min-h-screen flex flex-col">
          <header className="bg-card border-b border-border sticky top-0 z-50">
            <nav className="container h-[80px] flex items-center justify-between py-2">
              <div className="flex items-center">
                {/* Cascala Logo */}
                <Image
                  src="/cascala_logo.svg"
                  alt="Cascala Logo"
                  width={170}
                  height={39}
                  priority
                />
              </div>
              {/* Navigation Links & Actions can be added here */}
            </nav>
          </header>
          <main className="flex-grow container py-8">
            {children}
          </main>
          <footer className="bg-card border-t border-border py-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Cascala. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
