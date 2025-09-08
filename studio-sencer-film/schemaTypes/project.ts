import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Proje / Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Başlık / Title',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.tr', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori / Category',
      type: 'string',
      options: {
        list: [
          { title: 'Belgeseller / Documentaries', value: 'belgesel' },
          { title: 'TV Programları / TV Programs', value: 'tv' },
          { title: 'YouTube Kanalları / YouTube Channels', value: 'youtube' },
          { title: 'İnternet Siteleri / Websites', value: 'website' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama / Description',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Görsel / Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: 'name.tr',
      titleEn: 'name.en',
      subtitle: 'category',
      media: 'image',
    },
    prepare(sel) {
      const map: Record<string, string> = {
        belgesel: 'Belgeseller',
        tv: 'TV Programları',
        youtube: 'YouTube Kanalları',
        website: 'İnternet Siteleri',
      }
      return { 
        title: sel.title || sel.titleEn || 'Başlık girilmemiş',
        subtitle: map[sel.subtitle as string] ?? sel.subtitle,
        media: sel.media
      }
    },
  },
})
