import {defineType, defineField, defineArrayMember} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Hakkımızda Sayfası',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contentItem',
          title: 'İçerik Öğesi',
          fields: [
            defineField({
              name: 'badge',
              title: 'Etiket',
              type: 'string',
              validation: (r) => r.required().error('Etiket alanı zorunludur'),
            }),
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: (r) => r.required().error('Başlık alanı zorunludur'),
            }),
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'description',
              title: 'Açıklama',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                  ],
                  lists: [],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                    ],
                    annotations: [],
                  },
                }),
              ],
              validation: (r) => r.required().min(1).error('Açıklama alanı zorunludur'),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              badge: 'badge',
              media: 'image',
            },
            prepare({title, badge, media}) {
              return {
                title: title || 'Başlıksız',
                subtitle: badge || 'Rozetka yok',
                media,
              }
            },
          },
        }),
      ],
      validation: (r) => r.required().length(3).error('Tam 3 içerik öğesi olmalıdır'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Hakkımızda Sayfası',
      }
    },
  },
})
