/* Team Grid's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="45.2" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="50.2" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="67.2" width="84" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="192" y="55.2" width="126" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="66.2" width="78.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="98.2" width="68.5" height="85.6" rx="8" fill="#f1f1f3"/>',
  '<circle cx="73.2" cy="132.8" r="4.8" fill="#d4d4d8"/>',
  '<path d="M41.7 154.7L56.8 136.9L66.4 147.9L71.8 142.4L82.8 154.7Z" fill="#d4d4d8"/>',
  '<rect x="28" y="189.8" width="34.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="106.5" y="98.2" width="68.5" height="85.6" rx="8" fill="#f1f1f3"/>',
  '<circle cx="151.7" cy="132.8" r="4.8" fill="#d4d4d8"/>',
  '<path d="M120.2 154.7L135.3 136.9L144.9 147.9L150.3 142.4L161.3 154.7Z" fill="#d4d4d8"/>',
  '<rect x="106.5" y="189.8" width="34.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="185" y="98.2" width="68.5" height="85.6" rx="8" fill="#f1f1f3"/>',
  '<circle cx="230.2" cy="132.8" r="4.8" fill="#d4d4d8"/>',
  '<path d="M198.7 154.7L213.8 136.9L223.4 147.9L228.8 142.4L239.8 154.7Z" fill="#d4d4d8"/>',
  '<rect x="185" y="189.8" width="34.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="263.5" y="98.2" width="68.5" height="85.6" rx="8" fill="#f1f1f3"/>',
  '<circle cx="308.7" cy="132.8" r="4.8" fill="#d4d4d8"/>',
  '<path d="M277.2 154.7L292.3 136.9L301.9 147.9L307.3 142.4L318.3 154.7Z" fill="#d4d4d8"/>',
  '<rect x="263.5" y="189.8" width="34.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const teamGridThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
