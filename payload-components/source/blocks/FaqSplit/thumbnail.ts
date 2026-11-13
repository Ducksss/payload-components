/* FAQ Split's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="48" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="53" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="72" width="99.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="97" width="99.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="108" width="99.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="119" width="61.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="135" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="43.5" y="143" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="166.4" y="48" width="82.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="166.4" y="62" width="132.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="166.4" y="75" width="165.6" height="1.5" fill="#e4e4e7"/>',
  '<rect x="166.4" y="86.5" width="82.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="166.4" y="100.5" width="132.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="166.4" y="113.5" width="165.6" height="1.5" fill="#e4e4e7"/>',
  '<rect x="166.4" y="125" width="82.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="166.4" y="139" width="132.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="166.4" y="152" width="165.6" height="1.5" fill="#e4e4e7"/>',
  '<rect x="166.4" y="163.5" width="82.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="166.4" y="177.5" width="132.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="166.4" y="190.5" width="165.6" height="1.5" fill="#e4e4e7"/>',
  '</svg>',
].join('')

export const faqSplitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
