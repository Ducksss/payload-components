# saas-launch ("Relay") — asset provenance

This concept ships **no runtime raster assets**. Every visual in the preview is
rendered live by the site's demo twins (product-dashboard illustration, logo
marks, avatar monograms are all presentational CSS/SVG from
`src/components/site/demos/`), the Relay mark is an inline SVG in
`src/components/site/templates/saas-launch/Shell.tsx`, and the theme is pure
CSS (`theme.css`). The template definition's `assets` array is accordingly
empty.

Posters under `public/templates/saas-launch/posters/` are **generated build
artifacts** minted later by `tools/templates/capture.ts` from the preview
routes themselves; they are screenshots of this repository's own rendering and
introduce no third-party material.

All companies, people, testimonials, and metrics in the Relay copy
(`src/lib/templates/saas-launch.ts`) are fictional and illustrative; contact
addresses use the reserved `relay.example` domain.
