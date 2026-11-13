/* Content Image Lead's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280">',
  '<rect x="0" y="0" width="420" height="280" fill="#fafafa"/>',
  '<rect x="28" y="29" width="364" height="110" rx="8" fill="#f1f1f3"/>',
  '<circle cx="227.6" cy="70.8" r="7.7" fill="#d4d4d8"/>',
  '<path d="M177 106L201.2 77.4L216.6 95L225.4 86.2L243 106Z" fill="#d4d4d8"/>',
  '<rect x="28" y="155" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="160" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="177" width="144.5" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="204.5" width="144.5" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="232.1" width="89.6" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="222" y="155" width="153" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="222" y="166" width="153" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="222" y="177" width="94.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="222" y="195" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="237.5" y="203" width="31" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const contentImageLeadThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
