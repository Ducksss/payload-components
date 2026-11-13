/* Content Showcase's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444 296">',
  '<rect x="0" y="0" width="444" height="296" fill="#fafafa"/>',
  '<rect x="192" y="30.1" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="204" y="35.1" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="66.8" y="52.1" width="310.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="125.8" y="73.9" width="192.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="101.7" y="96.9" width="240.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="116.9" width="388" height="100" rx="8" fill="#f1f1f3"/>',
  '<circle cx="238" cy="154.9" r="7" fill="#d4d4d8"/>',
  '<path d="M192 186.9L214 160.9L228 176.9L236 168.9L252 186.9Z" fill="#d4d4d8"/>',
  '<rect x="28" y="230.9" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="33" cy="235.9" r="1.8" fill="#a1a1aa"/>',
  '<rect x="28" y="246.9" width="47.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="259.9" width="77.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="128.5" y="230.9" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="133.5" cy="235.9" r="1.8" fill="#a1a1aa"/>',
  '<rect x="128.5" y="246.9" width="47.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="128.5" y="259.9" width="77.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="229" y="230.9" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="234" cy="235.9" r="1.8" fill="#a1a1aa"/>',
  '<rect x="229" y="246.9" width="47.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="229" y="259.9" width="77.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="329.5" y="230.9" width="10" height="10" rx="2.8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="334.5" cy="235.9" r="1.8" fill="#a1a1aa"/>',
  '<rect x="329.5" y="246.9" width="47.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="329.5" y="259.9" width="77.9" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentShowcaseThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
