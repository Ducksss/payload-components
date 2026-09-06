import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  sendContactForm,
  validateContactForm,
} from '../../payload-components/source/blocks/ContactFormBasic/form'
import { runCommand } from '../../tools/payload-components/utils'
import { expectInstalledComponents } from './payload-components-assertions'
import { createInstallFixture } from './payload-components-fixture'

const root = process.cwd()
const dirs: string[] = []
afterEach(async () => {
  vi.unstubAllGlobals()
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})
const contactData = (values: Record<string, string> = {}) => {
  const data = new FormData()
  for (const [key, value] of Object.entries({
    name: 'Sam',
    email: 'sam@example.com',
    organization: '',
    message: 'Hello!',
    ...values,
  }))
    data.set(key, value)
  return data
}

describe('Contact Form Basic', () => {
  it('validates required values and email while allowing an empty organization', () => {
    expect(validateContactForm(contactData())).toEqual({})
    expect(
      Object.keys(validateContactForm(contactData({ name: ' ', email: 'broken', message: '\n' }))),
    ).toEqual(['name', 'email', 'message'])
  })

  it('posts the visitor data once and only accepts an explicit successful acknowledgement', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })))
    vi.stubGlobal('fetch', fetch)
    const data = contactData()
    await expect(sendContactForm('/api/contact', data)).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: data,
        redirect: 'error',
        credentials: 'same-origin',
      }),
    )
    for (const response of [
      new Response('{}'),
      new Response('{"success":false}'),
      new Response('<html>Oops</html>'),
      new Response('{"success":true}', { status: 500 }),
    ]) {
      fetch.mockResolvedValueOnce(response)
      await expect(sendContactForm('/api/contact', data)).rejects.toThrow()
    }
    fetch.mockRejectedValueOnce(new DOMException('Timed out', 'TimeoutError'))
    await expect(sendContactForm('/api/contact', data)).rejects.toThrow('Timed out')
  })

  it('renders linked visible labels, autofill attributes, and disabled controls for unsafe actions', async () => {
    const { ContactFormBasicBlock } = await vi.importActual<{
      ContactFormBasicBlock: ComponentType<Record<string, unknown>>
    }>('../../payload-components/source/blocks/ContactFormBasic/Component')
    const html = renderToStaticMarkup(
      <ContactFormBasicBlock action="/api/contact" title="Contact us" />,
    )
    for (const name of ['name', 'email', 'organization', 'message']) {
      const control = new RegExp(
        `<(?:input|textarea)[^>]* id="([^"]+)"[^>]*name="${name}"[^>]*>`,
      ).exec(html)
      expect(control, name).not.toBeNull()
      expect(html).toContain(`for="${control?.[1]}"`)
      expect(control?.[0]).toContain('aria-invalid="false"')
    }
    expect(html).toContain('autoComplete="name"')
    expect(html).toContain('autoComplete="organization"')
    expect(html).toContain('type="email"')
    expect(html).toContain('inputMode="email"')
    expect(html).toContain('role="status"')
    for (const action of [undefined, '//evil.example', 'javascript:alert(1)']) {
      const unavailable = renderToStaticMarkup(<ContactFormBasicBlock action={action} />)
      expect(unavailable.match(/disabled=""/g)).toHaveLength(5)
      expect(unavailable).toContain('Contact form unavailable.')
    }
  })

  it('installs and reinstalls without duplicating the block registration', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('contact-form-basic', {
      preseedSource: true,
    })
    dirs.push(fixtureDir)
    const add = () =>
      runCommand({
        command: process.execPath,
        args: [
          path.join(root, 'bin/payload-components.mjs'),
          'add',
          manifest.name,
          '--cwd',
          fixtureDir,
        ],
        cwd: root,
        captureOutput: true,
        timeoutMs: 60_000,
      })
    await add()
    await expectInstalledComponents(fixtureDir, [manifest])
    const renderer = await readFile(path.join(fixtureDir, 'src/blocks/RenderBlocks.tsx'), 'utf8')
    await add()
    await expectInstalledComponents(fixtureDir, [manifest])
    expect(await readFile(path.join(fixtureDir, 'src/blocks/RenderBlocks.tsx'), 'utf8')).toEqual(
      renderer,
    )
  }, 180_000)

  it('typechecks the actual client component and transport with React DOM types', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'contact-form-compile-'))
    dirs.push(dir)
    // Generated Payload block shape: required content and optional editor labels.
    const declarations = path.join(dir, 'payload-types.d.ts')
    await writeFile(
      declarations,
      `export interface ContactFormBasicBlock { blockType: 'contactFormBasic'; title: string; action: string; successMessage: string; description?: string | null; submitLabel?: string | null; nameLabel?: string | null; emailLabel?: string | null; organizationLabel?: string | null; messageLabel?: string | null; id?: string }`,
    )
    const component = path.join(
      root,
      'payload-components/source/blocks/ContactFormBasic/Component.tsx',
    )
    const program = ts.createProgram([component], {
      types: ['react'],
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      baseUrl: root,
      paths: {
        '@/payload-types': [declarations],
        '@/blocks/shared/*': ['payload-components/source/blocks/shared/*'],
        '@/utilities/ui': ['src/utilities/ui.ts'],
      },
    })
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map((error) => ts.flattenDiagnosticMessageText(error.messageText, ' '))
    expect(diagnostics).toEqual([])
  }, 30_000)
})
