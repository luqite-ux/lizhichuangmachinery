import type { Metadata } from 'next'
import { absoluteUrl } from './site-config'
import { localizedPath, translateText, type SiteLocale } from './localization'

export function languageAlternates(url: string, locale: SiteLocale) {
  const path = new URL(url, absoluteUrl()).pathname.replace(/^\/zh(?=\/|$)/, '') || '/'
  return { canonical: absoluteUrl(localizedPath(path, locale)), languages: { en: absoluteUrl(path), 'zh-CN': absoluteUrl(localizedPath(path, 'zh')), 'x-default': absoluteUrl(path) } }
}

export function localizeMetadata(metadata: Metadata, locale: SiteLocale): Metadata {
  const canonical = String(metadata.alternates?.canonical || absoluteUrl('/'))
  const translate = (value: unknown): unknown => {
    if (typeof value === 'string') return translateText(value, locale)
    if (Array.isArray(value)) return value.map(translate)
    if (value && typeof value === 'object' && !(value instanceof URL)) return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, ['type','card','template','locale','url'].includes(key) ? val : translate(val)]))
    return value
  }
  const result = translate(metadata) as Metadata
  result.alternates = languageAlternates(canonical, locale)
  if (result.openGraph) result.openGraph = { ...result.openGraph, url: result.alternates.canonical as string, locale: locale === 'zh' ? 'zh_CN' : 'en_US', alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN' }
  return result
}
