# Landing Hero Editorial Compression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the centered landing hero calmer and more compact while preserving its copyable install command, primary conversion path, branded GitHub action, and end-to-end install proof.

**Architecture:** Keep the existing `HeroSection` and `HeroProductFrame` boundaries. Simplify the action data and markup in the section, then adjust only named Tailwind scale and spacing classes in the section and proof frame; use Playwright assertions to lock the action hierarchy and measurable desktop composition.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest, Playwright.

## Global Constraints

- Preserve `heroHeadline`, `heroSubheadline`, `primaryInstallCommand`, and `heroPrimaryCta` copy.
- Preserve the first-copy-button contract and keyboard-scrollable install command.
- Preserve GitHub external-link attributes and the existing `shine-cta`/`cta-twinkle` treatment.
- Preserve install-replay content, timing, reduced-motion final state, and `HeroBasicDemo` twin.
- Keep the public site forced light and introduce no horizontal overflow.
- Do not change registry source, Payload target code, CLI behavior, docs copy, analytics, routes, or other landing sections.

---

## File Map

- `src/lib/site.ts`: owns the visible hero tertiary-link data.
- `src/components/site/sections/HeroSection.tsx`: owns hero hierarchy, actions, headline scale, and outer rhythm.
- `src/components/site/HeroProductFrame.tsx`: owns proof-frame width and internal density.
- `tests/e2e/frontend.e2e.spec.ts`: locks action hierarchy, desktop composition, copy behavior, reduced motion, overflow, and visual baselines.
- `tests/e2e/frontend.e2e.spec.ts-snapshots/landing-home-*-chromium-darwin.png`: local-platform proof of the intended full-page visual change.

### Task 1: Simplify the hero action hierarchy

**Files:**

- Modify: `tests/e2e/frontend.e2e.spec.ts:3-13,92`
- Modify: `src/lib/site.ts:56-59`
- Modify: `src/components/site/sections/HeroSection.tsx:3,22-23,77-118`

**Interfaces:**

- Consumes: `githubRepoUrl: string`, `heroPrimaryCta: { href: string; label: string }`, and `heroTertiaryLinks` from `src/lib/site.ts`.
- Produces: `heroTertiaryLinks` as a readonly one-item tuple containing `{ href: '/components', label: 'Browse the components' }`; visible hero links for Get started, Star on GitHub, and Browse the components.

- [ ] **Step 1: Write the failing Playwright regression**

Add the data imports:

```ts
import {
  catalogTitle,
  githubRepoUrl,
  heroHeadline,
  heroPrimaryCta,
  heroTertiaryLinks,
  homeMetadataDescription,
  homeMetadataTitle,
  componentEntries,
  landingSections,
  primaryInstallCommand,
  terminalDemoLines,
  upcomingComponents,
} from '../../src/lib/site'
```

Add this test inside `test.describe('Light shadcn frontend', ...)` immediately before the existing light-token homepage test:

```ts
test('keeps the landing hero action hierarchy focused', async ({ page }) => {
  await page.goto(baseURL)

  const hero = page.locator('.hero-shell')
  await expect(hero.getByRole('link', { name: heroPrimaryCta.label, exact: true })).toBeVisible()
  await expect(hero.locator(`a[href="${githubRepoUrl}"]`)).toHaveAccessibleName('Star on GitHub')
  await expect(
    hero.getByRole('link', { name: heroTertiaryLinks[0].label, exact: true }),
  ).toBeVisible()
  await expect(hero.getByText('Open source', { exact: true })).toHaveCount(0)
  await expect(
    hero.getByRole('link', { name: 'See what add actually wires', exact: true }),
  ).toHaveCount(0)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "keeps the landing hero action hierarchy focused"
```

Expected: FAIL because the existing nested `Open source` badge has count 1 (and the wiring link is still present).

- [ ] **Step 3: Implement the minimal hierarchy change**

Change the site data to:

```ts
export const heroTertiaryLinks = [{ href: '/components', label: 'Browse the components' }] as const
```

In `HeroSection.tsx`, remove `Star` from the Lucide import and consume only the catalog link:

```ts
import { ArrowRight, Github, Sparkles } from 'lucide-react'

// ...

const [browseLink] = heroTertiaryLinks
```

Keep the first three decorative `cta-twinkle` children, GitHub icon, and text, but remove the nested badge after `Star on GitHub`:

```tsx
<Github className="size-4" aria-hidden="true" />
Star on GitHub
```

Reduce the tertiary row to the one data-backed link:

```tsx
<div
  className="hero-reveal flex items-center justify-center text-sm text-muted-foreground"
  style={{ animationDelay: '230ms' }}
>
  <Link
    href={browseLink.href}
    className="inline-flex items-center gap-1.5 font-medium text-foreground transition-opacity hover:opacity-75"
  >
    <Sparkles className="size-3.5" aria-hidden="true" />
    {browseLink.label}
  </Link>
</div>
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "keeps the landing hero action hierarchy focused"
```

Expected: 1 passed, 0 failed.

- [ ] **Step 5: Commit the independently reviewable hierarchy change**

```bash
git add src/lib/site.ts src/components/site/sections/HeroSection.tsx tests/e2e/frontend.e2e.spec.ts
git commit -F - <<'EOF'
frontend(refactor): focus landing hero actions

Summary:
- Remove redundant open-source and wiring calls from the hero.
- Lock the simplified action hierarchy with a Playwright regression.

Rationale:
- The eyebrow and proof frame already communicate those messages.
- Fewer competing actions make the primary path easier to scan.

Tests:
- pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "keeps the landing hero action hierarchy focused"
EOF
```

### Task 2: Compress the desktop hero composition

**Files:**

- Modify: `tests/e2e/frontend.e2e.spec.ts` after the hierarchy regression
- Modify: `src/components/site/sections/HeroSection.tsx:29-40`
- Modify: `src/components/site/HeroProductFrame.tsx:73,95,108,191,232`

**Interfaces:**

- Consumes: `.hero-shell`, its direct `.container`, the accessible H1, and `.product-frame` as stable landing-page selectors.
- Produces: desktop H1 size at most 88px, proof-frame width at most 1024px, outer stack gap of 48px, and desktop top padding of 64px at a 1440px viewport.

- [ ] **Step 1: Write the failing desktop-composition regression**

Add this test after the hierarchy regression:

```ts
test('keeps the desktop hero composition compact', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 })
  await page.goto(baseURL)

  const headline = page.getByRole('heading', { level: 1, name: heroHeadline })
  const heroStack = page.locator('.hero-shell > .container')
  const proof = page.locator('.product-frame')

  await expect(headline).toBeVisible()
  await expect(proof).toBeVisible()

  const headlineSize = await headline.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )
  const stackMetrics = await heroStack.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      gap: Number.parseFloat(styles.rowGap),
      paddingTop: Number.parseFloat(styles.paddingTop),
    }
  })
  const proofWidth = await proof.evaluate((element) => element.getBoundingClientRect().width)

  expect(headlineSize).toBeLessThanOrEqual(88.1)
  expect(stackMetrics).toEqual({ gap: 48, paddingTop: 64 })
  expect(proofWidth).toBeLessThanOrEqual(1024.1)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "keeps the desktop hero composition compact"
```

Expected: FAIL with the current 96px headline, 64px outer gap, 96px desktop padding, and/or 1152px proof width.

- [ ] **Step 3: Implement the exact section scale and rhythm**

In `HeroSection.tsx`, change the two container class strings to:

```tsx
<div className="container relative flex flex-col gap-10 py-10 sm:py-14 lg:gap-12 lg:py-16">
  <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
```

Change the H1 class string to:

```tsx
className =
  'hero-reveal max-w-5xl text-balance text-[clamp(2.6rem,8.4vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.075em] text-foreground'
```

- [ ] **Step 4: Implement the exact proof-frame density**

In `HeroProductFrame.tsx`:

- Replace `max-w-6xl` with `max-w-5xl` on `.product-frame`.
- Replace both `lg:p-7` utilities with `lg:p-6`.
- Replace `p-4 sm:p-5` with `p-4` on the command card.
- Replace `p-4 sm:p-5` with `p-4` on the installed-files card.

- [ ] **Step 5: Run both focused regressions and verify GREEN**

Run:

```bash
pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "keeps the landing hero action hierarchy focused|keeps the desktop hero composition compact"
```

Expected: 2 passed, 0 failed.

- [ ] **Step 6: Commit the independently reviewable composition change**

```bash
git add src/components/site/sections/HeroSection.tsx src/components/site/HeroProductFrame.tsx tests/e2e/frontend.e2e.spec.ts
git commit -F - <<'EOF'
frontend(style): compress landing hero composition

Summary:
- Tighten the hero headline, outer rhythm, and proof-frame scale.
- Add measurable desktop composition coverage.

Rationale:
- The smaller proof surface enters the first viewport sooner and breathes.
- Named spacing steps keep the responsive system predictable.

Tests:
- focused landing hero Playwright regressions
EOF
```

### Task 3: Refresh visual evidence and run the release gate

**Files:**

- Modify: `tests/e2e/frontend.e2e.spec.ts-snapshots/landing-home-desktop-chromium-darwin.png`
- Modify: `tests/e2e/frontend.e2e.spec.ts-snapshots/landing-home-mobile-chromium-darwin.png`

**Interfaces:**

- Consumes: the completed hero markup and spacing contract from Tasks 1 and 2.
- Produces: reviewed Darwin visual baselines and fresh release-gate evidence; Linux baselines remain CI-owned and must be minted by the repository's `visual-baselines` workflow when this branch is published.

- [ ] **Step 1: Update the intended local-platform landing snapshots**

Run:

```bash
pnpm test:e2e tests/e2e/frontend.e2e.spec.ts -g "landing page keeps its desktop and mobile visual contract" --update-snapshots
```

Expected: 1 passed and the two Darwin landing PNGs updated.

- [ ] **Step 2: Inspect both updated PNGs**

Open both files with the local image viewer and confirm:

- Desktop: the headline remains balanced, the action cluster has no awkward gap, and the smaller proof frame is centered with comfortable separation.
- Mobile: command and CTA controls remain full-width without clipping; the proof frame stacks without horizontal overflow.

If either condition fails, adjust only the Task 2 classes, rerun both focused regressions, and regenerate the snapshots again.

- [ ] **Step 3: Run the full local release gate**

Run:

```bash
pnpm test:release
```

Expected: lint, source build, TypeScript, registry, integration, production build, and all Playwright tests pass with exit code 0.

- [ ] **Step 4: Validate the rendered page in the in-app Browser**

Use `http://localhost:3100/` and the Browser plugin. Verify page URL/title, meaningful DOM, absence of a framework overlay, clean warning/error logs, desktop and 390px mobile screenshots, no horizontal overflow, the first Copy interaction, and the replay interaction/final state.

- [ ] **Step 5: Commit the reviewed visual baselines**

```bash
git add tests/e2e/frontend.e2e.spec.ts-snapshots/landing-home-desktop-chromium-darwin.png tests/e2e/frontend.e2e.spec.ts-snapshots/landing-home-mobile-chromium-darwin.png
git commit -F - <<'EOF'
tests(style): refresh compressed landing hero baselines

Summary:
- Update Darwin desktop and mobile landing screenshots.
- Record the approved hero hierarchy and scale visually.

Rationale:
- The hero refinement intentionally changes full-page geometry.
- Reviewed baselines keep later visual drift detectable.

Tests:
- pnpm test:release
- in-app Browser desktop and mobile QA
EOF
```

- [ ] **Step 6: Record the Linux baseline requirement without fabricating images**

When the implementation branch is pushed and a PR exists, run the repository's `visual-baselines` workflow once so Linux landing baselines are rendered in CI. Do not copy or rename Darwin screenshots as Linux evidence.
