import { client } from "@/sanity/client";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";

// GROQ: fetch the singleton aboutPage with content items
const ABOUTPAGE_QUERY = /* groq */ `
*[_type == "aboutPage"][0]{
  content[]{
    badge,
    title,
    image,
    description
  }
}
`;

type ContentItem = {
  badge: string;
  title: string;
  image: any;
  description: any[];
};

type AboutPageDoc = {
  content?: ContentItem[];
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

interface AboutSectionProps {
  showTitle?: boolean;
  className?: string;
}

export default async function AboutSection({ 
  showTitle = true, 
  className = "" 
}: AboutSectionProps) {
  const aboutData = await client.fetch<AboutPageDoc>(ABOUTPAGE_QUERY, {}, options);

  return (
    <section className={`py-12 md:py-20 lg:py-24 bg-background ${className}`}>
      {showTitle && (
        <>
          {/* Hakkımızda Başlığı */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-foreground mb-6">
              Hakkımızda
            </h2>
            {/* Dekoratif çizgi */}
            <div className="flex justify-center">
              <div className="w-24 h-0.5 bg-primary"></div>
            </div>
          </div>
        </>
      )}
      
      <TracingBeam className="px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto antialiased pt-8 md:pt-12 relative">
          {aboutData?.content?.map((item, index) => (
            <div key={`content-${index}`} className="mb-12 md:mb-16">
              <h2 className="bg-primary text-primary-foreground rounded-full text-sm w-fit px-4 py-1 mb-4">
                {item.badge}
              </h2>

              <p className="text-2xl md:text-3xl mb-6 font-bold text-foreground">
                {item.title}
              </p>

              <div className="prose prose-lg max-w-none">
                {item?.image && (
                  <img
                    src={urlFor(item.image).width(1000).height(1000).url()}
                    alt="project thumbnail"
                    height="1000"
                    width="1000"
                    className="rounded-lg mb-6 md:mb-10 object-cover w-full h-auto"
                  />
                )}
                <div className="text-lg leading-8 text-muted-foreground text-justify">
                  <PortableText value={item.description} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
}
