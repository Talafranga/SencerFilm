"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { getLocalizedString, getLocalizedText, type LocaleString, type LocaleText } from "@/lib/sanity-locale";

type Project = {
  _id: string;
  name: LocaleString;
  description: LocaleText;
  imageUrl?: string;
  slug: string;
  category: "belgesel" | "tv" | "youtube" | "website";
};


function truncateWords(input = "", words = 24) {
  const parts = input.trim().split(/\s+/);
  if (parts.length <= words) return input;
  return parts.slice(0, words).join(" ") + "…";
}


export default function ProjectsGrid({ 
  projects, 
  hideFilters = false 
}: { 
  projects: Project[];
  hideFilters?: boolean;
}) {
  const t = useTranslations('common');
  const locale = useLocale() as 'tr' | 'en';
  const [active, setActive] = useState<"all" | "belgesel" | "tv" | "youtube" | "website">("belgesel");
  
  const TABS = [
    { label: t('projects.filters.documentary'), value: "belgesel" as const },
    { label: t('projects.filters.tv'), value: "tv" as const },
    { label: t('projects.filters.youtube'), value: "youtube" as const },
    { label: t('projects.filters.website'), value: "website" as const },
    { label: t('projects.filters.all'), value: "all" as const },
  ];

  const filtered = useMemo(() => {
    if (hideFilters || active === "all") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active, hideFilters]);

  return (
    <>
      {/* Tabs */}
      {!hideFilters && (
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {TABS.map((t) => {
            const isActive = active === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setActive(t.value)}
                className={[
                  "px-6 py-3 rounded-full text-base font-medium border transition",
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/80 border-white/30 hover:border-white/60",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-3 md:space-y-0">
        {filtered.map((project) => {
          const projectName = getLocalizedString(project.name, locale);
          const projectDescription = getLocalizedText(project.description, locale);
          
          return (
            <Link key={project._id} href={`/projeler/${project.slug}`} className="block md:block">
              <CardContainer className="inter-var md:block hidden">
                <CardBody className="bg-[#0a0a0a] relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.3] dark:hover:shadow-emerald-500/[0.2] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border-[#262626] hover:border-blue-500/[0.3] w-auto h-[28rem] rounded-2xl p-6 border flex flex-col transition-all duration-300 ease-out hover:bg-gradient-to-br hover:from-[#0f0f0f] hover:to-[#1f1f1f] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-blue-500/[0.05] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
                  {/* Başlık */}
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-[hsl(var(--foreground))] leading-tight min-h-[2.5rem]"
                  >
                    {projectName}
                  </CardItem>

                  {/* Açıklama */}
                  {projectDescription && (
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-sm max-w-sm mt-4 text-[hsl(var(--foreground))] leading-relaxed min-h-[4.5rem] overflow-hidden"
                    >
                      {truncateWords(projectDescription, 24)}
                    </CardItem>
                  )}

                {/* Görsel (alta sabit) */}
                {project.imageUrl && (
                  <CardItem translateZ="100" className="w-full mt-auto pt-4">
                    <div className="rounded-2xl overflow-hidden relative group-hover/card:shadow-xl transition-all duration-300">
                      {/* Görsel üzerine ışık efekti */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-500/[0.1] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10 rounded-2xl"></div>
                      <Image
                        src={project.imageUrl}
                        alt={projectName}
                        width={1000}
                        height={600}
                        className="h-60 w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
                      />
                    </div>
                  </CardItem>
                )}
              </CardBody>
            </CardContainer>
            
            {/* Mobile version - Simple card without 3D effects */}
            <div className="md:hidden bg-[#0a0a0a] relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border-[#262626] w-auto h-[28rem] rounded-2xl p-6 border flex flex-col">
              {/* Başlık */}
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))] leading-tight min-h-[2.5rem]">
                {projectName}
              </h3>

              {/* Açıklama */}
              {projectDescription && (
                <p className="text-sm max-w-sm mt-2 text-[hsl(var(--foreground))] leading-relaxed min-h-[4.5rem] overflow-hidden">
                  {truncateWords(projectDescription, 24)}
                </p>
              )}

              {/* Görsel (alta sabit) */}
              {project.imageUrl && (
                <div className="w-full mt-auto pt-4">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={projectName}
                      width={1000}
                      height={600}
                      className="h-60 w-full object-cover"
                      sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
        })}
      </div>
    </>
  );
}
