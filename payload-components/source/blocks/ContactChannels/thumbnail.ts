/* Contact Channels's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="33.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="38.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="55.5" width="200.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="78.5" width="218.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="98.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="38" y="108.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="38" y="121.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="38" y="132.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="132" y="98.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="142" y="108.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="142" y="121.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="142" y="132.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="236" y="98.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="246" y="108.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="246" y="121.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="246" y="132.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="156.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="38" y="166.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="38" y="179.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="38" y="190.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="132" y="156.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="142" y="166.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="142" y="179.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="142" y="190.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="236" y="156.5" width="96" height="50" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="246" y="166.5" width="30.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="246" y="179.5" width="53.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="246" y="190.5" width="68.4" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contactChannelsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
