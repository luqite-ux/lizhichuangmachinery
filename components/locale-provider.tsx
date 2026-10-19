'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { SiteLocale } from '@/lib/localization'
const LocaleContext = createContext<SiteLocale>('en')
export const useSiteLocale = () => useContext(LocaleContext)
export function LocaleProvider({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}
