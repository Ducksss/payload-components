# Frameworks ’26 (event-conference) — asset provenance

Frameworks ’26 is a fictional design + engineering conference built as a
**Concept preview**. It is not a real event; its name, dates, speakers, copy, and
any metrics are invented and illustrative.

## Runtime assets

This concept renders no hotlinked or raster runtime assets. All imagery is
token-derived (CSS gradients/composition from the scoped theme), so `assets: []`
in `src/lib/templates/event-conference.ts` and the demo twins fall back to their
own `bg-muted` placeholders. No real sponsor or speaker likenesses are used.

## Generated posters

`public/templates/event-conference/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. Regenerate them whenever the
concept's visual direction changes and bump `revision` in the same change.
