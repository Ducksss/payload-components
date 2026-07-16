# Landing Hero Editorial Compression

## Goal

Refine the current centered landing hero so its first viewport feels calmer,
more deliberate, and more premium while preserving the proof-led product story.
The visitor should still understand the promise, copy the install command, choose
a primary action, and see the end-to-end install result without scrolling through
a redesigned information architecture.

## Direction

Use editorial compression rather than a structural redesign. Keep the centered
headline and dark install-replay frame, but reduce redundant interface chrome and
tighten the scale and spacing between the message, actions, and proof.

The visual hierarchy remains:

1. Open-source registry eyebrow.
2. “Install Payload blocks — wired, not pasted.” headline.
3. One-sentence explanation.
4. Copyable install command.
5. Primary and secondary actions.
6. One catalog-discovery link.
7. Animated install proof.

## Hero Message and Actions

- Preserve all test-pinned copy, including the headline, subheadline, primary
  install command, and “Get started” label.
- Keep “Get started” as the only solid primary action.
- Keep the GitHub action as a bordered secondary action, but remove its nested
  “Open source” badge. The eyebrow and repository context already communicate
  that message.
- Retain the restrained shine/twinkle treatment on the GitHub action so the
  existing branded moment and its token contract remain intact; simplifying the
  label and badge is sufficient to reduce its visual weight.
- Keep “Browse the components” as the sole tertiary link.
- Remove “See what add actually wires” from the hero because the proof frame
  immediately demonstrates the same idea.
- Update `src/lib/site.ts` with the visible tertiary-link set so the site data and
  rendered interface do not drift.

## Scale and Spacing

- Change the headline clamp maximum from `6rem` to `5.5rem` and its tracking from
  `-0.085em` to `-0.075em`, preserving the sans/italic-serif contrast.
- Change the message stack from `gap-6` to `gap-5` so related controls read as
  one decision area.
- Change the outer stack from `gap-12 lg:gap-16` to `gap-10 lg:gap-12`; change
  its vertical padding from `py-12 sm:py-16 lg:py-24` to
  `py-10 sm:py-14 lg:py-16`. This brings the frame into the first viewport while
  retaining a full spacing step after the tertiary link.
- Constrain the proof frame from `max-w-6xl` to `max-w-5xl`.
- Change the proof panels from `lg:p-7` to `lg:p-6` and the large command/file
  cards from `sm:p-5` to `sm:p-4`. Preserve the content, two-column relationship,
  animation timing, and factual install output.
- Keep the emerald bloom and grid atmosphere unchanged; the problem is density,
  not the background language.

## Responsive Behavior

- Desktop keeps a centered message and two-column proof frame.
- Tablet retains the existing breakpoint behavior and must not force the two
  proof columns into an unreadably narrow width.
- Mobile keeps full-width stacked CTA buttons, a horizontally scrollable command,
  and vertically stacked proof panels.
- The removed badge and tertiary link should reduce wrapping pressure on narrow
  screens.
- No breakpoint may introduce horizontal page overflow.

## Accessibility and Behavior

- Preserve the existing accessible H1 name and heading level.
- Preserve keyboard access to the install command and the existing copy-button
  behavior.
- Preserve descriptive GitHub link text and external-link attributes.
- Preserve reduced-motion behavior: the terminal replay must expose its final
  transcript without animation.
- Do not change install-replay data, timings, analytics, routes, or the target
  `hero-basic` demo twin.

## Files in Scope

- `src/components/site/sections/HeroSection.tsx`
- `src/components/site/HeroProductFrame.tsx`
- `src/lib/site.ts`
- Focused landing-page assertions in `tests/e2e/frontend.e2e.spec.ts`
- Existing landing visual baselines only when the intended visual change requires
  them

No component registry source, Payload target code, docs copy, CLI behavior, or
other landing sections are in scope.

## Verification

Use a regression-first change for the simplified action hierarchy, then verify:

- The hero renders one tertiary link and no nested “Open source” CTA badge.
- The H1, install command, first Copy button, primary CTA, and GitHub action remain
  visible and functional.
- The install replay retains its final reduced-motion transcript.
- The homepage has no horizontal overflow.
- Desktop and mobile screenshots show a tighter first viewport with no clipping,
  overlap, unreadable wrapping, or framework overlay.
- Console output contains no relevant application warnings or errors.
- Lint, TypeScript, focused integration tests, and the relevant Playwright tests
  pass before completion.
