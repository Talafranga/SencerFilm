"use client";

import { PortableText } from '@portabletext/react';

// PortableText özelleştirme bileşenleri
const components = {
  block: {
    // Normal paragraf
    normal: ({ children }: any) => (
      <p className="mb-4 text-lg leading-8 text-[hsl(var(--foreground))] text-justify">
        {children}
      </p>
    ),
    // Başlık seviyeleri
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mb-6 text-[hsl(var(--foreground))]">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mb-5 text-[hsl(var(--foreground))]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--foreground))]">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold mb-3 text-[hsl(var(--foreground))]">
        {children}
      </h4>
    ),
    // Alıntı
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-[hsl(var(--foreground))] opacity-90">
        {children}
      </blockquote>
    ),
  },
  // Metin stilleri
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }: any) => (
      <span className="underline">{children}</span>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    // Link
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  // Liste türleri
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 text-[hsl(var(--foreground))]">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 text-[hsl(var(--foreground))]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="mb-2 leading-relaxed">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="mb-2 leading-relaxed">{children}</li>
    ),
  },
};

interface PortableTextRendererProps {
  value: any[];
  className?: string;
}

export default function PortableTextRenderer({ 
  value, 
  className = "" 
}: PortableTextRendererProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
