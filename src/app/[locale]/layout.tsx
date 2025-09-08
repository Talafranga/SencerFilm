import type { Metadata } from "next";
import { Barlow, Poppins } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { locales, type Locale, localeMetadata } from '@/i18n/config';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import "../globals.css";

const barlow = Barlow({
  weight: "500",
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const poppins = Poppins({
  weight: "200",
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  
  // Site URL'ini belirle
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sencerfilm.com';
  
  // Alternatif dil bağlantıları
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${baseUrl}/${loc}`;
  }

  return {
    title: "Sencer Film",
    description: "Sencer Film projesi",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${currentLocale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;
  
  // Geçerli bir locale mı kontrol et
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;
  
  // Enable static rendering
  setRequestLocale(currentLocale);

  // Mesajları yükle
  const messages = await getMessages();

  // Dil metadata bilgilerini al
  const { lang, dir } = localeMetadata[currentLocale];

  return (
    <html lang={lang} dir={dir}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/sencer-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#222222" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sencer Film" />
      </head>
      <body className={`${barlow.variable} ${poppins.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={currentLocale}>
          <ErrorBoundary>
            <Navbar />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
