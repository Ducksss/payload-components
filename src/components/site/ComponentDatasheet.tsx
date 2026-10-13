import { PartPinout } from '@/components/site/graphics/PartPinout'
import { getComponentDatasheet } from '@/lib/component-datasheet'

/* The component's datasheet drawing, at the head of "What it installs": its
 * inputs on one side, the files an install writes on the other. Rendered by
 * <ComponentWiring>, so every component page gets one without an MDX edit, and
 * the page's fixed section order is unchanged. The drawing is decorative; the
 * caption states the same pin counts in text, and the file list and Content
 * model below it carry the detail.
 *
 * data-brand: a drawing of the site's, not a component preview, so it wears
 * the Datasheet brand inside the (unbranded) docs prose. */
export async function ComponentDatasheet({ slug }: { slug: string }) {
  const datasheet = await getComponentDatasheet(slug)
  if (!datasheet) return null

  const { inputKind, inputs, outputs, part } = datasheet
  const shared = inputs.filter((pin) => pin.shared)
  const sharedBase = shared[0]?.shared
  const firstShared = inputs.indexOf(shared[0]) + 1
  const sharedNote =
    sharedBase &&
    shared.every(
      (pin, k) => pin.shared === sharedBase && inputs.indexOf(pin) === firstShared - 1 + k,
    )
      ? ` (${shared.length === 1 ? `pin ${firstShared}` : `pins ${firstShared}–${firstShared + shared.length - 1}`} from the shared ${sharedBase} base)`
      : ''
  const noun = inputKind === 'fields' ? 'field' : 'prop'

  return (
    <figure data-brand="datasheet" className="datasheet-figure not-prose">
      <PartPinout datasheet={datasheet} />
      <figcaption className="datasheet-caption">
        <span className="datasheet-caption-ref">Fig. 1</span> Pinout of {part}: {inputs.length}{' '}
        {inputs.length === 1 ? noun : `${noun}s`} in{sharedNote}, {outputs.length}{' '}
        {outputs.length === 1 ? 'output' : 'outputs'} to your project.
      </figcaption>
    </figure>
  )
}
