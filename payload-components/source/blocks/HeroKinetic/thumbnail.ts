/* Hero Kinetic's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444 296">',
  '<rect x="0" y="0" width="444" height="296" fill="#fafafa"/>',
  '<rect x="28" y="30.4" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35.4" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="112" y="46.4" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="59.9" width="279.4" height="26" rx="13" fill="#27272a"/>',
  '<rect x="28" y="97.6" width="173.2" height="26" rx="13" fill="#27272a"/>',
  '<rect x="28" y="135.6" width="167.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="146.6" width="167.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="157.6" width="103.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="284" y="139.6" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="299.5" y="147.6" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="354" y="139.6" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="369.5" y="147.6" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="175.6" width="388" height="90" rx="8" fill="#3f3f46"/>',
  '<circle cx="222" cy="220.6" r="10.8" fill="#ffffff"/>',
  '<path d="M218.9 215.7L227.4 220.6L218.9 225.6Z" fill="#27272a"/>',
  '</svg>',
].join('')

export const heroKineticThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
