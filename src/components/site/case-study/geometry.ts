/* Shared geometry for the /about/case-study plates.
 *
 * Everything is derived from the logomark as it ships (Logomark.tsx and
 * public/favicon.svg): a 24-unit emerald square with rx 6, holding two 8.4-unit
 * blocks with rx 1.9 at (4.8, 4.8) and (10.8, 10.8), so they overlap by 2.4 on
 * both axes. Change the mark there first; these numbers follow it. */

export const MARK = {
  block: 8.4,
  blockRadius: 1.9,
  containerRadius: 6,
  grid: 24,
  keyA: 4.8,
  keyB: 10.8,
} as const

/* The mark it replaced (still in git history as public/favicon.svg): a `>`
   prompt chevron beside a block cursor, which read as a media "skip" control
   at tab size. Drawn only as the "before" in the identity plate. */
export const RETIRED_MARK = {
  chevron: '7 7.5 11.5 12 7 16.5',
  chevronWidth: 2.3,
  cursor: { height: 9, radius: 1, width: 3.6, x: 14, y: 7.5 },
} as const

function inRoundedRect(
  x: number,
  y: number,
  left: number,
  top: number,
  size: number,
  radius: number,
) {
  if (x < left || y < top || x > left + size || y > top + size) return false
  const cx = Math.min(Math.max(x, left + radius), left + size - radius)
  const cy = Math.min(Math.max(y, top + radius), top + size - radius)
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2
}

/* How much of each pixel is emerald when the mark is rasterized at `pixels`
   square — a supersampled coverage map, i.e. roughly what a browser tab shows.
   0 is white (a block or outside the square), 1 is solid emerald. */
export function markCoverage(pixels = 16, samples = 8): number[][] {
  const unit = MARK.grid / pixels

  return Array.from({ length: pixels }, (_, row) =>
    Array.from({ length: pixels }, (_, column) => {
      let emerald = 0

      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const x = (column + (sx + 0.5) / samples) * unit
          const y = (row + (sy + 0.5) / samples) * unit
          const inSquare = inRoundedRect(x, y, 0, 0, MARK.grid, MARK.containerRadius)
          const inBlock =
            inRoundedRect(x, y, MARK.keyA, MARK.keyA, MARK.block, MARK.blockRadius) ||
            inRoundedRect(x, y, MARK.keyB, MARK.keyB, MARK.block, MARK.blockRadius)

          if (inSquare && !inBlock) emerald += 1
        }
      }

      return Math.round((emerald / samples ** 2) * 100) / 100
    }),
  )
}

/* A four-point sparkle: the only ornament the brand allows, and only in emerald. */
export function sparklePath(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`
}
