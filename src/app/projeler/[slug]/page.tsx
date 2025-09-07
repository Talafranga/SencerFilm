import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  name,
  description,
  "imageUrl": image.asset->url
}`;

type Project = {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project: Project = await client.fetch(PROJECT_QUERY, { slug: params.slug });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/projeler"
          className="inline-flex items-center text-[hsl(var(--foreground))] hover:opacity-80 transition-opacity"
        >
          ← Projelere Geri Dön
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(var(--foreground))]">{project.name}</h1>

      {project.imageUrl && (
        <div className="mb-8">
          <Image
            src={project.imageUrl}
            alt={project.name}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      )}

      {project.description && (
        <div className="mb-8">
          <p className="text-lg leading-8 text-[hsl(var(--foreground))]">
            {project.description}
          </p>
        </div>
      )}
    </main>
  );
}
