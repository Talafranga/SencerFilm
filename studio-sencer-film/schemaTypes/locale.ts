import { defineType, defineField } from 'sanity'

// Desteklenen diller
export const supportedLanguages = [
  { id: 'tr', title: 'Türkçe', isDefault: true },
  { id: 'en', title: 'English', isDefault: false },
]

// Çoklu dil metin alanı
export const localeString = defineType({
  name: 'localeString',
  title: 'Çoklu Dil Metin',
  type: 'object',
  fields: supportedLanguages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'string',
      validation: lang.isDefault ? (rule) => rule.required() : undefined,
    })
  ),
  preview: {
    select: {
      tr: 'tr',
      en: 'en',
    },
    prepare({ tr, en }) {
      return {
        title: tr || en || 'Metin girilmemiş',
        subtitle: tr && en ? 'TR + EN' : tr ? 'Sadece TR' : en ? 'Sadece EN' : 'Boş',
      }
    },
  },
})

// Çoklu dil uzun metin alanı
export const localeText = defineType({
  name: 'localeText',
  title: 'Çoklu Dil Uzun Metin',
  type: 'object',
  fields: supportedLanguages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'text',
      validation: lang.isDefault ? (rule) => rule.required() : undefined,
    })
  ),
  preview: {
    select: {
      tr: 'tr',
      en: 'en',
    },
    prepare({ tr, en }) {
      return {
        title: (tr || en || 'Metin girilmemiş').slice(0, 50) + '...',
        subtitle: tr && en ? 'TR + EN' : tr ? 'Sadece TR' : en ? 'Sadece EN' : 'Boş',
      }
    },
  },
})

// Çoklu dil block içerik (PortableText için)
export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Çoklu Dil İçerik',
  type: 'object',
  fields: supportedLanguages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'array',
      of: [{ type: 'block' }],
      validation: lang.isDefault ? (rule) => rule.required() : undefined,
    })
  ),
  preview: {
    select: {
      tr: 'tr',
      en: 'en',
    },
    prepare({ tr, en }) {
      return {
        title: 'Çoklu dil içerik',
        subtitle: tr && en ? 'TR + EN' : tr ? 'Sadece TR' : en ? 'Sadece EN' : 'Boş',
      }
    },
  },
})
