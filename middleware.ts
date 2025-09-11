// middleware.ts
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

// next-intl middleware'ini oluştur
const intl = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false
})

export default function middleware(req: any) {
  const { pathname } = req.nextUrl

  // 1) ACME doğrulamasını kesinlikle dokunmadan geçir
  if (pathname.startsWith('/.well-known')) {
    return NextResponse.next()
  }

  // (Opsiyonel) başka bypass'lar:
  // if (pathname.startsWith('/api')) return NextResponse.next()

  // 2) Diğer tüm isteklerde normal intl middleware çalışsın
  return intl(req)
}

// 3) Matcher: .well-known (ve istersen api) kesinlikle kapsam DIŞI
export const config = {
  matcher: [
    // _next, _vercel, dosya uzantılı istekler, .well-known ve (opsiyonel) api hariç
    '/((?!_next|_vercel|.*\\..*|\\.well-known|api).*)'
  ]
}
