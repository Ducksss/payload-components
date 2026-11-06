import { File as FileIcon } from 'lucide-react'

import { Folder } from 'fumadocs-ui/components/files'

import { type CompositionNode, compositionLines } from '@/lib/component-composition'

/* The two structural panels in the install reference: a monospace composition
 * tree of the Payload side (derived in src/lib/component-composition.ts) and
 * the installed files grouped by directory. Both are plain server markup;
 * only Fumadocs' Folder carries a client collapsible. Neither panel is
 * `not-prose` itself: the section wrapper is, and component pages give every
 * top-level `.not-prose` block its margin, which a nested one must not repeat
 * (that is also why the file tree uses its own container, not Fumadocs' Files,
 * which hardcodes the class). */

export function CompositionTree({
  files,
  lead,
  root,
}: {
  /* The source files behind the tree (schema + renderer), as label/path rows. */
  files: { label: string; path: string }[]
  lead: string
  root: CompositionNode
}) {
  const lines = compositionLines(root)

  return (
    <div className="rounded-lg border border-border bg-muted/30">
      <p className="border-b border-border px-5 py-3 text-sm leading-6 text-muted-foreground">
        {lead}
      </p>
      {/* A wide tree scrolls inside the panel, never the page. */}
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-foreground">
        {lines.map((line, index) => (
          <span className="block whitespace-pre" key={`${index}-${line.name}`}>
            <span aria-hidden="true" className="text-muted-foreground/60">
              {line.guide}
            </span>
            {line.name}
            {line.note ? <span className="text-muted-foreground">{`  ${line.note}`}</span> : null}
          </span>
        ))}
      </pre>
      {files.length ? (
        /* Label and path share a line so a long path wraps mid-word inside a
           phone column (break-all) instead of pushing the page wider. */
        <dl className="flex flex-col gap-2 border-t border-border bg-background px-5 py-3">
          {files.map((file) => (
            <div className="flex items-baseline gap-3" key={file.path}>
              <dt className="w-16 shrink-0 font-mono text-xs uppercase leading-6 tracking-eyebrow text-muted-foreground">
                {file.label}
              </dt>
              <dd className="min-w-0 flex-1 leading-6">
                <code className="break-all font-mono text-[13px] text-foreground">{file.path}</code>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}

type DirectoryNode = {
  /* Single-child directory chains collapse into one label (src/blocks). */
  directories: DirectoryNode[]
  files: string[]
  name: string
}

/* Group manifest paths by directory, preserving manifest order within each
 * folder (config.ts before Component.tsx is the install order). */
export function groupFilesByDirectory(paths: string[]): DirectoryNode {
  const root: DirectoryNode = { directories: [], files: [], name: '' }

  for (const path of paths) {
    const segments = path.split('/')
    segments.pop()
    let node = root
    for (const segment of segments) {
      let next = node.directories.find((directory) => directory.name === segment)
      if (!next) {
        next = { directories: [], files: [], name: segment }
        node.directories.push(next)
      }
      node = next
    }
    node.files.push(path)
  }

  const compact = (node: DirectoryNode): DirectoryNode => {
    let current = node
    while (current.directories.length === 1 && current.files.length === 0 && current.name) {
      const [only] = current.directories
      current = { ...only, name: `${current.name}/${only.name}` }
    }
    return { ...current, directories: current.directories.map(compact) }
  }

  return { ...root, directories: root.directories.map(compact) }
}

const basename = (path: string) => path.split('/').pop() ?? path

function FileLeaf({ path, shared }: { path: string; shared: boolean }) {
  return (
    <div className="flex min-h-9 flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
      <FileIcon aria-hidden="true" className="text-muted-foreground" />
      <span className="min-w-0 break-all font-mono text-[13px] text-foreground">
        {basename(path)}
      </span>
      {shared ? (
        <span className="shrink-0 rounded-md border border-border bg-background px-1.5 font-mono text-xs leading-5 text-muted-foreground">
          shared
        </span>
      ) : null}
    </div>
  )
}

function DirectoryBranch({ node, shared }: { node: DirectoryNode; shared: Set<string> }) {
  return (
    <Folder defaultOpen name={node.name}>
      {node.directories.map((directory) => (
        <DirectoryBranch key={directory.name} node={directory} shared={shared} />
      ))}
      {node.files.map((path) => (
        <FileLeaf key={path} path={path} shared={shared.has(path)} />
      ))}
    </Folder>
  )
}

export function InstalledFileTree({ files, shared }: { files: string[]; shared: string[] }) {
  const tree = groupFilesByDirectory(files)
  const sharedSet = new Set(shared)

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      {tree.directories.map((directory) => (
        <DirectoryBranch key={directory.name} node={directory} shared={sharedSet} />
      ))}
      {tree.files.map((path) => (
        <FileLeaf key={path} path={path} shared={sharedSet.has(path)} />
      ))}
    </div>
  )
}
