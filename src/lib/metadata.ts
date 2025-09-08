import { type Metadata } from 'next';
import { type Locale } from '@/i18n/config';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sencerfilm.com';

interface EnhancedMetadataProps {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  pathname: string;
  type?: 'website' | 'article' | 'profile';
}

export function generateEnhancedMetadata({
  locale,
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  pathname,
  type = 'website'
}: EnhancedMetadataProps): Metadata {
  const canonicalUrl = `${baseUrl}/${locale}${pathname}`;
  const defaultImage = `${baseUrl}/og-image-${locale}.jpg`;
  const ogImage = image || defaultImage;

  // Default keywords for the site
  const defaultKeywords = [
    'film prodüksiyon',
    'video prodüksiyon', 
    'belgesel',
    'TV programı',
    'YouTube kanal',
    'web sitesi',
    'Sencer Film'
  ];

  const enhancedKeywords = locale === 'tr' 
    ? [...defaultKeywords, ...keywords]
    : [
        'film production',
        'video production',
        'documentary',
        'TV program',
        'YouTube channel', 
        'web development',
        'Sencer Film',
        ...keywords
      ];

  return {
    title,
    description,
    keywords: enhancedKeywords.join(', '),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'tr': `${baseUrl}/tr${pathname}`,
        'en': `${baseUrl}/en${pathname}`,
        'x-default': `${baseUrl}/tr${pathname}`
      }
    },
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
      siteName: 'Sencer Film',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg'
        },
        {
          url: `${baseUrl}/og-image-square-${locale}.jpg`,
          width: 1080,
          height: 1080,
          alt: title,
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@sencerfilm',
      creator: '@sencerfilm',
      title,
      description,
      images: [ogImage]
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        me: [`${baseUrl}`, 'mailto:info@sencerfilm.com']
      }
    },
    category: 'technology',
    classification: 'Film Production Company',
    creator: 'Sencer Film',
    publisher: 'Sencer Film',
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    }
  };
}

// Helper function for project pages
export function generateProjectMetadata({
  locale,
  projectName,
  description,
  image,
  category,
  slug
}: {
  locale: Locale;
  projectName: string;
  description?: string;
  image?: string;
  category: string;
  slug: string;
}): Metadata {
  const categoryTranslations = {
    belgesel: locale === 'tr' ? 'Belgesel' : 'Documentary',
    tv: locale === 'tr' ? 'TV Programı' : 'TV Program',
    youtube: locale === 'tr' ? 'YouTube Kanalı' : 'YouTube Channel',
    website: locale === 'tr' ? 'Web Sitesi' : 'Website'
  };

  const categoryName = categoryTranslations[category as keyof typeof categoryTranslations] || category;
  const title = `${projectName} - ${categoryName} | Sencer Film`;
  const desc = description || 
    (locale === 'tr' 
      ? `${categoryName} projesi. Sencer Film tarafından üretilmiştir.`
      : `${categoryName} project. Produced by Sencer Film.`
    );

  const keywords = locale === 'tr' 
    ? [projectName, categoryName, 'Sencer Film prodüksiyon']
    : [projectName, categoryName, 'Sencer Film production'];

  return generateEnhancedMetadata({
    locale,
    title,
    description: desc,
    keywords,
    image,
    pathname: `/projeler/${slug}`,
    type: 'article'
  });
}

// Helper for generating rich snippets data
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": locale === 'tr' ? 'tr-TR' : 'en-US',
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
