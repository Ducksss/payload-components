/* Logo Cloud Grid's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="111.6" y="101" width="136.8" height="10" rx="5" fill="#27272a"/>',
  '<circle cx="32" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="40" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="84.7" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="92.7" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="137.3" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="145.3" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="190" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="198" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="242.7" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="250.7" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="295.3" cy="135" r="4" fill="#a1a1aa"/>',
  '<rect x="303.3" y="132.5" width="28.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const logoCloudGridThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
