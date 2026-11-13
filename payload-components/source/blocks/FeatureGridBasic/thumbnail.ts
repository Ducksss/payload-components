/* Feature Grid Basic's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="38" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="43" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="60" width="200.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="83" width="218.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="103" width="94.7" height="65" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="115" width="38.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="128" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="139" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="150" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="132.7" y="103" width="94.7" height="65" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="144.7" y="115" width="38.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="144.7" y="128" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="144.7" y="139" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="144.7" y="150" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="237.3" y="103" width="94.7" height="65" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="249.3" y="115" width="38.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="249.3" y="128" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="249.3" y="139" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="249.3" y="150" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="182" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="43.5" y="190" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const featureGridBasicThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
