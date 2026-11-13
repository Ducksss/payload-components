/* Testimonials Spotlight's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<path d="M177 45.3C170 47.3 167 53.3 167 59.3A5 5 0 1 0 172 54.3C172 51.3 174 48.3 177 47.3Z" fill="#27272a"/>',
  '<path d="M191 45.3C184 47.3 181 53.3 181 59.3A5 5 0 1 0 186 54.3C186 51.3 188 48.3 191 47.3Z" fill="#27272a"/>',
  '<rect x="85.8" y="78.3" width="188.5" height="10" rx="5" fill="#27272a"/>',
  '<rect x="85.8" y="92.8" width="188.5" height="10" rx="5" fill="#27272a"/>',
  '<rect x="85.8" y="107.3" width="188.5" height="10" rx="5" fill="#27272a"/>',
  '<rect x="121.6" y="121.8" width="116.9" height="10" rx="5" fill="#27272a"/>',
  '<circle cx="180" cy="154.8" r="9" fill="#e4e4e7"/>',
  '<rect x="155.7" y="177.8" width="48.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="149.6" y="189.8" width="60.8" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const testimonialsSpotlightThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
