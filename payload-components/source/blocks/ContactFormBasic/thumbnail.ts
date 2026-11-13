/* Contact Form Basic's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 248">',
  '<rect x="0" y="0" width="372" height="248" fill="#fafafa"/>',
  '<rect x="28" y="30" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="54" width="118.1" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="81.6" width="73.2" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="110.6" width="129.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="121.6" width="80.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="137.6" width="57.6" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="200" y="30" width="43.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="200" y="40" width="144" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="200" y="66" width="43.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="200" y="76" width="144" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="200" y="102" width="43.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="200" y="112" width="144" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="200" y="138" width="43.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="200" y="148" width="144" height="42" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="200" y="198" width="144" height="20" rx="10" fill="#27272a"/>',
  '<rect x="250.4" y="206" width="43.2" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const contactFormBasicThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
