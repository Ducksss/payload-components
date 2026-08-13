import { getSafeFormAction } from './safeUrls'

const footerHrefError = 'Enter an HTTPS URL, a mailto:/tel: link, or a same-origin path such as /pricing.'

/**
 * Resolve one footer link `href` to something safe to put on an anchor.
 *
 * Footers are almost entirely a link surface, and React does not sanitize `href`
 * — a stored `javascript:` or `data:` value would execute on click. Everything is
 * rejected here except the four shapes a real footer needs: a same-origin path,
 * an HTTPS URL, `mailto:`, and `tel:`. Both the admin `validate` and the render
 * path call through this, so a row written straight through the Local API (which
 * skips field validation) still cannot reach the DOM unchecked.
 */
export const getSafeFooterHref = (value: unknown) => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()

  if (!trimmed || /[\r\n\t]/.test(trimmed)) return undefined

  const sameOriginPath = getSafeFormAction(trimmed)
  if (sameOriginPath) return sameOriginPath

  try {
    const parsed = new URL(trimmed)

    if (parsed.username || parsed.password) return undefined

    if (parsed.protocol === 'https:') return parsed.toString()

    if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
      return parsed.toString()
    }

    return undefined
  } catch {
    return undefined
  }
}

export const validateFooterHref = (value: unknown) =>
  getSafeFooterHref(value) ? true : footerHrefError
