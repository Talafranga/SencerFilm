// src/app/projeler/page.tsx
import React from "react";
import { client } from "@/sanity/client";
import ProjectsGrid from "@/components/ProjectsGrid";

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
  name: string;
  description: string;
  imageUrl?: string;
  slug: string;
  category: "belgesel" | "tv" | "youtube" | "website";
};

export const revalidate = 30;

export default async function ProjectsPage() {
  const projects: Project[] = await client.fetch(PROJECTS_QUERY);

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Projeler</h1>
        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}
