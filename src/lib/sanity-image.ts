import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

// Sanity image URL builder'ı oluştur
const builder = imageUrlBuilder(client);

// urlFor fonksiyonu - Sanity image referansını URL'ye çevir
export function urlFor(source: any) {
  return builder.image(source);
}
