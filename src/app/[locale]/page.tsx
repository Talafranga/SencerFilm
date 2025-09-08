import { Link } from "@/i18n/routing";
import { client } from "@/sanity/client";
import AboutSection from "@/components/AboutSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import { setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import { getLocalizedString, getLocalizedText, type LocaleString, type LocaleText } from "@/lib/sanity-locale";

// GROQ: fetch the singleton homePage with video file
const HOMEPAGE_QUERY = /* groq */ `
*[_type == "homePage"][0]{
  anaBaslik,
  baslikAciklama,
  "videoFileUrl": videoFile.asset->url,
  videoMute
}
`;

// GROQ: fetch the latest 3 projects
const LATEST_PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc)[0...3] {
  _id,
  name,
  description,
  "imageUrl": image.asset->url,
  "slug": slug.current,
  category
}`;

type HomePageDoc = {
  anaBaslik?: LocaleString;
  baslikAciklama?: LocaleText;
  videoFileUrl?: string;
  videoMute?: boolean;
};

type Project = {
  _id: string;
  name: LocaleString;
  description: LocaleText;
  imageUrl?: string;
  slug: string;
  category: "belgesel" | "tv" | "youtube" | "website";
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('common');

  const [homeData, latestProjects] = await Promise.all([
    client.fetch<HomePageDoc>(HOMEPAGE_QUERY, {}, options),
    client.fetch<Project[]>(LATEST_PROJECTS_QUERY, {}, options)
  ]);

  const currentLocale = await getLocale() as 'tr' | 'en';
  const videoUrl = homeData?.videoFileUrl;
  const title = getLocalizedString(homeData?.anaBaslik, currentLocale);
  const description = getLocalizedText(homeData?.baslikAciklama, currentLocale);

  return (
    <>
      {/* Hero Section with Video Background */}
      <main className="relative min-h-[100dvh] overflow-hidden">
        {/* Full-screen background video */}
        {videoUrl && (
          <video
            autoPlay
            loop
            muted={homeData?.videoMute ?? true}
            playsInline
            className="pointer-events-none absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            {t('hero.videoAlt')}
          </video>
        )}

        {/* A subtle dark overlay to improve text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Left to right gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Left-aligned overlay text */}
        <section className="relative z-10 flex min-h-[100dvh] items-center px-6 lg:px-12">
          <div className="max-w-4xl flex items-start">
            {/* Vertical line */}
            <div className="w-1 bg-[var(--foreground,white)] mr-6 lg:mr-8 self-stretch min-h-[120px] md:min-h-[150px] lg:min-h-[180px]"></div>
            
            {/* Text content */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-[var(--foreground,white)]">
                {title || "Ana Başlık"}
              </h1>
              {description && (
                <p className="mt-4 text-base md:text-lg lg:text-xl font-poppins font-extralight text-[var(--foreground,white)]/90 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* About Section */}
      <AboutSection showTitle={true} />

      {/* Latest Projects Section */}
      {latestProjects && latestProjects.length > 0 && (
        <section className="min-h-screen px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Projelerimiz Başlığı */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-foreground mb-6">
                {t('projects.title')}
              </h2>
              {/* Dekoratif çizgi */}
              <div className="flex justify-center">
                <div className="w-24 h-0.5 bg-primary"></div>
              </div>
            </div>
            <ProjectsGrid projects={latestProjects} hideFilters={true} />
            
            {/* View All Projects Button */}
            <div className="flex justify-center mt-12">
              <Link
                href="/projeler"
                className="relative px-8 py-4 bg-white text-black hover:bg-black hover:text-white font-semibold rounded-full border border-white hover:border-blue-500/[0.3] transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-blue-500/[0.3] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-blue-500/[0.1] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
              >
                {t('projects.viewAll')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
