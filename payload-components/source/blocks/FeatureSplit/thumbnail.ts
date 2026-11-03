/* Feature Split's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="42.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="47.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="66.5" width="126" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="94" width="126" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="121.6" width="78.1" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="28" y="150.6" width="126" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="161.6" width="78.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="177.6" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="43.5" y="185.6" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="192" y="31" width="140" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="204" y="43" width="63.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="204" y="56" width="104.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="204" y="67" width="64.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="93" width="140" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="204" y="105" width="63.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="204" y="118" width="104.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="204" y="129" width="64.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="192" y="155" width="140" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="204" y="167" width="63.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="204" y="180" width="104.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="204" y="191" width="64.7" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const featureSplitThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
