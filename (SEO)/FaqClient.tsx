import faqData from "@/data/faq.json";
import FaqClient from "@/Components/FaqPage/MainFaq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Woot Health FAQs | Health Plans, Telemedicine & Support",
  description:
    "Find answers to common questions about Woot Health plans, telemedicine, wallet system, reimbursements, providers, and more.",
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.categories.flatMap((category) =>
      category.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <FaqClient />
    </>
  );
}