import { headers } from 'next/headers'
import type { SiteLocale } from './localization'
export async function getRequestLocale(): Promise<SiteLocale> {
  return (await headers()).get('x-site-locale') === 'zh' ? 'zh' : 'en'
}
