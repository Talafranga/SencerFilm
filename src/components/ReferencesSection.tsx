import { client } from "@/sanity/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";

// GROQ: fetch the singleton referencesPage with references
const REFERENCES_QUERY = /* groq */ `
*[_type == "referencesPage"][0]{
  references[]{
    companyLogo,
    companyName
  }
}
`;

type Reference = {
  companyLogo: any;
  companyName: string;
};

type ReferencesPageDoc = {
  references?: Reference[];
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

interface ReferencesSectionProps {
  showTitle?: boolean;
  className?: string;
}

export default async function ReferencesSection({ 
  showTitle = true, 
  className = "" 
}: ReferencesSectionProps) {
  const referencesData = await client.fetch<ReferencesPageDoc>(REFERENCES_QUERY, {}, options);

  return (
    <section className={`py-12 md:py-20 lg:py-24 bg-background ${className}`}>
      {showTitle && (
        <>
          {/* Referanslar Başlığı */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-foreground mb-6">
              Referanslarımız
            </h2>
            {/* Dekoratif çizgi */}
            <div className="flex justify-center">
              <div className="w-24 h-0.5 bg-primary"></div>
            </div>
          </div>
        </>
      )}
      
      {/* References Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {referencesData?.references && referencesData.references.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12 justify-items-center place-content-center">
              {referencesData.references.map((reference, index) => (
                <div key={`reference-${index}`} className="flex flex-col items-center group">
                  {/* Company Logo */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4 bg-white rounded-2xl p-4 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/[0.2] group-hover:scale-105 flex items-center justify-center">
                  {reference.companyLogo && (
                    <Image
                      src={urlFor(reference.companyLogo).width(400).url()}
                      alt={reference.companyName}
                      width={400}
                      height={400}
                      className="max-w-full max-h-full object-contain"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  )}
                </div>
                
                {/* Company Name */}
                <h3 className="text-sm md:text-base font-medium text-foreground text-center leading-tight">
                  {reference.companyName}
                </h3>
                  </div>
                ))}
            </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Henüz referans eklenmemiş.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
