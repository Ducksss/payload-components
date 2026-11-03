/* Integration Connect's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="39" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="28" y="79" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="39" cy="90" r="4" fill="#a1a1aa"/>',
  '<rect x="28" y="111" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="39" cy="122" r="4" fill="#a1a1aa"/>',
  '<rect x="162.5" y="86.5" width="35.1" height="35.1" rx="9.8" fill="#ffffff" stroke="#27272a" stroke-width="1.5"/>',
  '<circle cx="180" cy="104" r="6.3" fill="#27272a"/>',
  '<rect x="310" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="321" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="310" y="79" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="321" cy="90" r="4" fill="#a1a1aa"/>',
  '<rect x="310" y="111" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="321" cy="122" r="4" fill="#a1a1aa"/>',
  '<rect x="104" y="147" width="152" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="104" y="176" width="152" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="132.9" y="187" width="94.2" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const integrationConnectThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
