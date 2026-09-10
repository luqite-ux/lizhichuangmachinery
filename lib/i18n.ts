export const DEFAULT_LOCALE = 'en'
export type Locale = string

export function resolveLocalized(value: unknown, locale: Locale = DEFAULT_LOCALE, ...fallbacks: unknown[]) {
  const map = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const firstMapped = Object.values(map).find((item) => typeof item === 'string' && item.trim())
  return [map[locale], map[DEFAULT_LOCALE], ...fallbacks, firstMapped].find((item) => typeof item === 'string' && item.trim()) as string || ''
}

export function resolveLocalizedList(value: unknown, locale: Locale = DEFAULT_LOCALE, fallback?: unknown): string[] {
  const map = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const candidate = map[locale] ?? map[DEFAULT_LOCALE] ?? Object.values(map).find(Array.isArray) ?? fallback
  return Array.isArray(candidate) ? candidate.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : []
}
