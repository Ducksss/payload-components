/* Embed Basic's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 248">',
  '<rect x="0" y="0" width="372" height="248" fill="#fafafa"/>',
  '<rect x="28" y="31.5" width="316" height="170" rx="8" fill="#3f3f46"/>',
  '<circle cx="186" cy="116.5" r="20.4" fill="#ffffff"/>',
  '<path d="M180.1 107.2L196.2 116.5L180.1 125.9Z" fill="#27272a"/>',
  '<rect x="28" y="211.5" width="142.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const embedBasicThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
