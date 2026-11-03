/* Testimonials Grid's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="42" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="47" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="64" width="200.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="87" width="218.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="109" width="94.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="121" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="132" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="143" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="154" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<circle cx="47" cy="178" r="7" fill="#e4e4e7"/>',
  '<rect x="60" y="170" width="35.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="60" y="181" width="25.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="132.7" y="109" width="94.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="144.7" y="121" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="144.7" y="132" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="144.7" y="143" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="144.7" y="154" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<circle cx="151.7" cy="178" r="7" fill="#e4e4e7"/>',
  '<rect x="164.7" y="170" width="35.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="164.7" y="181" width="25.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="237.3" y="109" width="94.7" height="89" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="249.3" y="121" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="249.3" y="132" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="249.3" y="143" width="63.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="249.3" y="154" width="39.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<circle cx="256.3" cy="178" r="7" fill="#e4e4e7"/>',
  '<rect x="269.3" y="170" width="35.5" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="269.3" y="181" width="25.3" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const testimonialsGridThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
