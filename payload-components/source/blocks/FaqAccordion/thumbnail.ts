/* FAQ Accordion's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 304">',
  '<rect x="0" y="0" width="456" height="304" fill="#fafafa"/>',
  '<rect x="198" y="30.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="210" y="35.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="96" y="52.5" width="264" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="104" y="75.5" width="248" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="95.5" width="200" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="109.5" width="320" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="122.5" width="400" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="134" width="200" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="148" width="320" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="161" width="400" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="172.5" width="200" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="186.5" width="320" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="199.5" width="400" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="211" width="200" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="225" width="320" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="238" width="400" height="1.5" fill="#e4e4e7"/>',
  '<rect x="193" y="253.5" width="70" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="210.5" y="261.5" width="35" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const faqAccordionThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
