/* Hero Aurora's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 328">',
  '<defs><radialGradient id="a" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#a7f3d0"/><stop offset="1" stop-color="#fafafa"/></radialGradient></defs>',
  '<rect x="0" y="0" width="492" height="328" fill="url(#a)"/>',
  '<circle cx="246" cy="0" r="180.4" fill="none" stroke="#d1fae5" stroke-width="1.5"/>',
  '<circle cx="246" cy="0" r="262.4" fill="none" stroke="#ecfdf5" stroke-width="1.5"/>',
  '<rect x="216" y="30.2" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="228" y="35.2" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="71.6" y="52.2" width="348.8" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="137.9" y="79.8" width="216.3" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="110.8" y="106.8" width="270.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="162.2" y="117.8" width="167.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="180" y="135.8" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="195.5" y="143.8" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="250" y="135.8" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="265.5" y="143.8" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="147.5" y="167.8" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="150.9" y="188.8" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="223.5" y="167.8" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="226.9" y="188.8" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="299.5" y="167.8" width="45" height="15" rx="4" fill="#27272a"/>',
  '<rect x="302.9" y="188.8" width="38.3" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="89" y="205.8" width="313.9" height="92" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="101" y="217.8" width="62.8" height="22" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="107" y="225.8" width="31.4" height="6" rx="3" fill="#059669"/>',
  '<path d="M105 263.7L155.8 267.6L206.5 256.6L251.6 259.9L302.4 247.7L347.5 244.4L387 236.7" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  '</svg>',
].join('')

export const heroAuroraThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
