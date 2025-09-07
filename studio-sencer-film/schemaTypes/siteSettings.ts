import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', type: 'string', validation: r => r.required() }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string' }),
          defineField({ name: 'href', type: 'string' }),
        ]
      }]
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      fields: [
        defineField({ name: 'titleTemplate', type: 'string' }),
        defineField({ name: 'description', type: 'text' }),
        defineField({ name: 'ogImage', type: 'image' }),
      ]
    }),
  ],
})
