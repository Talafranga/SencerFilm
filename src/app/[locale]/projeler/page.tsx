// src/app/[locale]/projeler/page.tsx
import React from "react";
import { client } from "@/sanity/client";
import ProjectsGrid from "@/components/ProjectsGrid";
import { setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import { type LocaleString, type LocaleText } from "@/lib/sanity-locale";

const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  name,
  description,
  "imageUrl": image.asset->url,
  "slug": slug.current,
  category
}`;

type Project = {
  _id: string;
  name: LocaleString;
  description: LocaleText;
  imageUrl?: string;
  slug: string;
  category: "belgesel" | "tv" | "youtube" | "website";
};

export const revalidate = 30;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const projects: Project[] = await client.fetch(PROJECTS_QUERY);

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}
