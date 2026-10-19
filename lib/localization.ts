import dictionary from './zh-CN.json' with { type: 'json' }

export type SiteLocale = 'en' | 'zh'
const translations: Record<string, string> = dictionary
export const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim().replaceAll('&amp;', '&')

export function localizedPath(value: string, locale: SiteLocale): string {
  if (!value.startsWith('/') || value.startsWith('//')) return value
  const base = value.replace(/^\/zh(?=\/|[?#]|$)/, '') || '/'
  if (!/^\/(?:$|[?#]|products(?:[/?#]|$)|about(?:[/?#]|$)|solutions(?:[/?#]|$)|news(?:[/?#]|$)|contact(?:[/?#]|$))/.test(base)) return value
  return locale === 'zh' ? `/zh${base === '/' ? '' : base}` : base
}

export function translateText(value: string, locale: SiteLocale): string {
  if (locale !== 'zh') return value
  const normalized = normalizeText(value)
  if (translations[normalized]) return translations[normalized]
  if (/^© \d{4} /.test(normalized)) return normalized.replace(/Zhengzhou Lizhichuang Machinery Equipment Co\., Ltd\. All rights reserved\./, '郑州利之创机械设备有限公司 版权所有。')
  if (normalized.startsWith('Show slide: ')) return `显示轮播：${translateText(normalized.slice(12), locale)}`
  if (/^(Technical datasheet|Equipment layout) \d+$/.test(normalized)) return normalized.replace('Technical datasheet', '技术参数表').replace('Equipment layout', '设备布局图')
  if (normalized.endsWith(' home')) return `${translateText(normalized.slice(0, -5), locale)}首页`
  if (normalized.endsWith(' logo')) return `${translateText(normalized.slice(0, -5), locale)}标志`
  if (/ equipment view \d+$/.test(normalized)) return normalized.replace(' equipment view ', ' 设备视图 ')
  return value
}
