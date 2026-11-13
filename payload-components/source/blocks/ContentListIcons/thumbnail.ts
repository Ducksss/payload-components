/* Content List Icons's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="53.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="58.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="75.8" width="200.6" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="102.8" width="218.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="122.8" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="138.3" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="144.3" r="2.2" fill="#a1a1aa"/>',
  '<rect x="28" y="156.3" width="48.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="169.3" width="79.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="180.3" width="49.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="136" y="138.3" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="142" cy="144.3" r="2.2" fill="#a1a1aa"/>',
  '<rect x="136" y="156.3" width="48.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="136" y="169.3" width="79.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="136" y="180.3" width="49.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="244" y="138.3" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="250" cy="144.3" r="2.2" fill="#a1a1aa"/>',
  '<rect x="244" y="156.3" width="48.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="244" y="169.3" width="79.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="244" y="180.3" width="49.1" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentListIconsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
