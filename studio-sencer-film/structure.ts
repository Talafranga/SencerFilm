import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Home Page')
        .id('homePageSingleton')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem().title('About Page')
        .id('aboutPageSingleton')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem().title('Contact Page')
        .id('contactPageSingleton')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.listItem().title('References Page')
        .id('referencesPageSingleton')
        .child(S.document().schemaType('referencesPage').documentId('referencesPage')),
      S.listItem().title('Footer')
        .id('footerSingleton')
        .child(S.document().schemaType('footer').documentId('footer')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
    ])
