/* Footer Simple's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="99.3" width="28.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="163.6" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="193.8" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="223.9" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="254" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="284.2" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="314.3" y="100.3" width="17.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="28" y="120.3" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="135.8" width="91.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const footerSimpleThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
