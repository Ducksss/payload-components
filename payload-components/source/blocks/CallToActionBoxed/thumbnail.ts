/* Call To Action Boxed's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="58" width="249.3" height="124" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="86.2" y="82" width="132.8" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="82.2" y="109" width="140.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="109" y="120" width="87.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="86.6" y="138" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="102.1" y="146" width="31" height="4" rx="2" fill="#ffffff"/>',
  '<rect x="156.6" y="138" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="172.1" y="146" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const callToActionBoxedThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
