import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Ensure that the incoming locale is valid
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'tr';
  }

  // Import messages and wrap them in a namespace
  const messages = await import(`../messages/${locale}/common.json`);

  return {
    locale,
    messages: {
      common: messages.default || messages
    }
  };
});
