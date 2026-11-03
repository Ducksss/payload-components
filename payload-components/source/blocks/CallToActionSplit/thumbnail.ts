/* Call To Action Split's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="83.2" width="137.8" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="110.8" width="85.4" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="139.8" width="151.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="150.8" width="93.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="200" y="103.5" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="215.5" y="111.5" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="270" y="103.5" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="285.5" y="111.5" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="281.6" y="131.5" width="50.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const callToActionSplitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
