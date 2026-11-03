/* Content List's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="84.7" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="89.7" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="108.7" width="103.5" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="136.3" width="64.2" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="194" y="61" width="75.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="194" y="74" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="85" width="77" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="105" width="75.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="194" y="118" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="129" width="77" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="149" width="75.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="194" y="162" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="173" width="77" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentListThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
