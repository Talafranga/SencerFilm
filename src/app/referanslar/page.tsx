import type { Metadata } from "next";
import ReferencesSection from "@/components/ReferencesSection";

export const metadata: Metadata = {
  title: "Referanslarımız - Sencer Film",
  description: "Sencer Film referansları ve iş ortaklarımız",
};

export default function ReferanslarPage() {
  return (
    <main className="min-h-screen">
      <ReferencesSection showTitle={true} />
    </main>
  );
}