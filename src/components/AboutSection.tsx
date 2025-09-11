import { client } from "@/sanity/client";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import { getLocalizedString, getLocalizedBlockContent, type LocaleString, type LocaleBlockContent } from "@/lib/sanity-locale";
import { getLocale } from 'next-intl/server';

// GROQ: fetch the singleton aboutPage with content items
const ABOUTPAGE_QUERY = /* groq */ `
*[_type == "aboutPage"][0]{
  content[]{
    badge,
    title,
    image{
      ...,
      asset->{
        ...,
        mimeType
      }
    },
    description,
    links[]{
      title,
      url,
      openInNewTab
    }
  }
}
`;

type LinkItem = {
  title: LocaleString;
  url: string;
  openInNewTab?: boolean;
};

type ContentItem = {
  badge: LocaleString;
  title: LocaleString;
  image: {
    asset: {
      mimeType: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  description: LocaleBlockContent;
  links?: LinkItem[];
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
  className = "" 
}: AboutSectionProps) {
  const aboutData = await client.fetch<AboutPageDoc>(ABOUTPAGE_QUERY, {}, options);
  const locale = await getLocale() as 'tr' | 'en';

  return (
    <section className={`py-12 md:py-20 lg:py-24 bg-background ${className}`}>
      <TracingBeam className="px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto antialiased pt-8 md:pt-12 relative">
          {aboutData?.content?.map((item, index) => {
            const badge = getLocalizedString(item.badge, locale);
            const title = getLocalizedString(item.title, locale);
            const description = getLocalizedBlockContent(item.description, locale);
            
            return (
              <div key={`content-${index}`} className="mb-12 md:mb-16">
                <h2 className="bg-primary text-primary-foreground rounded-full text-sm w-fit px-4 py-1 mb-4">
                  {badge}
                </h2>

                <p className="text-2xl md:text-3xl mb-6 font-bold text-foreground">
                  {title}
                </p>

                <div className="prose prose-lg max-w-none">
                  {item?.image && (
                    <div className={`relative w-full aspect-video mb-6 md:mb-10 rounded-lg overflow-hidden ${
                      item.image?.asset?.mimeType === 'image/png' ? 'bg-white' : 'bg-gray-50'
                    }`}>
                      <img
                        src={urlFor(item.image).width(800).url()}
                        alt={title || "About image"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="text-lg leading-8 text-muted-foreground text-justify">
                    <PortableText value={description} />
                  </div>
                  
                  {/* Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {item.links.map((link, linkIndex) => {
                        const linkTitle = getLocalizedString(link.title, locale);
                        return (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target={link.openInNewTab ? "_blank" : "_self"}
                            rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            {linkTitle}
                            {link.openInNewTab && (
                              <svg
                                className="ml-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TracingBeam>
    </section>
  );
}
