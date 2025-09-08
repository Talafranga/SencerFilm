import {defineType, defineField} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Ana Sayfa / Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'anaBaslik',
      title: 'Ana Başlık / Main Title',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'baslikAciklama',
      title: 'Başlık Açıklama / Title Description',
      type: 'localeText',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video Dosyası / Video File',
      type: 'file',
      description: 'Arka plan videosu için MP4 dosyası yükleyin / Upload MP4 file for background video',
      options: {
        accept: '.mp4,.mov,.avi,.webm',
      },
    }),
    defineField({
      name: 'videoMute',
      title: 'Video Sessiz olsun / Mute Video',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
