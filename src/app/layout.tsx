import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mourya Birru | Mourya's Domain",
  description: "Portfolio of Mourya Birru. AI Engineer and Data Scientist. Exploring Agentic AI & Low-Level Systems.",
};

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PointerGlow from "@/components/PointerGlow";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-teal/30 overflow-x-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-[#000000] via-[#040406] to-[#08080C] pointer-events-none z-0" />
        <PointerGlow />
        <BackgroundMusic />
        <Navigation />
        <Footer />
        <div className="relative z-10 w-full flex-1 flex flex-col pt-24">
          {children}
        </div>

        {/* Global Glitch Filter Definition */}
        <svg className="hidden h-0 w-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="page-glitch">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
