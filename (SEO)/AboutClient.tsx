import aboutData from "@/data/about.json";
import AboutClient from "@/app/(Dashboard)/dashboard/(retail)/retail/about/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Woot Health | Digital Healthcare That Works",
  description:
    "Learn how Wooot Health simplifies healthcare with digital health plans, trusted hospitals, fast approvals, and seamless care.",
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: aboutData.title,
    publisher: {
        "@type": "Organization",
        name: "Woot Health",
    },
  };

  return (
    <>
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <AboutClient data={aboutData} />
    </>
  );
}