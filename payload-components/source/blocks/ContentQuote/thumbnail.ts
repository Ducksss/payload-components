/* Content Quote's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="44.1" width="140" height="151.8" rx="8" fill="#f1f1f3"/>',
  '<circle cx="120.4" cy="103.2" r="9.8" fill="#d4d4d8"/>',
  '<path d="M56 148L86.8 111.6L106.4 134L117.6 122.8L140 148Z" fill="#d4d4d8"/>',
  '<rect x="192" y="44.1" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="204" y="49.1" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="192" y="66.1" width="112" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="192" y="87.9" width="69.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="192" y="110.9" width="100.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="121.9" width="62.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="141.9" width="2.5" height="54" rx="1" fill="#e4e4e7"/>',
  '<rect x="206" y="141.9" width="113.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="206" y="152.9" width="113.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="206" y="163.9" width="70.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="206" y="176.9" width="50.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="206" y="190.9" width="37.8" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const contentQuoteThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
