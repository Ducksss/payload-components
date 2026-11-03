/* FAQ Card's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 288">',
  '<rect x="0" y="0" width="432" height="288" fill="#fafafa"/>',
  '<rect x="186" y="29.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="198" y="34.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="91.9" y="51.8" width="248.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="99.4" y="74.8" width="233.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="94.8" width="376" height="129.5" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="106.8" width="176" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="120.8" width="281.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="133.8" width="352" height="1.5" fill="#e4e4e7"/>',
  '<rect x="40" y="145.3" width="176" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="159.3" width="281.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="172.3" width="352" height="1.5" fill="#e4e4e7"/>',
  '<rect x="40" y="183.8" width="176" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="197.8" width="281.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="210.8" width="352" height="1.5" fill="#e4e4e7"/>',
  '<rect x="181" y="238.3" width="70" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="198.5" y="246.3" width="35" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const faqCardThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
