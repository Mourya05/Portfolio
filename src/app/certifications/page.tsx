import type { Metadata } from "next";
import CertificationsSection from "@/components/sections/CertificationsSection";

export const metadata: Metadata = {
  title: "Certifications | Mourya Birru",
  description:
    "Verified credentials and certifications of Mourya Birru — spanning AI, data science, cloud, networking, and full-stack web development.",
};

export default function CertificationsPage() {
  return (
    <main className="relative w-full flex flex-col pt-10">
      <CertificationsSection />
    </main>
  );
}
