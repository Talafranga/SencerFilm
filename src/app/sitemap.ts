import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sencerfilm.com';
  
  // Sayfa rotaları
  const routes = [
    '',                    // Ana sayfa
    '/projeler',          // Projeler
    '/hakkimizda',        // Hakkımızda
    '/referanslar',       // Referanslar
    '/iletisim',          // İletişim
  ];

  // Her rota için tüm dillerde URL'ler oluştur
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach(route => {
    // Her dil için alternatif bağlantılar
    const alternates: Record<string, string> = {};
    locales.forEach(locale => {
      alternates[locale] = `${baseUrl}/${locale}${route}`;
    });

    // Her dil için sitemap girişi
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: alternates
        }
      });
    });
  });

  return sitemapEntries;
}
