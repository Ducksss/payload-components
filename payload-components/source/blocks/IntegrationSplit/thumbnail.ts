/* Integration Split's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="23.2" y="94" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34.2" cy="105" r="4" fill="#a1a1aa"/>',
  '<rect x="53.2" y="94" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="64.2" cy="105" r="4" fill="#a1a1aa"/>',
  '<rect x="83.2" y="90.2" width="29.7" height="29.7" rx="8.3" fill="#ffffff" stroke="#27272a" stroke-width="1.5"/>',
  '<circle cx="98" cy="105" r="5.3" fill="#27272a"/>',
  '<rect x="120.9" y="94" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="131.9" cy="105" r="4" fill="#a1a1aa"/>',
  '<rect x="150.9" y="94" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="161.9" cy="105" r="4" fill="#a1a1aa"/>',
  '<rect x="72" y="127.9" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="83" cy="138.9" r="4" fill="#a1a1aa"/>',
  '<rect x="102" y="127.9" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="113" cy="138.9" r="4" fill="#a1a1aa"/>',
  '<rect x="192" y="84" width="126" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="192" y="109" width="126" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="120" width="78.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="136" width="76" height="20" rx="10" fill="#27272a"/>',
  '<rect x="211" y="144" width="38" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const integrationSplitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
