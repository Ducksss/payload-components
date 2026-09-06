import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const source = readFileSync(
  path.join(root, 'payload-components/source/blocks/shared/PostCard.tsx'),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

// Render the actual shipped card. Consumer UI primitives are replaced with
// semantic wrappers; the date calculation and its <time> markup are unchanged.
const renderScript = `
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const div = ({ children, ...props }) => React.createElement('div', props, children)
  const target = {}
  new Function('require', 'exports', ${JSON.stringify(compiled)})((id) => {
    if (id === 'react') return React
    if (id === 'next/link') return ({children, ...props}) => React.createElement('a', props, children)
    if (id === '@/components/Media') return { Media: () => null }
    if (id === '@/components/ui/badge') return { Badge: div }
    if (id === '@/components/ui/card') return { Card: div, CardContent: div, CardDescription: div, CardHeader: div, CardTitle: div }
    if (id === '@/utilities/ui') return { cn: (...values) => values.filter(value => typeof value === 'string').join(' ') }
    throw new Error('Unexpected runtime dependency: ' + id)
  }, target)
  process.stdout.write(renderToStaticMarkup(React.createElement(target.PostCard, {
    post: { title: 'Boundary post', slug: 'boundary', publishedAt: '2026-09-06T00:30:00.000Z' },
  })))
`

const renderInZone = (timeZone: string) =>
  execFileSync(process.execPath, ['-e', renderScript], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, TZ: timeZone },
    timeout: 10_000,
  })

describe('shared Post Card publication dates', () => {
  it('renders the same UTC editorial date on servers and clients in different time zones', () => {
    const server = renderInZone('UTC')
    const client = renderInZone('America/Los_Angeles')

    expect(server).toContain('dateTime="2026-09-06T00:30:00.000Z"')
    expect(server).toContain('Sep 6, 2026')
    expect(client).toEqual(server)
  })
})
