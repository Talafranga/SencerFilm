import {defineType, defineField} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'İletişim Sayfası',
  type: 'document',
  fields: [
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
          type: 'text',
          validation: (r) => r.required().error('Adres zorunludur'),
        }),
      ],
      validation: (r) => r.required().error('İletişim bilgileri zorunludur'),
    }),

    // Google Maps
    defineField({
      name: 'locationMap',
      title: 'Konum ve Harita',
      type: 'object',
      fields: [
        defineField({
          name: 'mapEmbedCode',
          title: 'Google Maps Embed Code',
          type: 'text',
          description: 'Google Maps\'ten aldığınız iframe embed kodunu buraya yapıştırın',
          validation: (r) => r.required().error('Google Maps embed kodu zorunludur'),
        }),
        defineField({
          name: 'mapShareUrl',
          title: 'Google Maps Share URL',
          type: 'url',
          description: 'Google Maps share URL\'i (örn: https://maps.app.goo.gl/...)',
          validation: (r) => r.required().error('Google Maps share URL\'i zorunludur'),
        }),
      ],
      validation: (r) => r.required().error('Konum bilgileri zorunludur'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'İletişim Sayfası',
      }
    },
  },
})
