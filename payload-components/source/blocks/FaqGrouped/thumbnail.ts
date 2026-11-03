/* FAQ Grouped's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280">',
  '<rect x="0" y="0" width="420" height="280" fill="#fafafa"/>',
  '<rect x="180" y="31.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="192" y="36.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="89.9" y="53.5" width="240.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="97.2" y="76.5" width="225.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="96.5" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="33" cy="101.5" r="1.8" fill="#a1a1aa"/>',
  '<rect x="44" y="99" width="87" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="28" y="116.5" width="200.2" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="129.5" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="145.5" width="200.2" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="158.5" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="180.5" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="33" cy="185.5" r="1.8" fill="#a1a1aa"/>',
  '<rect x="44" y="183" width="87" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="28" y="200.5" width="200.2" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="213.5" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="229.5" width="200.2" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="242.5" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const faqGroupedThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
