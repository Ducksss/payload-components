/* Content Community's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="150" y="72" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="162" y="77" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="79.7" y="94" width="200.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="85.8" y="117" width="188.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="121.6" y="128" width="116.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<circle cx="89" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="115" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="141" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="167" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="193" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="219" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="245" cy="158" r="10" fill="#e4e4e7"/>',
  '<circle cx="271" cy="158" r="10" fill="#e4e4e7"/>',
  '</svg>',
].join('')

export const contentCommunityThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
