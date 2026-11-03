/* Content Columns's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="71" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="76" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="95" width="124.2" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="122.5" width="124.2" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="150.1" width="77" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="194" y="70" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="81" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="92" width="77" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="110" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="121" width="124.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="132" width="77" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="194" y="150" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="209.5" y="158" width="31" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const contentColumnsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
