/* Logo Cloud Hover's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="126.8" y="90.5" width="106.4" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="39.3" cy="119.5" r="4" fill="#a1a1aa"/>',
  '<rect x="47.3" y="117" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="119.8" cy="119.5" r="4" fill="#a1a1aa"/>',
  '<rect x="127.8" y="117" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="200.3" cy="119.5" r="4" fill="#a1a1aa"/>',
  '<rect x="208.3" y="117" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="280.8" cy="119.5" r="4" fill="#a1a1aa"/>',
  '<rect x="288.8" y="117" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="39.3" cy="145.5" r="4" fill="#a1a1aa"/>',
  '<rect x="47.3" y="143" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="119.8" cy="145.5" r="4" fill="#a1a1aa"/>',
  '<rect x="127.8" y="143" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="200.3" cy="145.5" r="4" fill="#a1a1aa"/>',
  '<rect x="208.3" y="143" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="280.8" cy="145.5" r="4" fill="#a1a1aa"/>',
  '<rect x="288.8" y="143" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const logoCloudHoverThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
