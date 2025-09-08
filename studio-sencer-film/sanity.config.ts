// studio-sencer-film/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'   // (güncel araç)
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Tekil sayfa türleri (singleton)
const SINGLETON_TYPES = new Set(['homePage','aboutPage','projectsPage','contactPage','referencesPage','footer','siteSettings'])
// Tekillere izin verilecek aksiyonlar
const SINGLETON_ACTIONS = new Set(['publish','discardChanges'])

export default defineConfig({
  name: 'default',
  title: 'Sencer Film',

  projectId: '9l1n2im5',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: { types: schemaTypes },

  document: {
    // "New document" menüsünden singleton şablonlarını global bağlamda kaldır
    newDocumentOptions: (prev, { creationContext }) => {
      // creationContext.type === 'global' → sol üstteki "New document" menüsü
      if (creationContext.type === 'global') {
        return prev.filter(tpl => !SINGLETON_TYPES.has(tpl.templateId))
      }
      return prev
    },

    // Singletonlarda yalnızca belirli aksiyonları bırak (publish/discardChanges)
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(a => a.action && SINGLETON_ACTIONS.has(a.action))
      }
      return prev
    },
  },
})
