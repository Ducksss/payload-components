/* Hero Video's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#52525b"/><stop offset="1" stop-color="#18181b"/></linearGradient></defs>',
  '<rect x="0" y="0" width="360" height="240" fill="url(#v)"/>',
  '<rect x="28" y="42.2" width="60" height="14" rx="7" fill="#27272a" stroke="#52525b" stroke-width="1.5"/>',
  '<rect x="40" y="47.2" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="64.2" width="243.2" height="19" rx="9.5" fill="#fafafa"/>',
  '<rect x="28" y="91.8" width="150.8" height="19" rx="9.5" fill="#fafafa"/>',
  '<rect x="28" y="118.8" width="218.9" height="6" rx="3" fill="#71717a"/>',
  '<rect x="28" y="129.8" width="135.7" height="6" rx="3" fill="#71717a"/>',
  '<rect x="28" y="149.8" width="62" height="20" rx="10" fill="#fafafa"/>',
  '<rect x="43.5" y="157.8" width="31" height="4" rx="2" fill="#27272a"/>',
  '<rect x="98" y="149.8" width="62" height="20" rx="10" fill="#27272a" stroke="#52525b" stroke-width="1.5"/>',
  '<rect x="113.5" y="157.8" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="183.8" width="46" height="14" rx="7" fill="#3f3f46" stroke="#52525b" stroke-width="1.5"/>',
  '<rect x="38.1" y="188.8" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="80" y="183.8" width="46" height="14" rx="7" fill="#3f3f46" stroke="#52525b" stroke-width="1.5"/>',
  '<rect x="90.1" y="188.8" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="132" y="183.8" width="46" height="14" rx="7" fill="#3f3f46" stroke="#52525b" stroke-width="1.5"/>',
  '<rect x="142.1" y="188.8" width="25.8" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const heroVideoThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
