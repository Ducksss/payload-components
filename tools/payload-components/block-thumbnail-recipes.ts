import {
  avatars,
  buttons,
  caption,
  card,
  check,
  checklist,
  chips,
  disclosure,
  divider,
  eyebrow,
  field,
  grid,
  heading,
  icon,
  inlineForm,
  label,
  logos,
  media,
  narrow,
  orbit,
  place,
  price,
  quoted,
  quoteMark,
  row,
  spacer,
  stack,
  stars,
  stat,
  stepBadge,
  text,
  tilted,
  tiles,
  wideButton,
  type ThumbnailNode,
  type ThumbnailRecipe,
} from './block-thumbnails'

/* One layout recipe per Pages block, keyed by install slug. A recipe is a
 * schematic of the block's demo twin (src/components/site/demos/), not a
 * replica: three rows stand for six, a bar stands for a sentence. What it must
 * show is what tells a block from its siblings under the same drawer heading —
 * centred or split, cards or a list, media left or right.
 *
 * Change the recipe when a block's layout changes, then run
 * `pnpm thumbnails:build`; tests/int/blocks-drawer-thumbnails.int.spec.ts fails
 * while a block's thumbnail.ts and its recipe disagree. `payload-components new`
 * copies the nearest sibling's recipe for a new block. */

/* The eyebrow, headline, and lead most sections open with. */
const intro = ({
  align,
  copy = 1,
  lines = 1,
  size = 'md',
  withEyebrow = true,
}: {
  align?: 'center' | 'start'
  copy?: number
  lines?: number
  size?: 'lg' | 'md' | 'xl'
  withEyebrow?: boolean
} = {}) =>
  stack(
    [
      ...(withEyebrow ? [eyebrow()] : []),
      heading(lines, { size, width: lines > 1 ? 0.8 : 0.66 }),
      ...(copy > 0 ? [text(copy, { width: align === 'center' ? 0.62 : 0.72 })] : []),
    ],
    { align, gap: 8 },
  )

const centred = (children: ThumbnailNode[], gap = 14) => stack(children, { align: 'center', gap })

/* A titled block of copy: a feature, an answer, a step. */
const item = (lines = 2, { lead }: { lead?: ThumbnailNode } = {}) =>
  stack([...(lead ? [lead] : []), label({ width: 0.55 }), text(lines)], { gap: 6 })

const textCard = (lines = 2, lead?: ThumbnailNode) => card([item(lines, { lead })])

/* A question and its answer, closed by a rule. */
const answer = () => stack([label({ width: 0.5 }), text(1, { width: 0.8 }), divider()], { gap: 7 })

const person = (size = 14) =>
  row([avatars(1, { size }), stack([label({ width: 0.7 }), caption({ width: 0.5 })], { gap: 4 })], {
    gap: 6,
    valign: 'center',
    weights: [{ fixed: size }, 1],
  })

const plan = (
  options: { buttonFirst?: boolean; featured?: boolean; muted?: boolean } = {},
): ThumbnailNode => {
  const button = wideButton({ primary: Boolean(options.featured) })

  return card(
    [
      label({ width: 0.4 }),
      price(),
      ...(options.buttonFirst ? [button, checklist(3)] : [checklist(3), button]),
    ],
    {
      gap: 9,
      tone: options.featured ? 'featured' : options.muted ? 'muted' : 'paper',
    },
  )
}

const pricingIntro = () => intro({ align: 'center', lines: 2 })

/* The plan matrix comparator-grid and comparator-table share: a label column,
 * three plan columns with the middle one highlighted, and check or value cells. */
const comparison = ({ footer, rows = 4 }: { footer: boolean; rows?: number }): ThumbnailNode => {
  const cell = (column: number, line: number) =>
    column === 0 ? caption({ width: 0.6 }) : line % 2 === 0 ? check() : caption({ width: 0.4 })
  const header = row(
    [spacer(), ...[0, 1, 2].map(() => stack([label({ width: 0.5 }), price()], { gap: 6 }))],
    { align: 'center' },
  )
  const body = Array.from({ length: rows }, (_, line) =>
    row(
      [0, 1, 2, 3].map((column) => place(column === 0 ? 'start' : 'center', cell(column, line))),
      { align: 'center' },
    ),
  )
  const actions = row(
    [
      spacer(),
      buttons(1, { primary: false, width: 44 }),
      buttons(1, { width: 44 }),
      buttons(1, { primary: false, width: 44 }),
    ],
    {
      align: 'center',
    },
  )

  return card([header, divider(), ...body, ...(footer ? [actions] : [])], { gap: 10 })
}

const linkColumn = () =>
  stack([label({ width: 0.55 }), ...[0.7, 0.5, 0.6, 0.45].map((width) => caption({ width }))], {
    gap: 6,
  })

const footerLinks = (count: number) =>
  row(
    Array.from({ length: count }, () => caption({ width: 0.8 })),
    { gap: 8 },
  )

/* The scaffold's picture. component-template/config.ts is an eyebrow, a headline,
 * a lead, and links, and `new` gives this recipe to a block that starts a family. */
export const templateThumbnailRecipe: ThumbnailRecipe = stack(
  [intro({ copy: 2, lines: 2 }), buttons(2)],
  { gap: 14 },
)

export const blockThumbnailRecipes: Record<string, ThumbnailRecipe> = {
  'call-to-action-boxed': narrow(
    0.82,
    card([heading(1, { width: 0.66 }), text(2, { width: 0.7 }), buttons(2)], {
      align: 'center',
      gap: 12,
      pad: 24,
    }),
  ),
  'call-to-action-centered': centred([
    heading(1, { size: 'lg', width: 0.7 }),
    text(2, { width: 0.62 }),
    buttons(2),
  ]),
  'call-to-action-signup': centred([
    heading(1, { size: 'lg', width: 0.5 }),
    text(2, { width: 0.62 }),
    narrow(0.55, inlineForm()),
  ]),
  'call-to-action-split': row(
    [
      stack([heading(2, { size: 'lg' }), text(2)], { gap: 10 }),
      stack([buttons(2), caption({ width: 0.45 })], { align: 'end', gap: 8 }),
    ],
    { gap: 24, valign: 'center', weights: [3, 2] },
  ),
  'collection-query': stack(
    [
      chips(3, { filled: true }),
      grid(
        [0, 1, 2].map(() =>
          card([media({ height: 44 }), chips(1, { width: 40 }), label({ width: 0.7 }), text(2)], {
            gap: 7,
            pad: 8,
          }),
        ),
        { columns: 3 },
      ),
      row([
        caption({ width: 0.4 }),
        place('center', caption({ width: 0.5 })),
        place('end', caption({ width: 0.3 })),
      ]),
    ],
    { gap: 12 },
  ),
  'comparator-grid': centred([
    intro({ align: 'center', withEyebrow: false }),
    comparison({ footer: true }),
  ]),
  'comparator-stack': centred([
    intro({ align: 'center', withEyebrow: false }),
    stack(
      ['paper', 'ring', 'paper'].map((tone) =>
        card(
          [
            row(
              [
                stack(
                  [
                    label({ width: 0.4 }),
                    price(),
                    buttons(1, { primary: tone === 'ring', width: 52 }),
                  ],
                  {
                    gap: 7,
                  },
                ),
                checklist(3),
              ],
              { align: 'start', gap: 20 },
            ),
          ],
          { align: 'start', tone: tone as 'paper' | 'ring' },
        ),
      ),
      { gap: 8 },
    ),
  ]),
  'comparator-table': stack(
    [intro({ withEyebrow: false }), comparison({ footer: false, rows: 5 })],
    { gap: 14 },
  ),
  'contact-channels': stack(
    [
      intro(),
      grid(
        [0, 1, 2, 3, 4, 5].map(() =>
          card([label({ width: 0.4 }), caption({ width: 0.7 }), text(1)], { gap: 6, pad: 10 }),
        ),
        { columns: 3, gap: 8 },
      ),
    ],
    { gap: 14 },
  ),
  'contact-form-basic': row(
    [
      stack([eyebrow(), heading(2, { size: 'lg' }), text(2), caption({ width: 0.4 })], { gap: 10 }),
      stack([field(), field(), field(), field({ rows: 3 }), wideButton()], { gap: 8 }),
    ],
    { gap: 28 },
  ),
  'contact-routing-form': stack(
    [
      intro(),
      row(
        [
          stack([textCard(2), textCard(1)], { gap: 8 }),
          card(
            [
              label({ width: 0.5 }),
              text(1),
              grid([field(), field(), field(), field()], { columns: 2, gap: 8 }),
              field({ rows: 2 }),
              buttons(1, { width: 52 }),
            ],
            { gap: 8 },
          ),
        ],
        { gap: 12, weights: [2, 3] },
      ),
    ],
    { gap: 14 },
  ),
  'content-columns': row(
    [
      stack([eyebrow(), heading(3, { size: 'lg', width: 0.9 })], { gap: 10 }),
      stack([text(3), text(3), buttons(1)], { gap: 12 }),
    ],
    { gap: 28, valign: 'center' },
  ),
  'content-community': centred([intro({ align: 'center', copy: 2 }), avatars(8, { size: 20 })]),
  'content-feature-media': row(
    [
      stack(
        [
          intro({ lines: 2, copy: 2 }),
          row([item(2, { lead: icon({ size: 12 }) }), item(2, { lead: icon({ size: 12 }) })]),
        ],
        { gap: 14 },
      ),
      media(),
    ],
    { gap: 24 },
  ),
  'content-feature-split': row(
    [
      media(),
      stack(
        [
          intro({ lines: 2, copy: 2 }),
          row([item(2, { lead: icon({ size: 12 }) }), item(2, { lead: icon({ size: 12 }) })]),
        ],
        { gap: 14 },
      ),
    ],
    { gap: 24 },
  ),
  'content-image-frame': centred([
    intro({ align: 'center' }),
    narrow(0.86, media({ height: 120, kind: 'frame' })),
  ]),
  'content-image-lead': stack(
    [
      media({ height: 110 }),
      row(
        [
          stack([eyebrow(), heading(3, { size: 'lg', width: 0.85 })], { gap: 8 }),
          stack([text(3), buttons(1)], { gap: 12 }),
        ],
        { gap: 24 },
      ),
    ],
    { gap: 16 },
  ),
  'content-list': row(
    [
      stack([eyebrow(), heading(2, { size: 'lg', width: 0.75 })], { gap: 10 }),
      stack([item(2), item(2), item(2)], { gap: 14 }),
    ],
    { gap: 28, valign: 'center' },
  ),
  'content-list-columns': stack(
    [
      eyebrow(),
      heading(1, { size: 'lg', width: 0.62 }),
      divider(),
      row([item(2), item(2)], { gap: 24 }),
    ],
    { gap: 12 },
  ),
  'content-list-icons': stack(
    [
      intro({ size: 'lg' }),
      divider(),
      row(
        [0, 1, 2].map(() => item(2, { lead: icon({ size: 12 }) })),
        { gap: 20 },
      ),
    ],
    { gap: 14 },
  ),
  'content-quote': row(
    [
      media(),
      stack(
        [
          intro({ lines: 2, copy: 2 }),
          quoted(stack([text(3), label({ width: 0.4 }), caption({ width: 0.3 })], { gap: 7 })),
        ],
        { gap: 14 },
      ),
    ],
    { gap: 24 },
  ),
  'content-rows': stack(
    [
      intro(),
      row([media({ height: 70 }), stack([label({ width: 0.5 }), text(2)], { gap: 7 })], {
        gap: 18,
        valign: 'center',
      }),
      row([media({ height: 70 }), stack([label({ width: 0.5 }), text(2)], { gap: 7 })], {
        gap: 18,
        valign: 'center',
      }),
    ],
    { gap: 14 },
  ),
  'content-showcase': stack(
    [
      intro({ align: 'center', lines: 2 }),
      media({ height: 100 }),
      row(
        [0, 1, 2, 3].map(() => item(1, { lead: icon({ size: 10 }) })),
        { gap: 14 },
      ),
    ],
    { gap: 14 },
  ),
  'content-split-rows': stack(
    [
      intro(),
      row([media({ height: 64 }), stack([label({ width: 0.5 }), text(2)], { gap: 7 })], {
        gap: 18,
        valign: 'center',
      }),
      row([stack([label({ width: 0.5 }), text(2)], { gap: 7 }), media({ height: 64 })], {
        gap: 18,
        valign: 'center',
      }),
    ],
    { gap: 14 },
  ),
  'content-stats': stack(
    [
      intro(),
      row(
        [0, 1, 2].map(() => item(2, { lead: icon({ size: 12 }) })),
        { gap: 20 },
      ),
      divider(),
      checklist(4, { mark: 'figure', width: 0.4 }),
    ],
    { gap: 14 },
  ),
  'embed-basic': stack([media({ height: 170, kind: 'video' }), caption({ width: 0.45 })], {
    gap: 10,
  }),
  'faq-accordion': centred([
    intro({ align: 'center' }),
    place('start', stack([answer(), answer(), answer(), answer()], { gap: 10 })),
    buttons(1, { primary: false, width: 70 }),
  ]),
  'faq-card': centred([
    intro({ align: 'center' }),
    place('start', card([answer(), answer(), answer()], { gap: 10 })),
    buttons(1, { primary: false, width: 70 }),
  ]),
  'faq-grid': centred([
    intro({ align: 'center' }),
    place(
      'start',
      grid(
        [0, 1, 2, 3, 4, 5].map(() => textCard(2)),
        { columns: 2, gap: 8 },
      ),
    ),
  ]),
  'faq-grouped': centred([
    intro({ align: 'center' }),
    place(
      'start',
      stack(
        [0, 1].map(() =>
          stack(
            [
              row([icon({ size: 10 }), caption({ width: 0.25 })], {
                gap: 6,
                valign: 'center',
                weights: [{ fixed: 10 }, 1],
              }),
              item(1),
              item(1),
            ],
            { gap: 10 },
          ),
        ),
        { gap: 16 },
      ),
    ),
  ]),
  'faq-icons': centred([
    intro({ align: 'center' }),
    place(
      'start',
      stack(
        [0, 1, 2].map(() =>
          stack(
            [
              row([icon({ size: 12 }), label({ width: 0.4 })], {
                gap: 8,
                valign: 'center',
                weights: [{ fixed: 12 }, 1],
              }),
              text(2),
              divider(),
            ],
            { gap: 7 },
          ),
        ),
        { gap: 10 },
      ),
    ),
  ]),
  'faq-split': row(
    [
      stack([eyebrow(), heading(1, { width: 0.9 }), text(3), buttons(1, { primary: false })], {
        gap: 10,
      }),
      stack([answer(), answer(), answer(), answer()], { gap: 10 }),
    ],
    { gap: 28, weights: [2, 3] },
  ),
  'feature-accordion': stack(
    [
      intro({ lines: 2 }),
      row(
        [
          stack(
            [
              stack([label({ width: 0.5 }), text(2)], { gap: 6 }),
              divider(),
              row([label({ width: 0.4 }), disclosure()]),
              divider(),
              row([label({ width: 0.35 }), disclosure()]),
            ],
            { gap: 9 },
          ),
          media({ kind: 'app' }),
        ],
        { gap: 18, weights: [2, 3] },
      ),
      buttons(1),
    ],
    { gap: 14 },
  ),
  'feature-bento': stack(
    [
      intro(),
      row([textCard(4), stack([textCard(2), textCard(2)], { gap: 8 })], {
        gap: 8,
        weights: [2, 1],
      }),
      row([textCard(1), spacer()], { gap: 8, weights: [1, 2] }),
      buttons(1, { primary: false }),
    ],
    { gap: 10 },
  ),
  'feature-cards-media': stack(
    [
      intro({ lines: 2 }),
      row(
        [0, 1].map(() =>
          card([media({ height: 70, kind: 'tiles' }), item(2, { lead: icon({ size: 12 }) })], {
            gap: 10,
            pad: 8,
          }),
        ),
        { gap: 10 },
      ),
      buttons(1, { primary: false }),
    ],
    { gap: 12 },
  ),
  'feature-grid-basic': stack(
    [
      intro(),
      row([textCard(3), textCard(3), textCard(3)], { gap: 10 }),
      buttons(1, { primary: false }),
    ],
    { gap: 14 },
  ),
  'feature-icon-grid': stack(
    [
      intro({ lines: 2 }),
      grid(
        [0, 1, 2, 3, 4, 5].map(() =>
          card([place('center', icon({ size: 18 })), item(1)], { gap: 8, pad: 10 }),
        ),
        { columns: 3, gap: 8 },
      ),
      buttons(1, { primary: false }),
    ],
    { gap: 12 },
  ),
  'feature-split': row(
    [
      stack([eyebrow(), heading(3, { size: 'lg', width: 0.9 }), text(2), buttons(1)], { gap: 10 }),
      stack([textCard(2), textCard(2), textCard(2)], { gap: 8 }),
    ],
    { gap: 24, valign: 'center' },
  ),
  'feature-steps': stack(
    [
      intro(),
      row(
        [0, 1, 2].map(() => textCard(3, stepBadge())),
        { gap: 10 },
      ),
      buttons(1),
    ],
    { gap: 14 },
  ),
  'footer-centered': centred(
    [
      label({ width: 0.14 }),
      text(1, { width: 0.4 }),
      narrow(0.5, footerLinks(5)),
      divider(),
      row([caption({ width: 0.4 }), place('end', narrow(0.8, footerLinks(3)))]),
    ],
    12,
  ),
  'footer-columns': stack(
    [
      row(
        [
          stack([label({ width: 0.4 }), text(2)], { gap: 8 }),
          linkColumn(),
          linkColumn(),
          linkColumn(),
        ],
        { gap: 20, weights: [3, 2, 2, 2] },
      ),
      divider(),
      caption({ width: 0.22 }),
    ],
    { gap: 16 },
  ),
  'footer-simple': stack(
    [
      row([label({ width: 0.3 }), place('end', narrow(0.9, footerLinks(6)))], {
        valign: 'center',
        weights: [1, 2],
      }),
      divider(),
      caption({ width: 0.3 }),
    ],
    { gap: 14 },
  ),
  'hero-aurora': {
    backdrop: 'aurora',
    body: centred(
      [
        intro({ align: 'center', copy: 2, lines: 2, size: 'lg' }),
        buttons(2),
        narrow(0.5, row([stat(), stat(), stat()], { align: 'center', gap: 10 })),
        narrow(0.72, media({ height: 92, kind: 'chart' })),
      ],
      12,
    ),
  },
  'hero-basic': stack([intro({ copy: 2, lines: 2, size: 'lg' }), buttons(2), chips(3)], {
    gap: 14,
  }),
  'hero-kinetic': stack(
    [
      row([eyebrow(), stack([spacer(6), divider()])], { gap: 8, weights: [1, 4] }),
      heading(2, { size: 'xl', width: 0.72 }),
      row([text(3), place('end', buttons(2))], { valign: 'center' }),
      media({ height: 90, kind: 'video' }),
    ],
    { gap: 12 },
  ),
  'hero-product-tilt': centred(
    [
      intro({ align: 'center', lines: 2, size: 'lg' }),
      buttons(2),
      chips(3),
      narrow(0.9, tilted(media({ height: 110, kind: 'app' }))),
    ],
    12,
  ),
  'hero-split': row(
    [
      stack(
        [
          intro({ copy: 2, lines: 3, size: 'lg' }),
          buttons(2),
          divider(),
          checklist(3, { mark: 'dot' }),
        ],
        { gap: 12 },
      ),
      media(),
    ],
    { gap: 24, weights: [5, 4] },
  ),
  'hero-video': {
    backdrop: 'video',
    body: stack([intro({ copy: 2, lines: 2, size: 'lg' }), buttons(2), chips(3)], { gap: 14 }),
  },
  'integration-cluster': centred([
    stack([tiles(6, { featured: true }), tiles(1)], { align: 'center', gap: 8 }),
    heading(1, { width: 0.45 }),
    text(2, { width: 0.5 }),
    buttons(1, { primary: false, width: 76 }),
  ]),
  'integration-connect': centred([
    row(
      [
        stack([tiles(1), tiles(1), tiles(1)], { align: 'start', gap: 10 }),
        stack([spacer(18), icon({ featured: true, size: 26 })], { align: 'center' }),
        stack([tiles(1), tiles(1), tiles(1)], { align: 'end', gap: 10 }),
      ],
      { gap: 24, valign: 'center' },
    ),
    heading(1, { width: 0.5 }),
    text(2, { width: 0.5 }),
  ]),
  'integration-grid': centred([
    heading(1, { width: 0.6 }),
    text(1, { width: 0.6 }),
    grid(
      [0, 1, 2, 3, 4, 5].map(() =>
        card([icon({ size: 14 }), label({ width: 0.4 }), text(2), caption({ width: 0.3 })], {
          align: 'start',
          gap: 6,
          pad: 10,
        }),
      ),
      { columns: 3, gap: 8 },
    ),
  ]),
  'integration-list': centred([
    heading(1, { width: 0.5 }),
    text(1, { width: 0.55 }),
    narrow(
      0.82,
      card(
        [0, 1, 2, 3].map((index) =>
          stack(
            [
              row(
                [
                  icon({ size: 14 }),
                  stack([label({ width: 0.3 }), text(1, { width: 0.85 })], { gap: 5 }),
                  disclosure(),
                ],
                {
                  align: 'start',
                  gap: 10,
                  valign: 'center',
                  weights: [{ fixed: 14 }, 1, { fixed: 8 }],
                },
              ),
              ...(index < 3 ? [divider()] : []),
            ],
            { gap: 8 },
          ),
        ),
        { align: 'start', gap: 8 },
      ),
    ),
  ]),
  'integration-marquee': centred([
    stack([tiles(9), tiles(9, { featured: true }), tiles(9)], { align: 'center', gap: 8 }),
    heading(2, { width: 0.4 }),
    text(1, { width: 0.55 }),
  ]),
  'integration-orbit': centred([orbit(), heading(1, { width: 0.42 }), text(2, { width: 0.45 })]),
  'integration-split': row(
    [
      stack([tiles(5, { featured: true }), tiles(2)], { align: 'center', gap: 8 }),
      stack([heading(1, { width: 0.9 }), text(2), buttons(1, { width: 76 })], { gap: 10 }),
    ],
    { gap: 24, valign: 'center' },
  ),
  'integration-testimonial': row(
    [
      stack(
        [
          heading(2, { size: 'lg', width: 0.7 }),
          text(2),
          quoted(stack([text(2), person(12)], { gap: 8 })),
        ],
        { gap: 12 },
      ),
      grid(
        [0, 1, 2, 3, 4, 5].map(() =>
          card([icon({ size: 12 }), label({ width: 0.5 }), text(2)], { gap: 6, pad: 8 }),
        ),
        { columns: 2, gap: 8 },
      ),
    ],
    { gap: 24, valign: 'center' },
  ),
  'logo-cloud-grid': centred([heading(1, { size: 'sm', width: 0.45 }), logos(6)], 20),
  'logo-cloud-hover': centred(
    [
      caption({ width: 0.35 }),
      grid(
        [0, 1, 2, 3, 4, 5, 6, 7].map(() => place('center', logos(1, { spread: false }))),
        {
          columns: 4,
          gap: 18,
        },
      ),
    ],
    20,
  ),
  'logo-cloud-inline': stack([caption({ width: 0.2 }), narrow(0.85, logos(6))], { gap: 14 }),
  'logo-cloud-inline-wrap': row([caption({ width: 0.8 }), logos(6)], {
    gap: 18,
    valign: 'center',
    weights: [1, 6],
  }),
  'logo-cloud-marquee': row([text(2, { width: 0.7 }), logos(4)], {
    gap: 18,
    valign: 'center',
    weights: [1, 5],
  }),
  'pricing-cards': stack(
    [pricingIntro(), row([plan(), plan({ featured: true }), plan()], { gap: 10 })],
    { gap: 18 },
  ),
  'pricing-cards-cta': stack(
    [
      pricingIntro(),
      row(
        [
          plan({ buttonFirst: true }),
          plan({ buttonFirst: true, featured: true }),
          plan({ buttonFirst: true }),
        ],
        { gap: 10 },
      ),
    ],
    { gap: 18 },
  ),
  'pricing-cards-muted': stack(
    [
      pricingIntro(),
      row([plan({ muted: true }), plan({ featured: true }), plan({ muted: true })], { gap: 10 }),
    ],
    { gap: 18 },
  ),
  'pricing-enterprise': stack(
    [
      pricingIntro(),
      card(
        [
          row(
            [
              stack(
                [label({ width: 0.5 }), caption({ width: 0.6 }), price({ size: 'lg' }), buttons(1)],
                {
                  align: 'center',
                  gap: 9,
                },
              ),
              stack([checklist(4), logos(3, { spread: false })], { align: 'start', gap: 14 }),
            ],
            { gap: 20, valign: 'center' },
          ),
        ],
        { pad: 18 },
      ),
    ],
    { gap: 16 },
  ),
  'pricing-split': stack(
    [
      pricingIntro(),
      row(
        [
          card([label({ width: 0.3 }), price(), wideButton({ primary: false }), checklist(3)], {
            gap: 9,
          }),
          card(
            [
              row(
                [
                  stack(
                    [
                      row([label({ width: 0.6 }), chips(1, { width: 30 })], {
                        gap: 4,
                        valign: 'center',
                      }),
                      price(),
                      text(2),
                      wideButton(),
                    ],
                    { gap: 9 },
                  ),
                  checklist(6),
                ],
                { gap: 16 },
              ),
            ],
            { tone: 'featured' },
          ),
        ],
        { gap: 10, weights: [1, 2] },
      ),
    ],
    { gap: 16 },
  ),
  'stats-card': centred([
    eyebrow(),
    heading(1, { width: 0.55 }),
    card([row([stat(), stat(), stat()], { align: 'center', gap: 16 })], {
      align: 'center',
      pad: 16,
    }),
  ]),
  'stats-grid': stack(
    [intro({ copy: 2, size: 'lg' }), divider(), row([stat(), stat(), stat(), stat()], { gap: 16 })],
    { gap: 14 },
  ),
  'stats-inline': stack(
    [
      intro({ copy: 2 }),
      row(
        [0, 1, 2].map(() =>
          stack([divider(), checklist(1, { mark: 'figure', width: 0.9 })], { gap: 10 }),
        ),
        { gap: 16 },
      ),
    ],
    { gap: 16 },
  ),
  'stats-proof': row(
    [
      stack(
        [
          intro({ copy: 3, lines: 3, size: 'lg' }),
          grid(
            [
              stat({ size: 'lg' }),
              stat({ size: 'lg' }),
              stat({ size: 'lg' }),
              stat({ size: 'lg' }),
            ],
            {
              columns: 2,
              gap: 14,
            },
          ),
        ],
        { gap: 16 },
      ),
      card([caption({ width: 0.3 }), heading(4, { size: 'sm', width: 0.9 }), person(12)], {
        gap: 12,
        pad: 14,
      }),
    ],
    { gap: 20, weights: [3, 2] },
  ),
  'team-bios': stack(
    [
      intro({ copy: 2 }),
      grid(
        [0, 1, 2, 3].map(() => card([person(18), text(2), caption({ width: 0.2 })], { gap: 8 })),
        { columns: 2, gap: 8 },
      ),
    ],
    { gap: 14 },
  ),
  'team-grid': stack(
    [
      row([stack([eyebrow(), heading(1, { width: 0.6 })], { gap: 8 }), text(2)], {
        gap: 24,
        valign: 'center',
      }),
      row(
        [0, 1, 2, 3].map(() => stack([media({ ratio: 0.8 }), caption({ width: 0.5 })], { gap: 6 })),
        { gap: 10 },
      ),
    ],
    { gap: 16 },
  ),
  'team-roster': stack(
    [
      eyebrow(),
      heading(1, { width: 0.5 }),
      ...[0, 1].flatMap(() => [
        stack([caption({ width: 0.15 }), divider()], { gap: 6 }),
        row(
          [0, 1, 2, 3].map(() =>
            stack([avatars(1, { size: 24 }), label({ width: 0.6 }), caption({ width: 0.5 })], {
              align: 'center',
              gap: 5,
            }),
          ),
          { gap: 12 },
        ),
      ]),
    ],
    { gap: 10 },
  ),
  'testimonials-bento': stack(
    [
      intro({ copy: 0 }),
      row(
        [
          card([caption({ width: 0.2 }), text(6), spacer(6), person()], { gap: 8 }),
          grid(
            [
              card([text(3), person()], { gap: 8, pad: 8 }),
              card([text(3), person()], { gap: 8, pad: 8 }),
              card([text(3), person()], { gap: 8, pad: 8 }),
            ],
            { columns: 2, gap: 8 },
          ),
        ],
        { gap: 8, weights: [4, 5] },
      ),
    ],
    { gap: 14 },
  ),
  'testimonials-grid': stack(
    [
      intro(),
      row(
        [0, 1, 2].map(() => card([text(4), person()], { gap: 10 })),
        { gap: 10 },
      ),
    ],
    { gap: 16 },
  ),
  'testimonials-quote': narrow(
    0.72,
    quoted(stack([heading(3, { size: 'sm', width: 0.95 }), person(12)], { gap: 14 })),
  ),
  'testimonials-rating': stack(
    [
      heading(1, { width: 0.5 }),
      row(
        [5, 4, 5].map((rating) => card([stars({ rating }), text(4), person()], { gap: 10 })),
        { gap: 10 },
      ),
    ],
    { gap: 18 },
  ),
  'testimonials-spotlight': centred([
    quoteMark(),
    heading(4, { size: 'sm', width: 0.62 }),
    avatars(1, { size: 18 }),
    stack([label({ width: 0.16 }), caption({ width: 0.2 })], { align: 'center', gap: 5 }),
  ]),
  'testimonials-wall': centred([
    heading(1, { width: 0.4 }),
    text(1, { width: 0.5 }),
    grid(
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() =>
        card([person(12), text(2)], { align: 'start', gap: 8, pad: 8 }),
      ),
      { columns: 3, gap: 8 },
    ),
  ]),
}
