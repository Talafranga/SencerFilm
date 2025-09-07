import {defineType, defineField} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Ana Sayfa',
  type: 'document',
  fields: [
    defineField({
      name: 'anaBaslik',
      title: 'Ana Başlık',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'baslikAciklama',
      title: 'Başlık Açıklama',
      type: 'text',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'videoMute',
      title: 'Video Sessiz olsun',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
