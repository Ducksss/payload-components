/* Stats Proof's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 288">',
  '<rect x="0" y="0" width="432" height="288" fill="#fafafa"/>',
  '<rect x="28" y="32" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="37" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="54" width="170.9" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="81.5" width="170.9" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="109.1" width="105.9" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="136.1" width="153.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="147.1" width="153.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="158.1" width="95.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="180.1" width="60" height="20" rx="4" fill="#27272a"/>',
  '<rect x="28" y="206.1" width="51" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="141.8" y="180.1" width="60" height="20" rx="4" fill="#27272a"/>',
  '<rect x="141.8" y="206.1" width="51" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="28" y="225.1" width="60" height="20" rx="4" fill="#27272a"/>',
  '<rect x="28" y="251.1" width="51" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="141.8" y="225.1" width="60" height="20" rx="4" fill="#27272a"/>',
  '<rect x="141.8" y="251.1" width="51" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="261.6" y="32" width="142.4" height="224.1" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="275.6" y="46" width="34.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="275.6" y="63" width="103" height="10" rx="5" fill="#27272a"/>',
  '<rect x="275.6" y="77.5" width="103" height="10" rx="5" fill="#27272a"/>',
  '<rect x="275.6" y="92" width="103" height="10" rx="5" fill="#27272a"/>',
  '<rect x="275.6" y="106.5" width="63.8" height="10" rx="5" fill="#27272a"/>',
  '<circle cx="281.6" cy="136.5" r="6" fill="#e4e4e7"/>',
  '<rect x="293.6" y="128.5" width="67.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="293.6" y="139.5" width="48.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const statsProofThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
