/* Content List Columns's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="69.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="74.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="95.8" width="188.5" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="126.8" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="140.3" width="77" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="153.3" width="126" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="164.3" width="78.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="140.3" width="77" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="192" y="153.3" width="126" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="164.3" width="78.1" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentListColumnsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
