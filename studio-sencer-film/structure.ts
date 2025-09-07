import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Home Page')
        .id('homePageSingleton')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem().title('Contact Page')
        .id('contactPageSingleton')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ])
