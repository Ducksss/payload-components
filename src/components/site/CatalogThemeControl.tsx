'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/utilities/ui'

/* Brand-hue picker for the catalog wall.
 *
 * Every block in the catalog is token-only (enforced by
 * tests/int/visual-standards.int.spec.ts), and the brand ramp is one OKLCH hue
 * at fixed lightness/chroma. That combination is what makes this cheap: the
 * control sets a single --preview-hue variable, .preview-themed rebuilds the
 * brand ramp from it, and all ~70 twins recolour with no re-render and no
 * per-component work. Because only the hue angle moves, every contrast ratio
 * is preserved — there is no hue that can fail the a11y gate.
 *
 * Native radios (visually replaced by swatches) rather than buttons, so arrow
 * keys work and the group announces as a single control. */

export const brandPresets = [
  { hue: 165.6, key: 'emerald' },
  { hue: 230, key: 'sky' },
  { hue: 275, key: 'indigo' },
  { hue: 310, key: 'violet' },
  { hue: 10, key: 'rose' },
  { hue: 65, key: 'amber' },
] as const

/* Radius is the higher-leverage knob: most twins carry a rounded-* class while
   only a handful reference a brand token, and the whole radius scale derives
   from --radius. Values bracket the 0.625rem default. */
export const radiusPresets = [
  { key: 'sharp', rem: 0 },
  { key: 'default', rem: 0.625 },
  { key: 'round', rem: 1.25 },
] as const

export const defaultBrandHue = brandPresets[0].hue
export const defaultRadiusRem = radiusPresets[1].rem

/* Mirrors the --brand stop in .preview-themed so a swatch renders the exact
   colour the previews will take. */
const swatchColor = (hue: number) => `oklch(50.8% 0.118 ${hue}deg)`

export function CatalogThemeControl({
  hue,
  onHueChange,
  onRadiusChange,
  radiusRem,
}: {
  hue: number
  onHueChange: (hue: number) => void
  onRadiusChange: (rem: number) => void
  radiusRem: number
}) {
  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-x-4 gap-y-2">
      <BrandSwatches hue={hue} onChange={onHueChange} />
      <RadiusToggle onChange={onRadiusChange} radiusRem={radiusRem} />
    </div>
  )
}

function BrandSwatches({ hue, onChange }: { hue: number; onChange: (hue: number) => void }) {
  const t = useTranslations('CatalogBrowser.theme')

  return (
    <fieldset className="flex shrink-0 items-center gap-2">
      <legend className="sr-only">{t('brandLegend')}</legend>
      <span
        aria-hidden="true"
        className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:inline"
      >
        {t('brandLabel')}
      </span>
      <div className="flex items-center gap-1.5">
        {brandPresets.map((preset) => {
          const active = preset.hue === hue
          const label = t(`colors.${preset.key}`)

          return (
            <label
              key={preset.key}
              className="relative cursor-pointer"
              title={t('previewBrand', { color: label })}
            >
              <input
                type="radio"
                name="catalog-brand-hue"
                value={preset.hue}
                checked={active}
                onChange={() => onChange(preset.hue)}
                className="peer sr-only"
              />
              <span className="sr-only">{label}</span>
              <span
                aria-hidden="true"
                style={{ backgroundColor: swatchColor(preset.hue) }}
                className={cn(
                  'block size-5 rounded-full ring-offset-2 ring-offset-background transition-transform',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                  active ? 'ring-2 ring-foreground/70' : 'ring-1 ring-border hover:scale-110',
                )}
              />
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function RadiusToggle({
  onChange,
  radiusRem,
}: {
  onChange: (rem: number) => void
  radiusRem: number
}) {
  const t = useTranslations('CatalogBrowser.theme')

  return (
    <fieldset className="flex shrink-0 items-center gap-2">
      <legend className="sr-only">{t('radiusLegend')}</legend>
      <span
        aria-hidden="true"
        className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:inline"
      >
        {t('radiusLabel')}
      </span>
      <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
        {radiusPresets.map((preset) => {
          const active = preset.rem === radiusRem
          const label = t(`radii.${preset.key}`)

          return (
            <label
              key={preset.key}
              className="cursor-pointer"
              title={t('previewRadius', { style: label })}
            >
              <input
                type="radio"
                name="catalog-radius"
                value={preset.rem}
                checked={active}
                onChange={() => onChange(preset.rem)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'block rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
