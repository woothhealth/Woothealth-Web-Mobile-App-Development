import type { Metadata } from "next"

import privacyData from "@/data/privacyPolicy.json"
import LegalPage from "@/Components/LegalPage/LegalPage"

export const metadata: Metadata = {
  title: "Privacy Policy | Woot Health",
  description:
    "Read the official Privacy Policy governing the use of Woot Health services, including health plans, telemedicine, wallet payments, and provider networks.",
  keywords: [
    "Woot Health Privacy Policy",
    "HMO Privacy Nigeria",
    "Health Platform Privacy",
    "Telemedicine Privacy",
    "Health Insurance Privacy"
  ],
  metadataBase: new URL("https://woothealth.com"),
  alternates: {
    canonical: "/privacy"
  },
  openGraph: {
    title: "Woot Health Privacy policy",
    description:
      "Official Privacy Policy for using Woot Health digital healthcare services.",
    url: "https://woothealth.com/privacy",
    siteName: "Woot Health",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Woot Health Privacy policy",
    description:
      "Official Privacy policy for using Woot Health digital healthcare services."
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function PrivacyPage() {
  return <LegalPage data={privacyData} />
}
