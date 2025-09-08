'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams, useSearchParams } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('common');

  const currentLocale = (params?.locale as Locale) ?? 'tr';

  function onLocaleChange(nextLocale: Locale) {
    startTransition(() => {
      // Path ve query parametrelerini koruyarak yönlendir
      const search = searchParams.toString();
      router.replace(
        `${pathname}${search ? `?${search}` : ''}`,
        { locale: nextLocale }
      );
    });
  }

  return (
    <div 
      className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm p-1"
      role="group" 
      aria-label={t('languageSwitcher.label')}
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            onClick={() => onLocaleChange(locale)}
            disabled={isPending || isActive}
            aria-current={isActive ? 'true' : undefined}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-white text-black shadow-sm' 
                : 'text-white hover:bg-white/20'
              }
              ${isPending ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
