import {defineType, defineField, defineArrayMember} from 'sanity'

export const referencesPage = defineType({
  name: 'referencesPage',
  title: 'Referanslar Sayfası',
  type: 'document',
  fields: [
    defineField({
      name: 'references',
      title: 'Referanslar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'companyReference',
          title: 'Referans',
          fields: [
            defineField({
              name: 'companyLogo',
              title: 'Şirket Logosu',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (r) => r.required().error('Şirket logosu zorunludur'),
            }),
            defineField({
              name: 'companyName',
              title: 'Şirket İsmi',
              type: 'string',
              validation: (r) => r.required().error('Şirket ismi zorunludur'),
            }),
          ],
          preview: {
            select: {
              title: 'companyName',
              media: 'companyLogo',
            },
            prepare({title, media}) {
              return {
                title: title || 'İsimsiz Şirket',
                media,
              }
            },
          },
        }),
      ],
      validation: (r) => r.required().min(1).error('En az bir referans eklemelisiniz'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Referanslar Sayfası',
      }
    },
  },
})
