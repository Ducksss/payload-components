/* Content Feature Media's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="47.1" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="52.1" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="69.1" width="112" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="90.9" width="69.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="113.9" width="100.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="124.9" width="62.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="144.9" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="34" cy="150.9" r="2.2" fill="#a1a1aa"/>',
  '<rect x="28" y="162.9" width="34.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="175.9" width="55.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="186.9" width="34.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="106" y="144.9" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="112" cy="150.9" r="2.2" fill="#a1a1aa"/>',
  '<rect x="106" y="162.9" width="34.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="106" y="175.9" width="55.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="106" y="186.9" width="34.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="47.1" width="140" height="145.8" rx="8" fill="#f1f1f3"/>',
  '<circle cx="284.4" cy="103.2" r="9.8" fill="#d4d4d8"/>',
  '<path d="M220 148L250.8 111.6L270.4 134L281.6 122.8L304 148Z" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentFeatureMediaThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
