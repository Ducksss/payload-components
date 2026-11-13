/* FAQ Icons's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280">',
  '<rect x="0" y="0" width="420" height="280" fill="#fafafa"/>',
  '<rect x="180" y="30.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="192" y="35.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="89.9" y="52.8" width="240.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="97.2" y="75.8" width="225.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="95.8" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="101.8" r="2.2" fill="#a1a1aa"/>',
  '<rect x="48" y="98.3" width="137.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="114.8" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="125.8" width="203.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="138.8" width="364" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="150.3" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="156.3" r="2.2" fill="#a1a1aa"/>',
  '<rect x="48" y="152.8" width="137.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="169.3" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="180.3" width="203.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="193.3" width="364" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="204.8" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="210.8" r="2.2" fill="#a1a1aa"/>',
  '<rect x="48" y="207.3" width="137.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="223.8" width="327.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="234.8" width="203.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="247.8" width="364" height="1.5" fill="#e4e4e7"/>',
  '</svg>',
].join('')

export const faqIconsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
