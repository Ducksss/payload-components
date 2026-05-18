# SEO Implementation Notes

This project centralizes public URL and metadata behavior around the Payload Kits brand.

## Metadata

- `src/utilities/site.ts` owns site identity, public URL normalization, and title suffixing.
- `src/utilities/seo.ts` builds canonical metadata, Open Graph, Twitter cards, social images, and route paths.
- CMS pages and posts call `generateMeta` with their collection slug so:
  - the home page canonicalizes to `/`
  - standard pages canonicalize to `/:slug`
  - posts canonicalize to `/posts/:slug`
- `/search` is intentionally `noindex, follow`.

## Structured Data

- `src/components/JsonLd` safely serializes JSON-LD nodes.
- `src/seo/geo.ts` publishes the public graph data for:
  - Organization
  - WebSite
  - SoftwareApplication
  - FAQPage
  - CollectionPage / ItemList
  - Article
  - BreadcrumbList
- `/llms.txt` and `/llms-full.txt` expose AI-readable source maps for the public product and resource pages.

## Crawlability

- `next-sitemap.config.cjs` normalizes `NEXT_PUBLIC_SERVER_URL` and `VERCEL_PROJECT_PRODUCTION_URL`, strips trailing path fragments, and generates robots rules for admin/API/preview routes.
- Dynamic sitemaps include static public routes and Payload documents while avoiding duplicate `/home` and excluding `/search`.
- Pagination uses crawlable links; `/posts/page/1` redirects to `/posts`, and invalid/out-of-range page numbers 404.

## Validation

Run these before shipping SEO changes:

```bash
pnpm generate:types
pnpm exec tsc --noEmit
pnpm lint
pnpm run test:int
pnpm exec playwright test --config=playwright.config.ts tests/e2e/frontend.e2e.spec.ts tests/e2e/geo.e2e.spec.ts
pnpm build
```

The admin E2E spec currently fails in dev with a Payload admin runtime overlay unrelated to the public SEO surface: `Cannot assign to read only property 'i18n' of object '#<Object>'`.
