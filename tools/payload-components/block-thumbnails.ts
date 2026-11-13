/* Layout schematics for Payload's admin Blocks Drawer.
 *
 * Every block config sets `admin.images.thumbnail` to a picture of its layout.
 * Payload draws that picture in a 3:2 box roughly 180px wide, `object-fit:
 * cover`, so a screenshot would shrink to noise and a binary file cannot ship as
 * registry text. Instead each block has a short recipe of layout primitives
 * (block-thumbnail-recipes.ts), and this module renders a recipe to a small SVG.
 * `pnpm thumbnails:build` writes the SVG into the block's `thumbnail.ts` as a
 * `data:` URI: no `public/` file, no request to this site, nothing to fetch.
 *
 * The primitives are deliberately chunky. At drawer size a 6-unit text bar is
 * about two pixels tall, so detail that a twin shows in type becomes a bar, a
 * pill, or a box here. Colours are fixed (an <img> cannot read the admin theme),
 * light-first and monochrome with the one emerald accent, like the site. */

type Align = 'start' | 'center' | 'end'

/* Where a node draws: its slot's top-left corner and width, the height a
 * stretching parent hands it (rows equalise their cells), the inherited
 * horizontal alignment, and whether it sits on a dark backdrop. */
export type ThumbnailBox = {
  align: Align
  dark: boolean
  height?: number
  width: number
  x: number
  y: number
}

export type ThumbnailNode = {
  /* SVG elements, one per string. */
  draw: (box: ThumbnailBox) => string[]
  /* Natural height at a slot width. */
  height: (width: number) => number
}

/* A whole-canvas backdrop (a video still, an aurora) and the node drawn on it. */
export type ThumbnailRecipe = ThumbnailNode | { backdrop: Backdrop; body: ThumbnailNode }

type Backdrop = 'aurora' | 'video'

const light = {
  accent: '#059669',
  border: '#e4e4e7',
  copy: '#d4d4d8',
  ink: '#27272a',
  muted: '#f1f1f3',
  page: '#fafafa',
  paper: '#ffffff',
  soft: '#a1a1aa',
}

const dark: typeof light = {
  accent: '#34d399',
  border: '#52525b',
  copy: '#71717a',
  ink: '#fafafa',
  muted: '#3f3f46',
  page: '#18181b',
  paper: '#27272a',
  soft: '#a1a1aa',
}

const tones = (box: ThumbnailBox) => (box.dark ? dark : light)

/* One decimal is finer than a drawer pixel and keeps the markup short. */
const num = (value: number) => String(Math.round(value * 10) / 10)

const attrs = (values: Record<string, number | string | undefined>) =>
  Object.entries(values)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${typeof value === 'number' ? num(value) : value}"`)
    .join('')

const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  {
    fill = 'none',
    radius,
    stroke,
    strokeWidth = 1.5,
  }: { fill?: string; radius?: number; stroke?: string; strokeWidth?: number } = {},
) =>
  `<rect${attrs({
    x,
    y,
    width,
    height,
    rx: radius,
    fill,
    stroke,
    'stroke-width': stroke ? strokeWidth : undefined,
  })}/>`

const circle = (
  cx: number,
  cy: number,
  r: number,
  { fill = 'none', stroke }: { fill?: string; stroke?: string } = {},
) => `<circle${attrs({ cx, cy, r, fill, stroke, 'stroke-width': stroke ? 1.5 : undefined })}/>`

const path = (d: string, { fill = 'none', stroke }: { fill?: string; stroke?: string } = {}) =>
  `<path${attrs({
    d,
    fill,
    stroke,
    'stroke-width': stroke ? 2 : undefined,
    'stroke-linecap': stroke ? 'round' : undefined,
    'stroke-linejoin': stroke ? 'round' : undefined,
  })}/>`

/* x of a child `width` wide inside the box, by the box's alignment. */
const alignX = (box: ThumbnailBox, width: number) =>
  box.align === 'center'
    ? box.x + (box.width - width) / 2
    : box.align === 'end'
      ? box.x + box.width - width
      : box.x

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

/* ------------------------------------------------------------------------ */
/* Leaves                                                                   */
/* ------------------------------------------------------------------------ */

/* Bars of copy. `width` is the share of the slot the longest line takes; the
 * last line of a paragraph runs short, the way set text does. */
const bars = ({
  colour,
  gap,
  height,
  lines,
  width,
}: {
  colour: (box: ThumbnailBox) => string
  gap: number
  height: number
  lines: number
  width: number
}): ThumbnailNode => ({
  draw: (box) =>
    Array.from({ length: lines }, (_, index) => {
      const share = lines > 1 && index === lines - 1 ? width * 0.62 : width
      const barWidth = box.width * share

      return rect(alignX(box, barWidth), box.y + index * (height + gap), barWidth, height, {
        fill: colour(box),
        radius: height / 2,
      })
    }),
  height: () => lines * height + (lines - 1) * gap,
})

const headingSizes = { sm: 10, md: 15, lg: 19, xl: 26 }

/* A headline: thick ink bars. */
export const heading = (
  lines = 1,
  { size = 'md', width = 0.82 }: { size?: keyof typeof headingSizes; width?: number } = {},
) => {
  const height = headingSizes[size]

  return bars({ colour: (box) => tones(box).ink, gap: height * 0.45, height, lines, width })
}

/* Body copy: thin light bars. */
export const text = (lines = 2, { width = 0.9 }: { width?: number } = {}) =>
  bars({ colour: (box) => tones(box).copy, gap: 5, height: 6, lines, width })

/* A short dark label: a card title, a plan name, a question. */
export const label = ({ width = 0.45 }: { width?: number } = {}) =>
  bars({ colour: (box) => tones(box).ink, gap: 0, height: 7, lines: 1, width })

/* A short muted label: a caption, a role, a link. */
export const caption = ({ width = 0.3 }: { width?: number } = {}) =>
  bars({ colour: (box) => tones(box).soft, gap: 0, height: 5, lines: 1, width })

/* The small outlined badge above most headlines. */
export const eyebrow = (): ThumbnailNode => ({
  draw: (box) => {
    const { border, paper, soft } = tones(box)
    const x = alignX(box, 60)

    return [
      rect(x, box.y, 60, 14, { fill: paper, radius: 7, stroke: border }),
      rect(x + 12, box.y + 5, 36, 4, { fill: soft, radius: 2 }),
    ]
  },
  height: () => 14,
})

/* A row of pill buttons, the first one primary unless `primary` is false. */
export const buttons = (
  count = 2,
  { primary = true, width = 62 }: { primary?: boolean; width?: number } = {},
): ThumbnailNode => ({
  draw: (box) => {
    const { border, ink, paper, soft } = tones(box)
    const total = count * width + (count - 1) * 8
    const x = alignX(box, total)

    return Array.from({ length: count }, (_, index) => {
      const left = x + index * (width + 8)
      const filled = primary && index === 0

      return [
        rect(left, box.y, width, 20, {
          fill: filled ? ink : paper,
          radius: 10,
          stroke: filled ? undefined : border,
        }),
        rect(left + width * 0.25, box.y + 8, width * 0.5, 4, {
          fill: filled ? paper : soft,
          radius: 2,
        }),
      ]
    }).flat()
  },
  height: () => 20,
})

/* One full-width button, as forms and pricing cards end with. */
export const wideButton = ({ primary = true }: { primary?: boolean } = {}): ThumbnailNode => ({
  draw: (box) => {
    const { border, ink, paper, soft } = tones(box)

    return [
      rect(box.x, box.y, box.width, 20, {
        fill: primary ? ink : paper,
        radius: 10,
        stroke: primary ? undefined : border,
      }),
      rect(box.x + box.width * 0.35, box.y + 8, box.width * 0.3, 4, {
        fill: primary ? paper : soft,
        radius: 2,
      }),
    ]
  },
  height: () => 20,
})

/* Small outlined chips: proof badges, tags, filters. `filled` darkens the
 * first, like an active tab. */
export const chips = (
  count = 3,
  { filled = false, width = 46 }: { filled?: boolean; width?: number } = {},
): ThumbnailNode => ({
  draw: (box) => {
    const { border, ink, muted, paper, soft } = tones(box)
    const total = count * width + (count - 1) * 6
    const x = alignX(box, total)

    return Array.from({ length: count }, (_, index) => {
      const left = x + index * (width + 6)
      const active = filled && index === 0

      return [
        rect(left, box.y, width, 14, {
          fill: active ? ink : muted,
          radius: 7,
          stroke: active ? undefined : border,
        }),
        rect(left + width * 0.22, box.y + 5, width * 0.56, 4, {
          fill: active ? paper : soft,
          radius: 2,
        }),
      ]
    }).flat()
  },
  height: () => 14,
})

/* An editor-filled picture. `image` is the usual landscape placeholder,
 * `video` a dark still with a play button, `app` a product screen, `chart` a
 * product card with the accent trend line, `frame` a raised card on a muted
 * stage, and `tiles` a muted board of product tiles. Without `height` or
 * `ratio` it takes the height a row hands it. */
export const media = ({
  height,
  kind = 'image',
  ratio,
}: {
  height?: number
  kind?: 'app' | 'chart' | 'frame' | 'image' | 'tiles' | 'video'
  ratio?: number
} = {}): ThumbnailNode => {
  const natural = (width: number) => height ?? (ratio ? width / ratio : width * 0.62)

  return {
    draw: (box) => {
      const { accent, border, copy, ink, muted, paper, soft } = tones(box)
      const w = box.width
      const h = height ?? (ratio ? w / ratio : (box.height ?? natural(w)))
      const { x, y } = box
      const cx = x + w / 2
      const cy = y + h / 2
      const glyph = Math.min(w, h)

      if (kind === 'video') {
        return [
          rect(x, y, w, h, { fill: '#3f3f46', radius: 8 }),
          circle(cx, cy, glyph * 0.12, { fill: paper }),
          path(
            `M${num(cx - glyph * 0.035)} ${num(cy - glyph * 0.055)}L${num(cx + glyph * 0.06)} ${num(cy)}L${num(cx - glyph * 0.035)} ${num(cy + glyph * 0.055)}Z`,
            { fill: ink },
          ),
        ]
      }

      if (kind === 'app') {
        const side = w * 0.22
        const inner = w - side - 24

        return [
          rect(x, y, w, h, { fill: paper, radius: 8, stroke: border }),
          rect(x + 8, y + 8, side, h - 16, { fill: muted, radius: 5 }),
          rect(x + 14, y + 16, side * 0.6, 4, { fill: copy, radius: 2 }),
          rect(x + 14, y + 26, side * 0.45, 4, { fill: copy, radius: 2 }),
          rect(x + 14, y + 36, side * 0.5, 4, { fill: copy, radius: 2 }),
          rect(x + side + 16, y + 8, inner, h * 0.5 - 12, { fill: muted, radius: 5 }),
          rect(x + side + 16, y + h * 0.5 + 4, inner / 2 - 4, h * 0.5 - 12, {
            fill: muted,
            radius: 5,
          }),
          rect(x + side + 20 + inner / 2, y + h * 0.5 + 4, inner / 2 - 4, h * 0.5 - 12, {
            fill: border,
            radius: 5,
          }),
        ]
      }

      if (kind === 'chart') {
        const top = y + h * 0.3
        const points = [0, 0.55, 0.18, 0.62, 0.36, 0.42, 0.52, 0.48, 0.7, 0.26, 0.86, 0.2, 1, 0.06]
        const line = points
          .reduce<string[]>((segments, value, index) => {
            if (index % 2 === 0) {
              const px = x + 16 + value * (w - 32)
              const py = top + points[index + 1] * (h * 0.6)
              segments.push(`${segments.length === 0 ? 'M' : 'L'}${num(px)} ${num(py)}`)
            }

            return segments
          }, [])
          .join('')

        return [
          rect(x, y, w, h, { fill: paper, radius: 8, stroke: border }),
          rect(x + 12, y + 12, w * 0.2, 22, { fill: paper, radius: 5, stroke: border }),
          rect(x + 18, y + 20, w * 0.1, 6, { fill: accent, radius: 3 }),
          path(line, { stroke: accent }),
        ]
      }

      if (kind === 'frame') {
        return [
          rect(x, y, w, h, { fill: muted, radius: 8 }),
          rect(x + w * 0.08, y + h * 0.14, w * 0.84, h * 0.86, {
            fill: paper,
            radius: 6,
            stroke: border,
          }),
        ]
      }

      if (kind === 'tiles') {
        const half = (w - 24) / 2

        return [
          rect(x, y, w, h, { fill: muted, radius: 6 }),
          rect(x + 8, y + 8, half * 1.25, h / 2 - 12, { fill: paper, radius: 4 }),
          rect(x + 16 + half * 1.25, y + 8, half * 0.75, h / 2 - 12, { fill: border, radius: 4 }),
          rect(x + 8, y + h / 2 + 4, half * 0.6, h / 2 - 12, { fill: border, radius: 4 }),
          rect(x + 16 + half * 0.6, y + h / 2 + 4, half * 1.4, h / 2 - 12, {
            fill: paper,
            radius: 4,
          }),
        ]
      }

      return [
        rect(x, y, w, h, { fill: muted, radius: 8 }),
        circle(cx + glyph * 0.16, cy - glyph * 0.12, glyph * 0.07, { fill: copy }),
        path(
          `M${num(cx - glyph * 0.3)} ${num(cy + glyph * 0.2)}L${num(cx - glyph * 0.08)} ${num(cy - glyph * 0.06)}L${num(cx + glyph * 0.06)} ${num(cy + glyph * 0.1)}L${num(cx + glyph * 0.14)} ${num(cy + glyph * 0.02)}L${num(cx + glyph * 0.3)} ${num(cy + glyph * 0.2)}Z`,
          { fill: copy },
        ),
      ]
    },
    height: natural,
  }
}

/* A row of round avatars. */
export const avatars = (count = 1, { size = 16 }: { size?: number } = {}): ThumbnailNode => ({
  draw: (box) => {
    const total = count * size + (count - 1) * 6
    const x = alignX(box, total)

    return Array.from({ length: count }, (_, index) =>
      circle(x + index * (size + 6) + size / 2, box.y + size / 2, size / 2, {
        fill: tones(box).border,
      }),
    )
  },
  height: () => size,
})

/* A small rounded square: a feature icon, an integration tile. `featured`
 * makes it the larger dark hub tile integration layouts centre on. */
export const icon = ({ featured = false, size = 16 }: { featured?: boolean; size?: number } = {}) =>
  tiles(1, { featured, size })

export const tiles = (
  count: number,
  { featured = false, size = 22 }: { featured?: boolean; size?: number } = {},
): ThumbnailNode => {
  const big = featured ? size * 1.35 : size

  return {
    draw: (box) => {
      const { border, ink, paper, soft } = tones(box)
      const widths = Array.from({ length: count }, (_, index) =>
        featured && index === Math.floor(count / 2) ? big : size,
      )
      const total = sum(widths) + (count - 1) * 8
      let left = alignX(box, total)

      return widths.flatMap((width) => {
        const hub = width !== size || (featured && count === 1)
        const top = box.y + (big - width) / 2
        const elements = [
          rect(left, top, width, width, {
            fill: paper,
            radius: width * 0.28,
            stroke: hub ? ink : border,
          }),
          circle(left + width / 2, top + width / 2, width * 0.18, {
            fill: hub ? ink : soft,
          }),
        ]

        left += width + 8
        return elements
      })
    },
    height: () => big,
  }
}

/* Wordmark-style logos spread across the slot: a mark and a name bar each.
 * They shrink rather than overlap when the slot is narrow. */
export const logos = (
  count: number,
  { spread = true }: { spread?: boolean } = {},
): ThumbnailNode => ({
  draw: (box) => {
    const { soft } = tones(box)
    const item = Math.min(48, (box.width - (count - 1) * 12) / count)
    const gap = spread ? (box.width - count * item) / Math.max(count - 1, 1) : 12
    const total = count * item + (count - 1) * gap
    const x = spread ? box.x : alignX(box, total)

    return Array.from({ length: count }, (_, index) => {
      const left = x + index * (item + gap)

      return [
        circle(left + 4, box.y + 4, 4, { fill: soft }),
        rect(left + 12, box.y + 1.5, item - 12, 5, { fill: soft, radius: 2.5 }),
      ]
    }).flat()
  },
  height: () => 8,
})

/* A labelled input; `rows` makes it a textarea. */
export const field = ({ rows = 1 }: { rows?: number } = {}): ThumbnailNode => ({
  draw: (box) => {
    const { border, paper, soft } = tones(box)
    const height = rows > 1 ? rows * 14 : 18

    return [
      rect(box.x, box.y, box.width * 0.3, 5, { fill: soft, radius: 2.5 }),
      rect(box.x, box.y + 10, box.width, height, { fill: paper, radius: 5, stroke: border }),
    ]
  },
  height: () => 10 + (rows > 1 ? rows * 14 : 18),
})

/* An unlabelled input with its submit button, like a newsletter signup. */
export const inlineForm = (): ThumbnailNode => ({
  draw: (box) => {
    const { border, ink, paper, soft } = tones(box)
    const buttonWidth = 64
    const x = alignX(box, box.width)

    return [
      rect(x, box.y, box.width - buttonWidth - 6, 20, { fill: paper, radius: 6, stroke: border }),
      rect(x + 10, box.y + 8, 48, 4, { fill: soft, radius: 2 }),
      rect(x + box.width - buttonWidth, box.y, buttonWidth, 20, { fill: ink, radius: 10 }),
      rect(x + box.width - buttonWidth + 16, box.y + 8, buttonWidth - 32, 4, {
        fill: paper,
        radius: 2,
      }),
    ]
  },
  height: () => 20,
})

/* A metric: a big ink figure over a muted label. */
export const stat = ({ size = 'md' }: { size?: 'md' | 'lg' } = {}): ThumbnailNode => {
  const figure = size === 'lg' ? 20 : 15

  return {
    draw: (box) => {
      const { copy, ink } = tones(box)
      const figureWidth = figure * 3

      return [
        rect(alignX(box, figureWidth), box.y, figureWidth, figure, { fill: ink, radius: 4 }),
        rect(alignX(box, figureWidth * 0.85), box.y + figure + 6, figureWidth * 0.85, 5, {
          fill: copy,
          radius: 2.5,
        }),
      ]
    },
    height: () => figure + 11,
  }
}

/* A plan price: the amount and its period. */
export const price = ({ size = 'md' }: { size?: 'md' | 'lg' } = {}): ThumbnailNode => {
  const height = size === 'lg' ? 22 : 15

  return {
    draw: (box) => {
      const { copy, ink } = tones(box)
      const amount = height * 2.4
      const x = alignX(box, amount + 22)

      return [
        rect(x, box.y, amount, height, { fill: ink, radius: 4 }),
        rect(x + amount + 6, box.y + height - 5, 16, 5, { fill: copy, radius: 2.5 }),
      ]
    },
    height: () => height,
  }
}

/* A list whose items start with a mark: an accent check, a dot, or a figure. */
export const checklist = (
  count = 3,
  { mark = 'check', width = 0.75 }: { mark?: 'check' | 'dot' | 'figure'; width?: number } = {},
): ThumbnailNode => ({
  draw: (box) => {
    const { accent, copy, ink } = tones(box)

    return Array.from({ length: count }, (_, index) => {
      const y = box.y + index * 13
      const share = index % 2 === 1 ? width * 0.8 : width

      if (mark === 'figure') {
        return [
          rect(box.x, y, 18, 7, { fill: ink, radius: 3.5 }),
          rect(box.x + 24, y + 1, (box.width - 24) * share * 0.7, 5, { fill: copy, radius: 2.5 }),
        ]
      }

      return [
        mark === 'check'
          ? path(`M${num(box.x)} ${num(y + 3.5)}l2.5 2.5l4.5 -5`, { stroke: accent })
          : circle(box.x + 3, y + 3.5, 2.5, { fill: accent }),
        rect(box.x + 13, y + 1, (box.width - 13) * share, 5, { fill: copy, radius: 2.5 }),
      ]
    }).flat()
  },
  height: () => count * 13 - 6,
})

/* A lone accent check, as a comparison cell. */
export const check = (): ThumbnailNode => ({
  draw: (box) => {
    const x = alignX(box, 9)

    return [path(`M${num(x)} ${num(box.y + 3.5)}l2.5 2.5l4.5 -5`, { stroke: tones(box).accent })]
  },
  height: () => 7,
})

/* Five rating stars, the last one hollow when `rating` is 4. */
export const stars = ({ rating = 5 }: { rating?: number } = {}): ThumbnailNode => ({
  draw: (box) => {
    const { ink } = tones(box)

    return Array.from({ length: 5 }, (_, index) => {
      const cx = box.x + 4 + index * 11
      const cy = box.y + 4.5
      const points = Array.from({ length: 10 }, (_, point) => {
        const radius = point % 2 === 0 ? 4.5 : 2
        const angle = (Math.PI / 5) * point - Math.PI / 2

        return `${num(cx + radius * Math.cos(angle))} ${num(cy + radius * Math.sin(angle))}`
      })

      return path(`M${points.join('L')}Z`, index < rating ? { fill: ink } : { stroke: ink })
    })
  },
  height: () => 9,
})

/* A large opening quotation mark. */
export const quoteMark = (): ThumbnailNode => ({
  draw: (box) => {
    const { ink } = tones(box)
    const x = alignX(box, 26)
    const mark = (left: number) =>
      path(
        `M${num(left + 10)} ${num(box.y)}C${num(left + 3)} ${num(box.y + 2)} ${num(left)} ${num(box.y + 8)} ${num(left)} ${num(box.y + 14)}A5 5 0 1 0 ${num(left + 5)} ${num(box.y + 9)}C${num(left + 5)} ${num(box.y + 6)} ${num(left + 7)} ${num(box.y + 3)} ${num(left + 10)} ${num(box.y + 2)}Z`,
        { fill: ink },
      )

    return [mark(x), mark(x + 14)]
  },
  height: () => 19,
})

/* A numbered step badge. */
export const stepBadge = (): ThumbnailNode => ({
  draw: (box) => {
    const { ink, paper } = tones(box)

    return [
      circle(box.x + 9, box.y + 9, 9, { fill: ink }),
      rect(box.x + 7.5, box.y + 5, 3, 8, { fill: paper, radius: 1.5 }),
    ]
  },
  height: () => 18,
})

/* The plus or chevron that closes an accordion or list row. */
export const disclosure = (): ThumbnailNode => ({
  draw: (box) => {
    const { soft } = tones(box)
    const x = box.x + box.width - 8

    return [
      rect(x, box.y + 3, 8, 2, { fill: soft, radius: 1 }),
      rect(x + 3, box.y, 2, 8, { fill: soft, radius: 1 }),
    ]
  },
  height: () => 8,
})

/* A hairline rule. */
export const divider = (): ThumbnailNode => ({
  draw: (box) => [rect(box.x, box.y, box.width, 1.5, { fill: tones(box).border })],
  height: () => 1.5,
})

/* Empty space; in a row it holds a column open. */
export const spacer = (height = 0): ThumbnailNode => ({
  draw: () => [],
  height: () => height,
})

/* Integration logos orbiting a hub. */
export const orbit = (): ThumbnailNode => ({
  draw: (box) => {
    const { border, ink, paper, soft } = tones(box)
    const cx = box.x + box.width / 2
    const cy = box.y + 52
    const satellites = [0, 1, 2, 3, 4, 5].map((index) => {
      const angle = (Math.PI / 3) * index - Math.PI / 2
      const radius = index % 2 === 0 ? 48 : 30

      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
    })

    return [
      circle(cx, cy, 48, { stroke: border }),
      circle(cx, cy, 30, { stroke: border }),
      ...satellites.flatMap(([sx, sy]) => [
        rect(sx - 8, sy - 8, 16, 16, { fill: paper, radius: 4.5, stroke: border }),
        circle(sx, sy, 3, { fill: soft }),
      ]),
      rect(cx - 13, cy - 13, 26, 26, { fill: paper, radius: 7, stroke: ink }),
      circle(cx, cy, 5, { fill: ink }),
    ]
  },
  height: () => 104,
})

/* ------------------------------------------------------------------------ */
/* Containers                                                               */
/* ------------------------------------------------------------------------ */

/* Children top to bottom. `align` overrides the inherited alignment. */
export const stack = (
  children: ThumbnailNode[],
  { align, gap = 10 }: { align?: Align; gap?: number } = {},
): ThumbnailNode => ({
  draw: (box) => {
    let y = box.y

    return children.flatMap((child) => {
      const elements = child.draw({ ...box, align: align ?? box.align, height: undefined, y })

      y += child.height(box.width) + gap
      return elements
    })
  },
  height: (width) =>
    sum(children.map((child) => child.height(width))) + Math.max(children.length - 1, 0) * gap,
})

/* Children side by side, sharing the width by `weights` (equal by default); a
 * `{ fixed }` weight is an exact width, for an avatar or icon beside its text.
 * Cells stretch to the tallest one so cards in a row line up; `valign: 'center'`
 * centres shorter cells instead. */
export const row = (
  children: ThumbnailNode[],
  {
    align,
    gap = 16,
    valign = 'stretch',
    weights = children.map(() => 1),
  }: {
    align?: Align
    gap?: number
    valign?: 'center' | 'stretch'
    weights?: Array<number | { fixed: number }>
  } = {},
): ThumbnailNode => {
  const widths = (width: number) => {
    const fixed = sum(weights.map((weight) => (typeof weight === 'number' ? 0 : weight.fixed)))
    const free = width - fixed - gap * (children.length - 1)
    const total = sum(weights.map((weight) => (typeof weight === 'number' ? weight : 0)))

    return weights.map((weight) =>
      typeof weight === 'number' ? (free * weight) / total : weight.fixed,
    )
  }
  const height = (width: number) => {
    const columns = widths(width)

    return Math.max(...children.map((child, index) => child.height(columns[index])))
  }

  return {
    draw: (box) => {
      const columns = widths(box.width)
      const rowHeight = Math.max(box.height ?? 0, height(box.width))
      let x = box.x

      return children.flatMap((child, index) => {
        const offset = valign === 'center' ? (rowHeight - child.height(columns[index])) / 2 : 0
        const elements = child.draw({
          ...box,
          align: align ?? box.align,
          height: valign === 'stretch' ? rowHeight : undefined,
          width: columns[index],
          x,
          y: box.y + offset,
        })

        x += columns[index] + gap
        return elements
      })
    },
    height,
  }
}

/* Children in rows of `columns`. */
export const grid = (
  children: ThumbnailNode[],
  { columns, gap = 10 }: { columns: number; gap?: number },
): ThumbnailNode => {
  const rows = Array.from({ length: Math.ceil(children.length / columns) }, (_, index) => {
    const cells = children.slice(index * columns, index * columns + columns)

    while (cells.length < columns) cells.push(spacer())

    return row(cells, { gap })
  })

  return stack(rows, { gap })
}

/* A bordered surface around a stack. `featured` rings it in the accent with a
 * badge on its top edge, `muted` greys it, `dark` inverts it. Cards stretch to
 * the height their row gives them. */
export const card = (
  children: ThumbnailNode[],
  {
    align,
    gap = 8,
    pad = 12,
    tone = 'paper',
  }: {
    align?: Align
    gap?: number
    pad?: number
    tone?: 'featured' | 'muted' | 'paper' | 'ring'
  } = {},
): ThumbnailNode => {
  const body = stack(children, { align, gap })

  return {
    draw: (box) => {
      const { accent, border, ink, muted, paper } = tones(box)
      const height = box.height ?? body.height(box.width - pad * 2) + pad * 2
      const surface = rect(box.x, box.y, box.width, height, {
        fill: tone === 'muted' ? muted : paper,
        radius: 8,
        stroke: tone === 'featured' ? accent : tone === 'ring' ? ink : border,
        strokeWidth: tone === 'featured' || tone === 'ring' ? 2 : 1.5,
      })
      const badge =
        tone === 'featured'
          ? [
              rect(box.x + box.width / 2 - 18, box.y - 6, 36, 12, { fill: accent, radius: 6 }),
              rect(box.x + box.width / 2 - 10, box.y - 2, 20, 4, { fill: paper, radius: 2 }),
            ]
          : []

      return [
        surface,
        ...badge,
        ...body.draw({
          ...box,
          align: align ?? box.align,
          height: undefined,
          width: box.width - pad * 2,
          x: box.x + pad,
          y: box.y + pad,
        }),
      ]
    },
    height: (width) => body.height(width - pad * 2) + pad * 2,
  }
}

/* A child confined to a share of the slot, placed by the alignment. */
export const narrow = (share: number, child: ThumbnailNode): ThumbnailNode => ({
  draw: (box) => {
    const width = box.width * share

    return child.draw({ ...box, width, x: alignX(box, width) })
  },
  height: (width) => child.height(width * share),
})

/* A child pinned to one side regardless of its parent's alignment. */
export const place = (align: Align, child: ThumbnailNode): ThumbnailNode => ({
  draw: (box) => child.draw({ ...box, align }),
  height: (width) => child.height(width),
})

/* A child behind a vertical rule, like a blockquote. */
export const quoted = (child: ThumbnailNode): ThumbnailNode => ({
  draw: (box) => [
    rect(box.x, box.y, 2.5, child.height(box.width - 14), { fill: tones(box).border, radius: 1 }),
    ...child.draw({ ...box, width: box.width - 14, x: box.x + 14 }),
  ],
  height: (width) => child.height(width - 14),
})

/* A child with a shadowed product frame tilted back, like a hero screenshot. */
export const tilted = (child: ThumbnailNode): ThumbnailNode => ({
  draw: (box) => {
    const elements = child.draw(box)
    const cx = num(box.x + box.width / 2)
    const cy = num(box.y)

    return [
      `<g transform="translate(${cx} ${cy}) matrix(1 0 -0.12 0.92 0 0) translate(-${cx} -${cy})">`,
      ...elements,
      '</g>',
    ]
  },
  height: (width) => child.height(width) * 0.92,
})

/* ------------------------------------------------------------------------ */
/* Rendering                                                                */
/* ------------------------------------------------------------------------ */

const PAD = 28
const MIN_WIDTH = 360
const MAX_WIDTH = 1440

const backdrops: Record<Backdrop, (width: number, height: number) => string[]> = {
  aurora: (width, height) => [
    '<defs><radialGradient id="a" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#a7f3d0"/><stop offset="1" stop-color="#fafafa"/></radialGradient></defs>',
    rect(0, 0, width, height, { fill: 'url(#a)' }),
    circle(width / 2, 0, height * 0.55, { stroke: '#d1fae5' }),
    circle(width / 2, 0, height * 0.8, { stroke: '#ecfdf5' }),
  ],
  video: (width, height) => [
    '<defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#52525b"/><stop offset="1" stop-color="#18181b"/></linearGradient></defs>',
    rect(0, 0, width, height, { fill: 'url(#v)' }),
  ],
}

/* Lays a recipe out on a 3:2 canvas. Bars, pills, and cards keep their sizes,
 * so a taller layout gets a wider canvas rather than a squashed one: the canvas
 * grows in steps of 12 (keeping both sides whole numbers) until the content
 * fits, then the content is centred on it. Returns one SVG element per line. */
export const renderThumbnailSvg = (recipe: ThumbnailRecipe) => {
  const { backdrop, body } = 'body' in recipe ? recipe : { backdrop: undefined, body: recipe }
  let width = MIN_WIDTH

  while (body.height(width - PAD * 2) + PAD * 2 > (width * 2) / 3) {
    width += 12

    if (width > MAX_WIDTH) {
      throw new Error('Thumbnail recipe is too tall to fit a 3:2 canvas; drop some rows.')
    }
  }

  const height = (width * 2) / 3
  const top = (height - body.height(width - PAD * 2)) / 2

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    ...(backdrop
      ? backdrops[backdrop](width, height)
      : [rect(0, 0, width, height, { fill: light.page })]),
    ...body.draw({
      align: 'start',
      dark: backdrop === 'video',
      width: width - PAD * 2,
      x: PAD,
      y: top,
    }),
    '</svg>',
  ]
}

/* The `thumbnail.ts` module a block ships. The SVG stays one element per line
 * so a layout change reads as a small diff; the URI is encoded where the module
 * loads, not here. */
export const blockThumbnailModule = ({
  camel,
  recipe,
  title,
}: {
  camel: string
  recipe: ThumbnailRecipe
  title: string
}) =>
  [
    `/* ${title}'s picture in Payload's admin Blocks Drawer (admin.images.thumbnail,`,
    ' * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs',
    ' * no file in public/ and no network request. The drawer names every block under',
    ' * its picture, so the picture is decorative and its alt text is empty. */',
    'const svg = [',
    ...renderThumbnailSvg(recipe).map((line) => `  '${line}',`),
    "].join('')",
    '',
    `export const ${camel}Thumbnail = {`,
    "  alt: '',",
    '  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,',
    '}',
    '',
  ].join('\n')
