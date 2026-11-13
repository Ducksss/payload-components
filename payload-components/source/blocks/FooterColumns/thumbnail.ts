/* Footer Columns's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="75.3" width="32.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="90.3" width="73.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="101.3" width="45.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="129.3" y="75.3" width="29.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="129.3" y="88.3" width="38" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="129.3" y="99.3" width="27.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="129.3" y="110.3" width="32.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="129.3" y="121.3" width="24.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="203.6" y="75.3" width="29.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="203.6" y="88.3" width="38" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="203.6" y="99.3" width="27.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="203.6" y="110.3" width="32.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="203.6" y="121.3" width="24.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="277.8" y="75.3" width="29.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="277.8" y="88.3" width="38" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="277.8" y="99.3" width="27.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="277.8" y="110.3" width="32.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="277.8" y="121.3" width="24.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="28" y="142.3" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="159.8" width="66.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const footerColumnsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
