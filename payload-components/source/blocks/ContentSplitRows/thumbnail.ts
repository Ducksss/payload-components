/* Content Split Rows's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 264">',
  '<rect x="0" y="0" width="396" height="264" fill="#fafafa"/>',
  '<rect x="28" y="28.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="33.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="50.5" width="224.4" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="73.5" width="244.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="93.5" width="161" height="64" rx="8" fill="#f1f1f3"/>',
  '<circle cx="118.7" cy="117.8" r="4.5" fill="#d4d4d8"/>',
  '<path d="M89.3 138.3L103.4 121.7L112.3 131.9L117.5 126.8L127.7 138.3Z" fill="#d4d4d8"/>',
  '<rect x="207" y="110" width="80.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="207" y="124" width="144.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="207" y="135" width="89.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="188" width="80.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="202" width="144.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="213" width="89.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="207" y="171.5" width="161" height="64" rx="8" fill="#f1f1f3"/>',
  '<circle cx="297.7" cy="195.8" r="4.5" fill="#d4d4d8"/>',
  '<path d="M268.3 216.3L282.4 199.7L291.3 209.9L296.5 204.8L306.7 216.3Z" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const contentSplitRowsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
