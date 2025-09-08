import type { Metadata } from "next";
import ReferencesSection from "@/components/ReferencesSection";
import { setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: "Referanslarımız - Sencer Film",
  description: "Sencer Film referansları ve iş ortaklarımız",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ReferanslarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main className="min-h-screen">
      <ReferencesSection showTitle={true} />
    </main>
  );
}
