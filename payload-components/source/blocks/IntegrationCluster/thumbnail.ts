/* Integration Cluster's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="90.2" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="101.2" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="120.2" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="131.2" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="150.2" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="161.2" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="180.2" y="43.2" width="29.7" height="29.7" rx="8.3" fill="#ffffff" stroke="#27272a" stroke-width="1.5"/>',
  '<circle cx="195" cy="58" r="5.3" fill="#27272a"/>',
  '<rect x="217.9" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="228.9" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="247.9" y="47" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="258.9" cy="58" r="4" fill="#a1a1aa"/>',
  '<rect x="169" y="80.9" width="22" height="22" rx="6.2" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="180" cy="91.9" r="4" fill="#a1a1aa"/>',
  '<rect x="111.6" y="116.9" width="136.8" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="104" y="145.9" width="152" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="132.9" y="156.9" width="94.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="142" y="176.9" width="76" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="161" y="184.9" width="38" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const integrationClusterThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
