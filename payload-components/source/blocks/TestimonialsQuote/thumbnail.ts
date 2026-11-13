/* Testimonials Quote's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="85.5" width="2.5" height="69" rx="1" fill="#e4e4e7"/>',
  '<rect x="42" y="85.5" width="194.6" height="10" rx="5" fill="#27272a"/>',
  '<rect x="42" y="100" width="194.6" height="10" rx="5" fill="#27272a"/>',
  '<rect x="42" y="114.5" width="120.7" height="10" rx="5" fill="#27272a"/>',
  '<circle cx="48" cy="146.5" r="6" fill="#e4e4e7"/>',
  '<rect x="60" y="138.5" width="130.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="60" y="149.5" width="93.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const testimonialsQuoteThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
