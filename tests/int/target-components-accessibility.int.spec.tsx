import type { ComponentType } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'

import { beforeAll, describe, expect, it, vi } from 'vitest'

type SignupProps = {
  action?: string
  blockName: null
  blockType: 'callToActionSignup'
  description: string
  emailPlaceholder: string
  submitLabel: string
  title: string
}

let CallToActionSignupBlock: ComponentType<SignupProps>

beforeAll(async () => {
  const targetModule = await vi.importActual<{
    CallToActionSignupBlock: ComponentType<SignupProps>
  }>('../../payload-components/source/blocks/CallToActionSignup/Component')

  CallToActionSignupBlock = targetModule.CallToActionSignupBlock
})

const renderSignup = (overrides: Record<string, unknown> = {}) =>
  renderToStaticMarkup(
    <CallToActionSignupBlock
      action="/api/newsletter"
      blockName={null}
      blockType="callToActionSignup"
      description="Occasional release notes."
      emailPlaceholder="Email address"
      submitLabel="Join the list"
      title="Stay current"
      {...overrides}
    />,
  )

describe('installable target-component accessibility', () => {
  it('keeps the visible signup label in the button accessible name', () => {
    const html = renderSignup()
    const button = /<button([^>]*)>([\s\S]*?)<\/button>/.exec(html)

    expect(button).not.toBeNull()
    expect(button?.[1]).not.toContain('aria-label=')
    expect(button?.[1]).not.toContain('disabled')
    expect(button?.[2]).toContain('Join the list')
    expect(html).toMatch(/<form[^>]*action="\/api\/newsletter"/)
  })

  it('renders no enabled form when the signup destination is missing or unsafe', () => {
    for (const action of [undefined, 'javascript:alert(1)', '//attacker.example/collect']) {
      const html = renderSignup({ action })

      expect(html).not.toContain('<form')
      expect(html).toMatch(/<input[^>]*disabled=""/)
      expect(html).toMatch(/<button[^>]*disabled=""/)
      expect(html).toContain('role="status"')
      expect(html).toContain('Signup unavailable.')
    }
  })
})
