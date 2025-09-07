import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { getYouTubeId, buildYouTubeEmbedSrc } from "@/lib/youtube"; 
export const metadata: Metadata = {
  title: "Sencer Film",
  description: "Sencer Film projesi",
};

// GROQ: fetch the singleton homePage; if you enforce fixed id "homePage", you can add && _id == "homePage"
const HOMEPAGE_QUERY = /* groq */ `
*[_type == "homePage"][0]{
  anaBaslik,
  baslikAciklama,
  videoUrl,
  videoMute
}
`;

type HomePageDoc = {
  anaBaslik?: string;
  baslikAciklama?: string;
  videoUrl?: string;
  videoMute?: boolean;
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const data = await client.fetch<HomePageDoc>(HOMEPAGE_QUERY, {}, options);

  const youTubeId = getYouTubeId(data?.videoUrl ?? null);
  const src = youTubeId ? buildYouTubeEmbedSrc(youTubeId, data?.videoMute ?? true, 0) : null;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Full-screen background video */}
      {src && (
        <iframe
          title="bg-video"
          src={src}
          // merkeze sabitle
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          // COVER hesabı: 16:9 videoyu, viewport’u tamamen kaplayacak EN büyük boyuta büyüt:
          style={{
            width: 'max(100vw, 177.78vh)',   // 16:9 için 100vh * 16/9 = 177.78vh
            height: 'max(56.25vw, 100vh)',   // 16:9 için 100vw * 9/16 = 56.25vw
          }}
          allow="autoplay; fullscreen"
          frameBorder={0}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* A subtle dark overlay to improve text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Left-aligned overlay text */}
      <section className="relative z-10 flex min-h-[100dvh] items-center px-6 lg:px-12">
        <div className="max-w-4xl flex items-start">
          {/* Vertical line */}
          <div className="w-1 bg-[var(--foreground,white)] mr-6 lg:mr-8 self-stretch min-h-[120px] md:min-h-[150px] lg:min-h-[180px]"></div>
          
          {/* Text content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-[var(--foreground,white)]">
              {data?.anaBaslik ?? "Ana Başlık"}
            </h1>
            {data?.baslikAciklama && (
              <p className="mt-4 text-base md:text-lg lg:text-xl font-poppins font-extralight text-[var(--foreground,white)]/90 max-w-2xl">
                {data.baslikAciklama}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
