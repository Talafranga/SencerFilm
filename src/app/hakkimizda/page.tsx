import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "Hakkımızda - Sencer Film",
  description: "Sencer Film hakkında bilgiler",
};

export default function HakkımızdaPage() {
  return (
    <main className="min-h-screen">
      <AboutSection showTitle={true} />
    </main>
  );
}