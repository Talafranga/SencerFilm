import {defineType, defineField, defineArrayMember} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Hakkımızda Sayfası / About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'İçerik / Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contentItem',
          title: 'İçerik Öğesi / Content Item',
          fields: [
            defineField({
              name: 'badge',
              title: 'Etiket / Badge',
              type: 'localeString',
              validation: (r) => r.required().error('Etiket alanı zorunludur'),
            }),
            defineField({
              name: 'title',
              title: 'Başlık / Title',
              type: 'localeString',
              validation: (r) => r.required().error('Başlık alanı zorunludur'),
            }),
            defineField({
              name: 'image',
              title: 'Görsel / Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'description',
              title: 'Açıklama / Description',
              type: 'localeBlockContent',
              validation: (r) => r.required().error('Açıklama alanı zorunludur'),
            }),
          ],
          preview: {
            select: {
              title: 'title.tr',
              titleEn: 'title.en',
              badge: 'badge.tr',
              media: 'image',
            },
            prepare({title, titleEn, badge, media}) {
              return {
                title: title || titleEn || 'Başlıksız',
                subtitle: badge || 'Etiket yok',
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
