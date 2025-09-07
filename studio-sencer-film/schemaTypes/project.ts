import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Başlık',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Belgeseller', value: 'belgesel' },
          { title: 'TV Programları', value: 'tv' },
          { title: 'YouTube Kanalları', value: 'youtube' },
          { title: 'İnternet Siteleri', value: 'website' },
        ],
        layout: 'radio', // istersen 'dropdown'
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'image',
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: 'name',
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
      return { ...sel, subtitle: map[sel.subtitle as string] ?? sel.subtitle }
    },
  },
})
