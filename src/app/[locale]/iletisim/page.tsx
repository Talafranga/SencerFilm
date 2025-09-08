import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: "İletişim - Sencer Film",
  description: "Sencer Film ile iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function İletişimPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main className="min-h-screen">
      <ContactSection showTitle={true} />
    </main>
  );
}
