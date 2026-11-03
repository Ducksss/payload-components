/* Pricing Enterprise's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 264">',
  '<rect x="0" y="0" width="396" height="264" fill="#fafafa"/>',
  '<rect x="168" y="29.1" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="180" y="34.1" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="62" y="51.1" width="272" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="113.7" y="72.9" width="168.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="92.6" y="95.9" width="210.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="117.9" width="340" height="117" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="81.5" y="135.9" width="71" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="74.4" y="151.9" width="85.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="79.6" y="165.9" width="52.8" height="22" rx="4" fill="#27272a"/>',
  '<rect x="138.4" y="182.9" width="16" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="86" y="196.9" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="101.5" y="204.9" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<path d="M208 145.9l2.5 2.5l4.5 -5" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  '<rect x="221" y="143.4" width="96.8" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<path d="M208 158.9l2.5 2.5l4.5 -5" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  '<rect x="221" y="156.4" width="77.4" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<path d="M208 171.9l2.5 2.5l4.5 -5" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  '<rect x="221" y="169.4" width="96.8" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<path d="M208 184.9l2.5 2.5l4.5 -5" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  '<rect x="221" y="182.4" width="77.4" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<circle cx="212" cy="206.4" r="4" fill="#a1a1aa"/>',
  '<rect x="220" y="203.9" width="27.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="263.3" cy="206.4" r="4" fill="#a1a1aa"/>',
  '<rect x="271.3" y="203.9" width="27.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="314.7" cy="206.4" r="4" fill="#a1a1aa"/>',
  '<rect x="322.7" y="203.9" width="27.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const pricingEnterpriseThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
