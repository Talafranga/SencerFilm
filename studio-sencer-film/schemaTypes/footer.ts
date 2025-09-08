import {defineType, defineField, defineArrayMember} from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    // Ana Başlık ve Açıklama
    defineField({
      name: 'companyTitle',
      title: 'Şirket Başlığı',
      type: 'string',
      validation: (r) => r.required().error('Şirket başlığı zorunludur'),
    }),
    defineField({
      name: 'companyDescription',
      title: 'Şirket Açıklaması',
      type: 'text',
      validation: (r) => r.required().error('Şirket açıklaması zorunludur'),
    }),

    // Sosyal Medya Linkleri
    defineField({
      name: 'socialLinks',
      title: 'Sosyal Medya Linkleri',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Sosyal Medya Linki',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'X', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                ],
              },
              validation: (r) => r.required().error('Platform seçimi zorunludur'),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required().error('URL zorunludur'),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),

    // İletişim Bilgileri
    defineField({
      name: 'contactInfo',
      title: 'İletişim Bilgileri',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'E-posta',
          type: 'string',
          validation: (r) => r.required().email().error('Geçerli bir e-posta adresi giriniz'),
        }),
        defineField({
          name: 'phone',
          title: 'Telefon',
          type: 'string',
          validation: (r) => r.required().error('Telefon numarası zorunludur'),
        }),
        defineField({
          name: 'address',
          title: 'Adres',
          type: 'string',
          validation: (r) => r.required().error('Adres zorunludur'),
        }),
      ],
    }),

    // Copyright
    defineField({
      name: 'copyrightText',
      title: 'Copyright Metni',
      type: 'string',
      description: 'Yıl otomatik olarak eklenir',
      validation: (r) => r.required().error('Copyright metni zorunludur'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer Ayarları',
      }
    },
  },
})
