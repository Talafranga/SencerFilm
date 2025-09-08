import {homePage} from './homePage'
import {aboutPage} from './aboutPage'
import {contactPage} from './contactPage'
import {referencesPage} from './referencesPage'
import {footer} from './footer'
import {project} from './project'
import {localeString, localeText, localeBlockContent} from './locale'

export const schemaTypes = [
  // Çoklu dil tipleri
  localeString, 
  localeText, 
  localeBlockContent,
  // Sayfa tipleri
  homePage, 
  aboutPage, 
  contactPage, 
  referencesPage, 
  footer, 
  project
]
