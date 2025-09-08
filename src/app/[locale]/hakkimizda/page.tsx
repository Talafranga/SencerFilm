import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";
import { setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: "Hakkımızda - Sencer Film",
  description: "Sencer Film hakkında bilgiler",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HakkımızdaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main className="min-h-screen">
      <AboutSection showTitle={true} />
    </main>
  );
}
