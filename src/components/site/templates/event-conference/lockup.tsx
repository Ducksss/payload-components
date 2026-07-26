import { cn } from '@/utilities/ui'

/* Frameworks ’26 poster furniture — the pieces of the identity that repeat
 * across the masthead and the footer, so the date/venue lockup reads the same
 * everywhere. Presentational only; all styling lives in theme.css beneath the
 * [data-template-theme='event-conference'] scope. */

export const FRAMEWORKS_EDITION = 'Edition seven'
export const FRAMEWORKS_DATES = '12–13 March 2026'
export const FRAMEWORKS_VENUE = 'Halle Nord'
export const FRAMEWORKS_CITY = 'Berlin'
export const FRAMEWORKS_DOORS = 'Doors 09:00'
export const FRAMEWORKS_WAVE = 'Wave two on sale'

/* The wordmark: a heavy uppercase block plus the year set solid in a violet
 * chip — the one place the accent is used as a field rather than a mark. */
export function FrameworksWordmark({
  className,
  tone = 'chip',
}: {
  className?: string
  tone?: 'chip' | 'plain'
}) {
  return (
    <span className={cn('fw-wordmark', className)}>
      <span className="fw-wordmark-name">Frameworks</span>
      <span className={tone === 'chip' ? 'fw-wordmark-year' : 'fw-wordmark-year-plain'}>’26</span>
    </span>
  )
}

/* Four hard-edged cells divided by violet hairlines: the poster's information
 * block. Used large in the footer. */
const lockupCells = [
  { label: 'Dates', value: FRAMEWORKS_DATES },
  { label: 'Venue', value: FRAMEWORKS_VENUE },
  { label: 'City', value: FRAMEWORKS_CITY },
  { label: 'Doors', value: '09:00 both days' },
] as const

export function FrameworksLockup({ className }: { className?: string }) {
  return (
    <dl className={cn('fw-lockup', className)}>
      {lockupCells.map((cell) => (
        <div className="fw-lockup-cell" key={cell.label}>
          <dt className="fw-lockup-label">{cell.label}</dt>
          <dd className="fw-lockup-value">{cell.value}</dd>
        </div>
      ))}
    </dl>
  )
}
