import type { Metadata } from "next"
import termsData from "@/data/termsAndCondition.json"
import LegalPage from "@/Components/LegalPage/LegalPage"


export default function TermsPage() {
  return (
    <section className="relative mx-auto overflow-y-auto h-[80vh] custom-scrollbar">      
    <LegalPage data={termsData} />

    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e00000;
        }
      `}</style>
    </section>
  )
}