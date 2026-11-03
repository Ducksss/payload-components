/* Integration Orbit's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<circle cx="180" cy="90" r="48" fill="none" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="180" cy="90" r="30" fill="none" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="172" y="34" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="180" cy="42" r="3" fill="#a1a1aa"/>',
  '<rect x="198" y="67" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="206" cy="75" r="3" fill="#a1a1aa"/>',
  '<rect x="213.6" y="106" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="221.6" cy="114" r="3" fill="#a1a1aa"/>',
  '<rect x="172" y="112" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="180" cy="120" r="3" fill="#a1a1aa"/>',
  '<rect x="130.4" y="106" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="138.4" cy="114" r="3" fill="#a1a1aa"/>',
  '<rect x="146" y="67" width="16" height="16" rx="4.5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="154" cy="75" r="3" fill="#a1a1aa"/>',
  '<rect x="167" y="77" width="26" height="26" rx="7" fill="#ffffff" stroke="#27272a" stroke-width="1.5"/>',
  '<circle cx="180" cy="90" r="5" fill="#27272a"/>',
  '<rect x="116.2" y="156" width="127.7" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="111.6" y="185" width="136.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="137.6" y="196" width="84.8" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const integrationOrbitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
