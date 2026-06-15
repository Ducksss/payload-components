import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import {
  Blocks,
  Boxes,
  GitPullRequest,
  Layers,
  LayoutGrid,
  LayoutPanelTop,
  Package,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react'
import type { MDXComponents } from 'mdx/types'

// Curated Lucide set so MDX can pass `icon={<Layers />}` to <Card> without a
// per-file import. Keep this list tight — only icons the docs actually use.
const icons = {
  Blocks,
  Boxes,
  GitPullRequest,
  Layers,
  LayoutGrid,
  LayoutPanelTop,
  Package,
  ShieldCheck,
  Terminal,
  Workflow,
}

// `defaultMdxComponents` already wires `Card`, `Cards`, `Callout`, code blocks,
// headings, and links. We layer on the structural components the docs use —
// step flows, tabbed alternatives, file trees, field tables — so MDX authors
// can reach for them without importing per page.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...icons,
    Accordion,
    Accordions,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  }
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
