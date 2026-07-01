'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react'

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getBezierPath,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type { Edge, EdgeProps, Node, NodeProps } from '@xyflow/react'

import { wiringLedger } from '@/lib/site'
import { cn } from '@/utilities/ui'

import { ArtifactNodeCard, CommandNodeCard, NODE_ICONS, type NodeKind, nodeKind } from './wiring-nodes'

import '@xyflow/react/dist/style.css'

/* The interactive, motion-enabled twin of WiringNodeMap (boundary state).
 * Mounted (by WiringFlow) only on motion-enabled desktop and only once the
 * section nears the viewport — so it measures correctly and its reveal plays on
 * arrival. The whole React Flow pane is decorative (aria-hidden); real content
 * is carried by the static SSR map and an sr-only list below.
 *
 * Reveal sequence (once visible): nodes lift in, edges draw command → artifact,
 * ports pop at the join, then the emerald current starts flowing (and pauses
 * again while offscreen). */

const STATE = 'boundary' as const
const ROWS = wiringLedger.rows
const KINDS = ROWS.map((row) => nodeKind(STATE, row))
const COMMAND_SUMMARY = wiringLedger.columns.component.summary

type ArtifactData = { iconIndex: number; kind: NodeKind; rowIndex: number }
type CommandData = { branded: boolean; label: string; summary: string }
type EdgeData = { kind: NodeKind; nodeId: string }

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties

const INITIAL_NODES: Node[] = [
  {
    id: 'command',
    type: 'command',
    position: { x: 0, y: 96 },
    data: { branded: true, label: 'One command', summary: COMMAND_SUMMARY } satisfies CommandData,
    draggable: true,
  },
  ...ROWS.map((_, index) => ({
    id: `a${index}`,
    type: 'artifact',
    position: { x: 480, y: index * 72 },
    data: { iconIndex: index, kind: KINDS[index], rowIndex: index } satisfies ArtifactData,
    draggable: true,
  })),
]

const INITIAL_EDGES: Edge[] = ROWS.map((_, index) => ({
  id: `e${index}`,
  source: 'command',
  target: `a${index}`,
  type: 'flow',
  data: { kind: KINDS[index], nodeId: `a${index}` } satisfies EdgeData,
}))

const InteractionContext = createContext<{ expandedId: string | null; hoveredId: string | null }>({
  expandedId: null,
  hoveredId: null,
})

function CommandFlowNode({ data }: NodeProps) {
  const d = data as CommandData

  return (
    <div className="wiring-reveal" style={cssVars({ '--i': 0 })}>
      <div className="wiring-3d w-[12rem] select-none">
        <CommandNodeCard branded={d.branded} className="shadow-card" label={d.label} summary={d.summary} />
        <Handle type="source" position={Position.Right} isConnectable={false} className="wiring-handle" />
      </div>
    </div>
  )
}

function ArtifactFlowNode({ data, id }: NodeProps) {
  const { expandedId, hoveredId } = useContext(InteractionContext)
  const d = data as ArtifactData
  const row = ROWS[d.rowIndex]
  const active = hoveredId === id || expandedId === id
  const dimmed = hoveredId !== null && hoveredId !== id && expandedId !== id

  const tiltRef = useRef<HTMLDivElement>(null)
  const raf = useRef<number | null>(null)

  /* Tilt the card toward the pointer — CSS vars set imperatively (no re-render),
     rAF-throttled, one hovered node at a time. */
  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current
    if (!el || raf.current !== null) return
    const { clientX, clientY } = event
    raf.current = requestAnimationFrame(() => {
      raf.current = null
      const rect = el.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-py * 9).toFixed(2)}deg`)
    })
  }
  const resetTilt = () => {
    const el = tiltRef.current
    if (!el) return
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
  }

  return (
    <div className="wiring-reveal" style={cssVars({ '--i': d.rowIndex + 1 })}>
      <div
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        className={cn('wiring-3d group relative w-[16rem] select-none rounded-xl', active && 'is-active')}
      >
        <Handle type="target" position={Position.Left} isConnectable={false} className="wiring-handle" />
        <ArtifactNodeCard
          className={cn(
            'shadow-card transition-[box-shadow,opacity] duration-200',
            active && 'shadow-frame',
            dimmed && 'opacity-55',
            expandedId === id && 'ring-2 ring-brand/40',
          )}
          icon={NODE_ICONS[d.iconIndex]}
          kind={d.kind}
          row={row}
        />
      </div>
    </div>
  )
}

function FlowEdge({ data, sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY }: EdgeProps) {
  const { hoveredId } = useContext(InteractionContext)
  const d = (data ?? {}) as EdgeData
  const index = d.nodeId ? Number(d.nodeId.slice(1)) : 0
  const [path] = getBezierPath({ sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY })

  const wired = d.kind === 'wired'
  const active = hoveredId === d.nodeId
  const dimmed = hoveredId !== null && !active
  const style = cssVars({ '--i': index + 1 })

  if (!wired) {
    return (
      <g style={{ ...style, transition: 'opacity 220ms ease' }} opacity={dimmed ? 0.22 : 0.55}>
        <path
          className="wiring-edge-base"
          d={path}
          fill="none"
          pathLength={100}
          stroke="var(--muted-foreground)"
          strokeLinecap="round"
          strokeWidth={active ? 1.75 : 1.25}
        />
        <circle className="wiring-port" cx={targetX} cy={targetY} r={2.25} fill="var(--muted-foreground)" />
      </g>
    )
  }

  return (
    <g
      className={active ? 'wiring-edge-glow' : undefined}
      style={{ ...style, transition: 'opacity 220ms ease' }}
      opacity={dimmed ? 0.28 : 1}
    >
      <path
        className="wiring-edge-base"
        d={path}
        fill="none"
        pathLength={100}
        stroke="var(--brand)"
        strokeLinecap="round"
        strokeWidth={active ? 2 : 1.5}
        opacity={active ? 1 : 0.8}
        style={{ transition: 'stroke-width 200ms ease' }}
      />
      <path
        className="wiring-flow-dash"
        d={path}
        fill="none"
        pathLength={100}
        stroke="var(--brand)"
        strokeLinecap="round"
        strokeWidth={active ? 3 : 2.25}
      />
      <circle className="wiring-port" cx={sourceX} cy={sourceY} r={active ? 3 : 2.5} fill="var(--brand)" />
      <circle className="wiring-port" cx={targetX} cy={targetY} r={active ? 3.5 : 2.75} fill="var(--brand)" />
    </g>
  )
}

const nodeTypes = { artifact: ArtifactFlowNode, command: CommandFlowNode }
const edgeTypes = { flow: FlowEdge }

function DetailStrip() {
  const { expandedId, hoveredId } = useContext(InteractionContext)
  const activeId = hoveredId ?? expandedId
  const index = activeId && activeId.startsWith('a') ? Number(activeId.slice(1)) : null
  const row = index !== null ? ROWS[index] : null
  const pinned = expandedId !== null && hoveredId === null
  const Icon = index !== null ? NODE_ICONS[index] : null
  const wired = index !== null && KINDS[index] === 'wired'

  return (
    <div
      aria-hidden="true"
      className="mt-4 flex min-h-[2.5rem] items-center gap-2.5 overflow-hidden rounded-xl border border-border bg-muted/30 px-3.5 py-2"
    >
      {row && Icon ? (
        <>
          <Icon className={cn('size-4 shrink-0', wired ? 'text-brand' : 'text-muted-foreground')} />
          <span className="shrink-0 text-sm font-medium text-foreground">{row.artifact}</span>
          <span className="shrink-0 text-muted-foreground/40">→</span>
          <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
            {row.path}
          </code>
          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            {pinned ? (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-brand">
                pinned
              </span>
            ) : null}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]',
                wired ? 'bg-brand-50 text-brand' : 'bg-muted text-muted-foreground',
              )}
            >
              {row.component}
            </span>
          </span>
        </>
      ) : (
        <span className="font-mono text-[11px] text-muted-foreground/70">
          Drag a node · hover to trace its file · click to pin
        </span>
      )}
    </div>
  )
}

function Canvas() {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [flowing, setFlowing] = useState(true)
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')
  const ref = useRef<HTMLDivElement>(null)

  /* Drive the one-time reveal and the offscreen flow-pause from one observer —
     no perpetual compositor work while the section is out of view. */
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        setFlowing(entry.isIntersecting)
        if (entry.isIntersecting) setRevealed(true)
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const ctx = useMemo(() => ({ expandedId, hoveredId }), [expandedId, hoveredId])

  return (
    <InteractionContext.Provider value={ctx}>
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'wiring-canvas relative h-[20rem] w-full sm:h-[22rem]',
          flowing && 'is-flowing',
          revealed && 'is-revealed',
        )}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.7}
          maxZoom={1.4}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          disableKeyboardA11y
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
          onNodeMouseLeave={() => setHoveredId(null)}
          onNodeClick={(_, node) => {
            if (node.type === 'artifact') setExpandedId((prev) => (prev === node.id ? null : node.id))
          }}
          onPaneClick={() => setExpandedId(null)}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="var(--border)" />
        </ReactFlow>
      </div>
      <DetailStrip />
    </InteractionContext.Provider>
  )
}

export function WiringFlowCanvas({
  caption,
  className,
}: {
  caption?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.5rem] border border-border bg-background p-5 shadow-card sm:p-6',
        className,
      )}
    >
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>

      {caption ? <p className="mt-5 text-xs leading-5 text-muted-foreground">{caption}</p> : null}

      {/* Accessible mirror of the decorative canvas (AT + post-hydration SEO). */}
      <ul className="sr-only">
        <li>{COMMAND_SUMMARY}</li>
        {ROWS.map((row) => (
          <li key={row.artifact}>{`${row.artifact}: ${row.component} (${row.path})`}</li>
        ))}
      </ul>
    </div>
  )
}
