import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "İletişim - Sencer Film",
  description: "Sencer Film ile iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.",
};

export default function İletişimPage() {
  return (
    <main className="min-h-screen">
      <ContactSection showTitle={true} />
    </main>
  );
}