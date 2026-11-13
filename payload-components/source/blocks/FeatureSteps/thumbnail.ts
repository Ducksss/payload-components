/* Feature Steps's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 248">',
  '<rect x="0" y="0" width="372" height="248" fill="#fafafa"/>',
  '<rect x="28" y="30" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="52" width="208.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="75" width="227.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="95" width="98.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="49" cy="116" r="9" fill="#27272a"/>',
  '<rect x="47.5" y="112" width="3" height="8" rx="1.5" fill="#ffffff"/>',
  '<rect x="40" y="131" width="41.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="144" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="155" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="166" width="41.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="136.7" y="95" width="98.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="157.7" cy="116" r="9" fill="#27272a"/>',
  '<rect x="156.2" y="112" width="3" height="8" rx="1.5" fill="#ffffff"/>',
  '<rect x="148.7" y="131" width="41.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="148.7" y="144" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="148.7" y="155" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="148.7" y="166" width="41.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="245.3" y="95" width="98.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="266.3" cy="116" r="9" fill="#27272a"/>',
  '<rect x="264.8" y="112" width="3" height="8" rx="1.5" fill="#ffffff"/>',
  '<rect x="257.3" y="131" width="41.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="257.3" y="144" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="257.3" y="155" width="67.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="257.3" y="166" width="41.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="198" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="43.5" y="206" width="31" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const featureStepsThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
