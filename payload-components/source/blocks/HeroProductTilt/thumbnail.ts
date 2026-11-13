/* Hero Product Tilt's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468 312">',
  '<rect x="0" y="0" width="468" height="312" fill="#fafafa"/>',
  '<rect x="204" y="29.1" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="216" y="34.1" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="69.2" y="51.1" width="329.6" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="131.8" y="78.7" width="204.4" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="106.3" y="105.7" width="255.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="168" y="123.7" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="183.5" y="131.7" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="238" y="123.7" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="253.5" y="131.7" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="159" y="155.7" width="46" height="14" rx="7" fill="#f1f1f3" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="169.1" y="160.7" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="211" y="155.7" width="46" height="14" rx="7" fill="#f1f1f3" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="221.1" y="160.7" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="263" y="155.7" width="46" height="14" rx="7" fill="#f1f1f3" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="273.1" y="160.7" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '<g transform="translate(234 181.7) matrix(1 0 -0.12 0.92 0 0) translate(-234 -181.7)">',
  '<rect x="48.6" y="181.7" width="370.8" height="110" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="56.6" y="189.7" width="81.6" height="94" rx="5" fill="#f1f1f3"/>',
  '<rect x="62.6" y="197.7" width="48.9" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="62.6" y="207.7" width="36.7" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="62.6" y="217.7" width="40.8" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="146.2" y="189.7" width="265.2" height="43" rx="5" fill="#f1f1f3"/>',
  '<rect x="146.2" y="240.7" width="128.6" height="43" rx="5" fill="#f1f1f3"/>',
  '<rect x="282.8" y="240.7" width="128.6" height="43" rx="5" fill="#e4e4e7"/>',
  '</g>',
  '</svg>',
].join('')

export const heroProductTiltThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
