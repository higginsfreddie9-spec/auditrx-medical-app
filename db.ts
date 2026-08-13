import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AuditTool from "@/components/AuditTool";
import HowItWorks from "@/components/HowItWorks";
import ResourcesTeaser from "@/components/ResourcesTeaser";
import HomeFAQ from "@/components/HomeFAQ";

export const metadata: Metadata = {
  title: "How to Dispute a Medical Bill — Find Overcharges Instantly",
  description:
    "Upload your medical bill and insurance EOB. AuditRx AI instantly finds CPT code errors, duplicate charges, and overcharges, then drafts a dispute letter you can send today.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <AuditTool />
      <HowItWorks />
      <ResourcesTeaser />
      <HomeFAQ />
    </>
  );
}
