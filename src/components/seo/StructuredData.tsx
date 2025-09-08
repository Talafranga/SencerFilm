import { type Locale } from '@/i18n/config';

interface OrganizationSchema {
  locale: Locale;
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialMediaUrls?: string[];
}

interface ProjectSchema {
  locale: Locale;
  name: string;
  description?: string;
  image?: string;
  url: string;
  category: string;
}

interface WebsiteSchema {
  locale: Locale;
  name: string;
  description: string;
  url: string;
}

export function OrganizationStructuredData({
  locale,
  name = "Sencer Film",
  description,
  url = "https://sencerfilm.com",
  logo = "https://sencerfilm.com/sencer-logo.png",
  address,
  phone,
  email,
  socialMediaUrls = []
}: OrganizationSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    "name": name,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo,
      "width": 120,
      "height": 40
    },
    "description": description,
    "address": address ? {
      "@type": "PostalAddress",
      "addressLocality": "İstanbul",
      "addressCountry": "TR",
      "streetAddress": address
    } : undefined,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": phone,
      "email": email,
      "contactType": "customer service",
      "availableLanguage": ["Turkish", "English"]
    },
    "sameAs": socialMediaUrls,
    "founder": {
      "@type": "Person",
      "name": "Sencer"
    },
    "knowsAbout": [
      "Film Production",
      "Video Production", 
      "Documentary Production",
      "TV Program Production",
      "YouTube Channel Management",
      "Web Development"
    ],
    "serviceType": [
      "Film Production Services",
      "Video Production Services",
      "Documentary Production",
      "Television Production"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schema, null, 2) 
      }}
    />
  );
}

export function WebsiteStructuredData({
  locale,
  name,
  description,
  url
}: WebsiteSchema) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    "name": name,
    "description": description,
    "url": url,
    "inLanguage": locale === 'tr' ? 'tr-TR' : 'en-US',
    "publisher": {
      "@id": `${url}#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/${locale}/projeler?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schema, null, 2) 
      }}
    />
  );
}

export function ProjectStructuredData({
  locale,
  name,
  description,
  image,
  url,
  category
}: ProjectSchema) {
  const getCreativeWorkType = (category: string) => {
    switch (category) {
      case 'belgesel': return 'Documentary';
      case 'tv': return 'TVSeries';
      case 'youtube': return 'VideoObject';
      case 'website': return 'WebSite';
      default: return 'CreativeWork';
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": getCreativeWorkType(category),
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    "inLanguage": locale === 'tr' ? 'tr-TR' : 'en-US',
    "creator": {
      "@id": `https://sencerfilm.com#organization`
    },
    "producer": {
      "@id": `https://sencerfilm.com#organization`
    },
    "genre": category === 'belgesel' ? 'Documentary' : 
            category === 'tv' ? 'Television' :
            category === 'youtube' ? 'Online Video' : 'Web Content'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schema, null, 2) 
      }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
  baseUrl = "https://sencerfilm.com"
}: {
  items: Array<{ name: string; url: string }>;
  baseUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schema, null, 2) 
      }}
    />
  );
}
