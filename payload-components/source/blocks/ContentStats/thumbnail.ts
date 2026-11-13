/* Content Stats's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 248">',
  '<rect x="0" y="0" width="372" height="248" fill="#fafafa"/>',
  '<rect x="28" y="29.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="34.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="51.8" width="208.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="74.8" width="227.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="94.8" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="100.8" r="2.2" fill="#a1a1aa"/>',
  '<rect x="28" y="112.8" width="50.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="125.8" width="82.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="136.8" width="51.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="140" y="94.8" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="146" cy="100.8" r="2.2" fill="#a1a1aa"/>',
  '<rect x="140" y="112.8" width="50.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="140" y="125.8" width="82.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="140" y="136.8" width="51.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="252" y="94.8" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="258" cy="100.8" r="2.2" fill="#a1a1aa"/>',
  '<rect x="252" y="112.8" width="50.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="252" y="125.8" width="82.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="252" y="136.8" width="51.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="156.8" width="316" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="172.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="52" y="173.3" width="81.8" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="28" y="185.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="52" y="186.3" width="65.4" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="28" y="198.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="52" y="199.3" width="81.8" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="28" y="211.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="52" y="212.3" width="65.4" height="5" rx="2.5" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentStatsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
