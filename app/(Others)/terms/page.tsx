import type { Metadata } from "next"
import termsData from "@/data/termsAndCondition.json"
import LegalPage from "@/Components/LegalPage/LegalPage"

export const metadata: Metadata = {
  title: "Terms & Conditions | Woot Health",
  description:
    "Read the official Terms and Conditions governing the use of Woot Health services, including health plans, telemedicine, wallet payments, and provider networks.",
  keywords: [
    "Woot Health Terms",
    "HMO Terms Nigeria",
    "Health Platform Terms",
    "Telemedicine Terms",
    "Health Insurance Terms"
  ],
  metadataBase: new URL("https://woothealth.com"),
  alternates: {
    canonical: "/terms"
  },
  openGraph: {
    title: "Woot Health Terms & Conditions",
    description:
      "Official Terms and Conditions for using Woot Health digital healthcare services.",
    url: "https://woothealth.com/terms",
    siteName: "Woot Health",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Woot Health Terms & Conditions",
    description:
      "Official Terms and Conditions for using Woot Health digital healthcare services."
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function TermsPage() {
  return <LegalPage data={termsData} />
}
