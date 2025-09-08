export const locales = ['tr', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'tr';

// Dil ayarları
export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English'
};

// SEO için dil meta bilgileri
export const localeMetadata: Record<Locale, { lang: string; dir: 'ltr' | 'rtl' }> = {
  tr: { lang: 'tr-TR', dir: 'ltr' },
  en: { lang: 'en-US', dir: 'ltr' }
};
