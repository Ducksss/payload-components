/* Content Rows's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280">',
  '<rect x="0" y="0" width="420" height="280" fill="#fafafa"/>',
  '<rect x="28" y="30.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="52.5" width="240.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="75.5" width="262.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="95.5" width="173" height="70" rx="8" fill="#f1f1f3"/>',
  '<circle cx="125.7" cy="122.1" r="4.9" fill="#d4d4d8"/>',
  '<path d="M93.5 144.5L108.9 126.3L118.7 137.5L124.3 131.9L135.5 144.5Z" fill="#d4d4d8"/>',
  '<rect x="219" y="115" width="86.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="219" y="129" width="155.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="219" y="140" width="96.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="179.5" width="173" height="70" rx="8" fill="#f1f1f3"/>',
  '<circle cx="125.7" cy="206.1" r="4.9" fill="#d4d4d8"/>',
  '<path d="M93.5 228.5L108.9 210.3L118.7 221.5L124.3 215.9L135.5 228.5Z" fill="#d4d4d8"/>',
  '<rect x="219" y="199" width="86.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="219" y="213" width="155.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="219" y="224" width="96.5" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentRowsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
