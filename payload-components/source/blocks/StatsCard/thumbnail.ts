/* Stats Card's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="150" y="62.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="162" y="67.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="96.4" y="90.5" width="167.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="119.5" width="304" height="58" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="61.5" y="135.5" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="64.9" y="156.5" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="157.5" y="135.5" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="160.9" y="156.5" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="253.5" y="135.5" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="256.9" y="156.5" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const statsCardThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
