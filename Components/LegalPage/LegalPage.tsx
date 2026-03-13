import { LegalDocument } from "@/types/legal"

interface LegalPageProps {
  data: LegalDocument
}

export default function LegalPage({ data }: LegalPageProps) {
  return (
    <div className="lg:max-w-4xl px-4 mx-auto py-8 lg:py-12">
      
      {/* Header */}
      <div className="lg:mb-8 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.title}</h1>
        <p className="text-sm text-gray-500">
          Effective Date: {new Date(data.effectiveDate).toDateString()}
        </p>
        <p className="mt-3 lg:mt-6 text-[1.08rem] text-gray-800 leading-relaxed">
          {data.introduction}
        </p>
      </div>

      {/* Sections */}
      <div className="lg:space-y-4 space-y-2">
        {data.sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-[1.3rem] lg:text-2xl font-semibold mb-1 lg:mb-2">
              {section.id}. {section.title}
            </h2>

            {Array.isArray(section.content) ? (
              <ul className="list-disc pl-8 space-y-1 text-gray-800">
                {section.content.map((item, index) => (
                  <li key={index} className="md:text-lg">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-800 md:text-lg leading-relaxed">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}