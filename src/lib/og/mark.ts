/* The brand mark for the OG cards — the same two-keyed-blocks geometry as the
   header Logomark and public/favicon.svg: a trace-green (#0B6B4F) square with a
   white glyph, as a standalone SVG string because Satori rasterizes a data URI.
   Its own module so tests/int/visual-standards.int.spec.ts can read the copy
   without the card drawings around it. */
export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#0B6B4F"/><rect x="4.8" y="4.8" width="8.4" height="8.4" rx="1.9" fill="#ffffff"/><rect x="10.8" y="10.8" width="8.4" height="8.4" rx="1.9" fill="#ffffff"/></svg>`

export const MARK_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString('base64')}`
