import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import { getLocalizedString, getLocalizedText, getLocalizedBlockContent, type LocaleString, type LocaleText, type LocaleBlockContent } from "@/lib/sanity-locale";
import PortableTextRenderer from "@/components/PortableTextRenderer";

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  name,
  description,
  "imageUrl": image.asset->url
}`;

type Project = {
  _id: string;
  name: LocaleString;
  description: LocaleBlockContent | LocaleText; // Hem eski hem yeni format için uyumluluk
  imageUrl?: string;
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('common');

  const project: Project = await client.fetch(PROJECT_QUERY, { slug });

  if (!project) {
    notFound();
  }

  const currentLocale = await getLocale() as 'tr' | 'en';
  const projectName = getLocalizedString(project.name, currentLocale);
  
  // Eski format kontrolü: Eğer description string ise eski format
  const isOldFormat = typeof project.description === 'object' && 
    project.description && 
    (typeof project.description.tr === 'string' || typeof project.description.en === 'string');
  
  let projectDescriptionBlocks: any[] = [];
  let projectDescriptionText = '';
  
  if (isOldFormat) {
    // Eski format: LocaleText (string)
    projectDescriptionText = getLocalizedText(project.description as LocaleText, currentLocale);
  } else {
    // Yeni format: LocaleBlockContent (PortableText)
    projectDescriptionBlocks = getLocalizedBlockContent(project.description as LocaleBlockContent, currentLocale);
  }

  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/projeler"
          className="inline-flex items-center text-[hsl(var(--foreground))] hover:opacity-80 transition-opacity"
        >
          {t('projects.backToProjects')}
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(var(--foreground))]">{projectName}</h1>

      {project.imageUrl && (
        <div className="mb-8">
          <Image
            src={project.imageUrl}
            alt={projectName}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      )}

      {/* Eski format için: basit metin */}
      {isOldFormat && projectDescriptionText && (
        <div className="mb-8">
          <p className="text-lg leading-8 text-[hsl(var(--foreground))] text-justify whitespace-pre-line">
            {projectDescriptionText}
          </p>
        </div>
      )}
      
      {/* Yeni format için: PortableText */}
      {!isOldFormat && projectDescriptionBlocks && projectDescriptionBlocks.length > 0 && (
        <div className="mb-8">
          <PortableTextRenderer value={projectDescriptionBlocks} />
        </div>
      )}
    </main>
  );
}
