import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  consentBannerRevealScript,
  consentStorageKey,
  consentUndecidedAttribute,
  queuedConsentChoiceProperty,
  resolveConsent,
  takeQueuedConsentChoice,
} from '../../src/lib/consent'

/* The consent banner ships hidden in the static HTML, and an inline script
 * reveals it before React runs. That script is a string, so nothing type-checks
 * it against resolveConsent(), which decides whether the banner stays once React
 * takes over. If the two disagree, a visitor who already chose sees the banner
 * paint, or an undecided visitor gets the banner only after hydration, as the
 * late LCP element this was built to remove. Both run here against the same
 * stubbed browser, for every combination of stored value and privacy signal. */

type Visitor = {
  globalPrivacyControl: boolean | undefined
  navigatorDoNotTrack: string | null
  stored: string | null | 'storage-throws'
  windowDoNotTrack: string | undefined
}

type Fonts = {
  check: (font: string) => boolean
  load: (font: string) => Promise<unknown>
}

const bannerFamily = 'GeistSans, "GeistSans Fallback", ui-sans-serif, system-ui, sans-serif'
const loadedFonts: Fonts = { check: () => true, load: () => Promise.resolve([]) }
const undecided: Visitor = {
  globalPrivacyControl: undefined,
  navigatorDoNotTrack: null,
  stored: null,
  windowDoNotTrack: undefined,
}

const storedValues: Visitor['stored'][] = [null, 'granted', 'denied', 'yes', 'storage-throws']
const globalPrivacyControls: Visitor['globalPrivacyControl'][] = [undefined, false, true]
const navigatorDoNotTracks: Visitor['navigatorDoNotTrack'][] = [null, '0', '1']
const windowDoNotTracks: Visitor['windowDoNotTrack'][] = [undefined, '1']

const visitors: Visitor[] = storedValues.flatMap((stored) =>
  globalPrivacyControls.flatMap((globalPrivacyControl) =>
    navigatorDoNotTracks.flatMap((navigatorDoNotTrack) =>
      windowDoNotTracks.map((windowDoNotTrack) => ({
        globalPrivacyControl,
        navigatorDoNotTrack,
        stored,
        windowDoNotTrack,
      })),
    ),
  ),
)

type ClickTarget = {
  closest: (selector: string) => { getAttribute: (name: string) => string } | null
}

function stubBrowser(visitor: Visitor, fonts: Fonts | undefined = loadedFonts) {
  const htmlAttributes = new Map<string, string>()
  const clickListeners: Array<(event: { target: ClickTarget }) => void> = []
  const bannerState = { value: 'pending' }
  const storage = {
    getItem(key: string) {
      if (visitor.stored === 'storage-throws') {
        throw new DOMException('The operation is insecure.', 'SecurityError')
      }

      return key === consentStorageKey ? visitor.stored : null
    },
    removeItem() {},
    setItem() {},
  }
  const bannerText = { tagName: 'P' }
  const banner = {
    addEventListener: (type: string, listener: (event: { target: ClickTarget }) => void) => {
      if (type === 'click') clickListeners.push(listener)
    },
    getAttribute: (name: string) => (name === 'data-consent-banner' ? bannerState.value : null),
    querySelector: (selector: string) => (selector === 'p' ? bannerText : null),
  }
  const fakeWindow: Record<string, unknown> = {
    doNotTrack: visitor.windowDoNotTrack,
    localStorage: storage,
    sessionStorage: storage,
  }

  vi.stubGlobal('window', fakeWindow)
  vi.stubGlobal('navigator', {
    doNotTrack: visitor.navigatorDoNotTrack,
    globalPrivacyControl: visitor.globalPrivacyControl,
  })
  vi.stubGlobal('document', {
    cookie: '',
    documentElement: {
      removeAttribute: (name: string) => htmlAttributes.delete(name),
      setAttribute: (name: string, value: string) => htmlAttributes.set(name, value),
    },
    fonts,
    location: { hostname: 'www.payload-components.xyz' },
    querySelector: (selector: string) => (selector === '[data-consent-banner]' ? banner : null),
  })
  vi.stubGlobal('getComputedStyle', (element: unknown) => ({
    fontFamily: element === bannerText ? bannerFamily : '',
  }))

  const click = (choice: string | null) =>
    clickListeners.forEach((listener) =>
      listener({
        target: {
          closest: (selector) =>
            selector === '[data-consent-choice]' && choice
              ? { getAttribute: (name) => (name === 'data-consent-choice' ? choice : '') }
              : null,
        },
      }),
    )

  return { bannerState, click, fakeWindow, htmlAttributes }
}

// Global scope, as an inline <script> runs: any reference to a module binding
// would throw here instead of shipping broken.
const runRevealScript = () => new Function(consentBannerRevealScript)()

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('consent banner reveal script', () => {
  it('covers every combination', () => {
    // An empty table would make it.each below pass without running anything.
    expect(visitors).toHaveLength(90)
  })

  it.each(visitors)(
    'agrees with resolveConsent() for stored=$stored GPC=$globalPrivacyControl navigator.DNT=$navigatorDoNotTrack window.DNT=$windowDoNotTrack',
    (visitor) => {
      const { htmlAttributes } = stubBrowser(visitor)

      runRevealScript()
      const revealed = htmlAttributes.has(consentUndecidedAttribute)

      expect(revealed).toBe(resolveConsent() === null)
    },
  )

  it('waits for both banner weights of its web font, so the swap cannot reflow it', async () => {
    let finishLoading = () => {}
    const loading = new Promise<void>((resolve) => {
      finishLoading = resolve
    })
    const fonts = {
      check: vi.fn<Fonts['check']>(() => false),
      load: vi.fn<Fonts['load']>(() => loading),
    }
    const { htmlAttributes } = stubBrowser(undecided, fonts)

    runRevealScript()
    await settle()

    expect(fonts.load.mock.calls.map(([font]) => font)).toEqual([
      `400 14px ${bannerFamily}`,
      `500 14px ${bannerFamily}`,
    ])
    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(false)

    finishLoading()
    await settle()

    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)
  })

  it('reveals the banner anyway when its font fails to load', async () => {
    const fonts = {
      check: () => false,
      load: () => Promise.reject(new DOMException('Failed to load', 'NetworkError')),
    }
    const { htmlAttributes } = stubBrowser(undecided, fonts)

    runRevealScript()
    await settle()

    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)
  })

  it('reveals the banner anyway when the Font Loading API throws', () => {
    // check() throws a SyntaxError on a font string it cannot parse.
    const fonts = {
      check: () => {
        throw new DOMException('Could not parse font', 'SyntaxError')
      },
      load: () => Promise.resolve([]),
    }
    const { htmlAttributes } = stubBrowser(undecided, fonts)

    runRevealScript()

    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)
  })

  it('reveals at once where the Font Loading API is missing', () => {
    const { htmlAttributes } = stubBrowser(undecided, undefined)

    runRevealScript()

    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)
  })

  it('never asks about fonts for a visitor with nothing to decide', () => {
    const fonts = {
      check: vi.fn<Fonts['check']>(() => false),
      load: vi.fn<Fonts['load']>(() => Promise.resolve([])),
    }
    stubBrowser({ ...undecided, stored: 'denied' }, fonts)

    runRevealScript()

    expect(fonts.check).not.toHaveBeenCalled()
    expect(fonts.load).not.toHaveBeenCalled()
  })

  it('records a click made before hydration and hides the banner, writing nothing', () => {
    const { click, fakeWindow, htmlAttributes } = stubBrowser(undecided)

    runRevealScript()
    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)

    click(null)
    expect(fakeWindow[queuedConsentChoiceProperty]).toBeUndefined()
    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)

    click('denied')
    expect(fakeWindow[queuedConsentChoiceProperty]).toBe('denied')
    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(false)
  })

  it('leaves clicks to React once the banner is no longer pending', () => {
    const { bannerState, click, fakeWindow, htmlAttributes } = stubBrowser(undecided)

    runRevealScript()
    bannerState.value = ''
    click('granted')

    expect(fakeWindow[queuedConsentChoiceProperty]).toBeUndefined()
    expect(htmlAttributes.has(consentUndecidedAttribute)).toBe(true)
  })

  it('reads storage but never writes it: every write stays in setConsent()', () => {
    expect(consentBannerRevealScript).not.toMatch(/setItem|removeItem|cookie|dispatchEvent/)
  })
})

describe('takeQueuedConsentChoice', () => {
  it('hands over a recorded choice once and ignores anything else', () => {
    const fakeWindow: Record<string, unknown> = { [queuedConsentChoiceProperty]: 'granted' }
    vi.stubGlobal('window', fakeWindow)

    expect(takeQueuedConsentChoice()).toBe('granted')
    expect(queuedConsentChoiceProperty in fakeWindow).toBe(false)
    expect(takeQueuedConsentChoice()).toBeNull()

    fakeWindow[queuedConsentChoiceProperty] = 'yes please'
    expect(takeQueuedConsentChoice()).toBeNull()
    expect(queuedConsentChoiceProperty in fakeWindow).toBe(false)
  })
})
