# Sencer Film Resmi Websitesi

Next.js 15, TypeScript ve Sanity CMS ile geliştirilmiş çok dilli kurumsal web sitesi.

## 🌍 i18n (Internationalization) Desteği

Bu proje `next-intl` kullanarak Türkçe (TR) ve İngilizce (EN) dil desteği sunmaktadır.

### Desteklenen Diller

- 🇹🇷 Türkçe (varsayılan) - `/tr`
- 🇬🇧 İngilizce - `/en`

### i18n Özellikleri

- ✅ Otomatik dil algılama (tarayıcı tercihine göre)
- ✅ URL tabanlı routing (`/tr/...`, `/en/...`)
- ✅ Dil değiştirici komponenti (path ve query parametreleri korunur)
- ✅ SEO optimizasyonu (hreflang ve alternates desteği)
- ✅ Dinamik sitemap (tüm diller için)
- ✅ Metin çıkarma ve tarama scriptleri

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── [locale]/          # Dil bazlı routing
│   │   ├── layout.tsx      # i18n provider ve metadata
│   │   ├── page.tsx        # Ana sayfa
│   │   ├── projeler/       # Projeler sayfası
│   │   ├── hakkimizda/     # Hakkımızda sayfası
│   │   ├── iletisim/       # İletişim sayfası
│   │   └── referanslar/    # Referanslar sayfası
│   └── sitemap.ts          # Çok dilli sitemap
├── components/
│   ├── LanguageSwitcher.tsx  # Dil değiştirici
│   └── ...                   # Diğer bileşenler
├── i18n/
│   ├── config.ts           # Dil yapılandırması
│   ├── routing.ts          # Navigation helper'ları
│   └── request.ts          # Server config
├── messages/
│   ├── tr/common.json      # Türkçe çeviriler
│   └── en/common.json      # İngilizce çeviriler
└── middleware.ts           # Locale algılama ve yönlendirme
```

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusu
npm start
```

## 🔧 i18n Scriptleri

### Metin Çıkarma (Extract)

Koddan hardcoded metinleri bulup çeviri dosyalarına ekler:

```bash
# Dry-run (sadece rapor, değişiklik yapmaz)
npm run i18n:extract:dry

# Apply (değişiklikleri uygular)
npm run i18n:extract
```

### Metin Tarama (Scan)

CI/CD için hardcoded metin kontrolü:

```bash
npm run i18n:scan
```

Eğer hardcoded metin bulunursa exit code 1 döner.

## 📝 Yeni Çeviri Ekleme

### 1. Mesaj Dosyalarına Ekle

```json
// messages/tr/common.json
{
  "myComponent": {
    "title": "Başlık",
    "description": "Açıklama"
  }
}

// messages/en/common.json
{
  "myComponent": {
    "title": "Title",
    "description": "Description"
  }
}
```

### 2. Server Component'te Kullanım

```tsx
import { getTranslations } from "next-intl/server";

export default async function MyComponent() {
  const t = await getTranslations("common");

  return (
    <div>
      <h1>{t("myComponent.title")}</h1>
      <p>{t("myComponent.description")}</p>
    </div>
  );
}
```

### 3. Client Component'te Kullanım

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function MyClientComponent() {
  const t = useTranslations("common");

  return <button>{t("myComponent.title")}</button>;
}
```

## 🔗 Navigation ve Link Kullanımı

i18n destekli Link kullanımı:

```tsx
import { Link } from '@/i18n/routing';

// Otomatik olarak aktif locale'i korur
<Link href="/projeler">Projeler</Link>

// Farklı bir locale'e geçiş
<Link href="/projeler" locale="en">Projects</Link>
```

## 🎯 SEO ve Metadata

Her sayfa için otomatik olarak:

- `hreflang` alternates oluşturulur
- Doğru `lang` attribute'u eklenir
- Sitemap'te tüm diller listelenir

## 📋 Yapılacaklar

- [ ] Tüm hardcoded metinleri çeviri dosyalarına taşı
- [ ] İngilizce çevirileri tamamla
- [ ] Daha fazla dil desteği ekle (opsiyonel)
- [ ] Çeviri yönetim sistemi entegrasyonu (opsiyonel)

## 🤝 Katkıda Bulunma

1. Yeni özellik veya düzeltme için branch oluştur
2. `npm run i18n:scan` ile hardcoded metin kontrolü yap
3. Test et ve PR aç

## 📄 Lisans

© 2025 Sencer Film. Tüm hakları saklıdır.
