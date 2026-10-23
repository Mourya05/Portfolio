import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mourya Birru | CS Student, Systems & Software",
  description:
    "Mourya Birru — final-year CS student at GCET, Hyderabad. Building low-level systems and hardware-connected software. Open to SDE, systems, and embedded internships.",
  metadataBase: new URL("https://mourya-birru.me"),
  alternates: {
    canonical: "https://mourya-birru.me",
  },
  openGraph: {
    title: "Mourya Birru | CS Student, Systems & Software",
    description:
      "Final-year CS student building low-level systems and hardware-connected software. Open to SDE, systems, and embedded internships.",
    type: "website",
    url: "https://mourya-birru.me",
    siteName: "Mourya Birru",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mourya Birru — CS Student, Systems & Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mourya Birru | CS Student, Systems & Software",
    description:
      "Final-year CS student building low-level systems and hardware-connected software.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="bg-grid min-h-full flex flex-col">
        <Navigation />
        <main id="main-content" className="relative z-10 w-full flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
