import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false // Disable automatic detection to prevent loops
});

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
