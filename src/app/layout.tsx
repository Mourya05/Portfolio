import type { Metadata, Viewport } from "next";
import { Sora, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mourya Birru | CS Student · AI/ML, Data Science & Software",
  description:
    "Final-year CS student at GCET, Hyderabad, building machine learning and software projects, from an LLM inference engine in CUDA to full-stack apps. Open to AI/ML, data science and SDE roles.",
  metadataBase: new URL("https://mourya-birru.me"),
  alternates: {
    canonical: "https://mourya-birru.me",
  },
  openGraph: {
    title: "Mourya Birru | CS Student · AI/ML, Data Science & Software",
    description:
      "Final-year CS student at GCET, Hyderabad, building machine learning and software projects, from an LLM inference engine in CUDA to full-stack apps. Open to AI/ML, data science and SDE roles.",
    type: "website",
    url: "https://mourya-birru.me",
    siteName: "Mourya Birru",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mourya Birru — CS Student · AI/ML, Data Science & Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mourya Birru | CS Student · AI/ML, Data Science & Software",
    description:
      "Final-year CS student at GCET, Hyderabad, building machine learning and software projects, from an LLM inference engine in CUDA to full-stack apps. Open to AI/ML, data science and SDE roles.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#07060c",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mourya Birru",
  url: "https://mourya-birru.me",
  description:
    "Final-year Computer Science student at GCET, Hyderabad, building machine learning and software projects.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Geethanjali College of Engineering and Technology",
  },
  sameAs: [
    "https://github.com/mourya05",
    "https://linkedin.com/in/mourya-birru",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Navigation />
        <main id="main-content" className="relative z-10 w-full flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
