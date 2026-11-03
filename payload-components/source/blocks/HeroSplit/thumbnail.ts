/* Hero Split's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408 272">',
  '<rect x="0" y="0" width="408" height="272" fill="#fafafa"/>',
  '<rect x="28" y="30.2" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35.2" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="52.2" width="145.8" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="79.8" width="145.8" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="107.3" width="90.4" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="134.3" width="131.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="145.3" width="81.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="163.3" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="43.5" y="171.3" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="98" y="163.3" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="113.5" y="171.3" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="195.3" width="182.2" height="1.5" fill="#e4e4e7"/>',
  '<circle cx="31" cy="212.3" r="2.5" fill="#059669"/>',
  '<rect x="41" y="209.8" width="126.9" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<circle cx="31" cy="225.3" r="2.5" fill="#059669"/>',
  '<rect x="41" y="222.8" width="101.5" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<circle cx="31" cy="238.3" r="2.5" fill="#059669"/>',
  '<rect x="41" y="235.8" width="126.9" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="234.2" y="30.2" width="145.8" height="211.6" rx="8" fill="#f1f1f3"/>',
  '<circle cx="330.4" cy="118.5" r="10.2" fill="#d4d4d8"/>',
  '<path d="M263.4 165.2L295.4 127.3L315.9 150.6L327.5 138.9L350.8 165.2Z" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const heroSplitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
