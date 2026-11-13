/* Content Image Frame's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 248">',
  '<rect x="0" y="0" width="372" height="248" fill="#fafafa"/>',
  '<rect x="156" y="31.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="168" y="36.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="81.7" y="53.5" width="208.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="88" y="76.5" width="195.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="50.1" y="96.5" width="271.8" height="120" rx="8" fill="#f1f1f3"/>',
  '<rect x="71.9" y="113.3" width="228.3" height="103.2" rx="6" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '</svg>',
].join('')

export const contentImageFrameThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
