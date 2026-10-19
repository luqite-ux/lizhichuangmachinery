'use client'
import { usePathname } from 'next/navigation'
import { useSiteLocale } from './locale-provider'
import { localizedPath } from '@/lib/localization'

export function LanguageSwitcher() {
  const locale = useSiteLocale()
  const pathname = usePathname()
  return <nav aria-label={locale === 'zh' ? '切换语言' : 'Language'} className="flex shrink-0 items-center gap-2 text-xs font-medium">
    {(['en', 'zh'] as const).map(language => <a key={language} href={localizedPath(pathname, language)} hrefLang={language === 'zh' ? 'zh-CN' : 'en'} lang={language === 'zh' ? 'zh-CN' : 'en'} aria-current={locale === language ? 'true' : undefined} onClick={event => {
      event.preventDefault()
      window.location.assign(localizedPath(window.location.pathname + window.location.search + window.location.hash, language))
    }} className={locale === language ? 'rounded px-1.5 py-2 text-primary underline underline-offset-4' : 'rounded px-1.5 py-2 text-muted-foreground hover:text-primary'}>{language === 'zh' ? '中文' : 'EN'}</a>)}
  </nav>
}
