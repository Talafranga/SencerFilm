// Sanity'den gelen çoklu dil verilerini işlemek için yardımcı fonksiyonlar

export type LocaleString = {
  tr?: string;
  en?: string;
}

export type LocaleText = {
  tr?: string;
  en?: string;
}

export type LocaleBlockContent = {
  tr?: any[];
  en?: any[];
}

// Locale'a göre string değeri döndür
export function getLocalizedString(
  localeString: LocaleString | string | undefined | null, 
  locale: 'tr' | 'en' = 'tr'
): string {
  if (!localeString) return '';
  
  // Eğer string ise (eski veri için uyumluluk)
  if (typeof localeString === 'string') {
    return localeString;
  }
  
  // Çoklu dil desteği
  return localeString[locale] || localeString.tr || localeString.en || '';
}

// Locale'a göre text değeri döndür  
export function getLocalizedText(
  localeText: LocaleText | string | undefined | null,
  locale: 'tr' | 'en' = 'tr'
): string {
  if (!localeText) return '';
  
  // Eğer string ise (eski veri için uyumluluk)
  if (typeof localeText === 'string') {
    return localeText;
  }
  
  // Çoklu dil desteği
  return localeText[locale] || localeText.tr || localeText.en || '';
}

// Locale'a göre block content döndür
export function getLocalizedBlockContent(
  localeBlockContent: LocaleBlockContent | any[] | undefined | null,
  locale: 'tr' | 'en' = 'tr'
): any[] {
  if (!localeBlockContent) return [];
  
  // Eğer doğrudan array ise (eski veri için uyumluluk)
  if (Array.isArray(localeBlockContent)) {
    return localeBlockContent;
  }
  
  // Çoklu dil desteği
  return localeBlockContent[locale] || localeBlockContent.tr || localeBlockContent.en || [];
}
