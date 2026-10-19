import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react'
import { localizedPath, translateText, type SiteLocale } from './localization'

/** Localize rendered presentation only. Never inspect arbitrary business props,
 * event handlers, form values, styles, source URLs, or script/HTML contents.
 * This runs during React rendering (including SSR), not through DOM mutation.
 */
export function localizedTree(node: ReactNode, locale: SiteLocale): ReactNode {
  if (locale === 'en') return node
  if (typeof node === 'string') return translateText(node, locale)
  if (Array.isArray(node)) return Children.toArray(node).map(child => localizedTree(child, locale))
  if (!isValidElement(node)) return node
  const element = node as ReactElement<Record<string, unknown>>
  if (element.type === 'script' || element.type === 'style') return node
  const props = element.props
  const patch: Record<string, unknown> = {}
  for (const key of ['alt', 'title', 'placeholder', 'aria-label']) {
    if (typeof props[key] === 'string') patch[key] = translateText(props[key], locale)
  }
  if (typeof props.href === 'string' && !props.hrefLang) patch.href = localizedPath(props.href, locale)
  if (props.children !== undefined) patch.children = localizedTree(props.children as ReactNode, locale)
  return cloneElement(element, patch)
}
