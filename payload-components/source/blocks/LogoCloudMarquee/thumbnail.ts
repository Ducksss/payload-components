/* Logo Cloud Marquee's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="111.5" width="33.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="122.5" width="20.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<circle cx="97.7" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="105.7" y="117.5" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="161.1" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="169.1" y="117.5" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="224.6" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="232.6" y="117.5" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="288" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="296" y="117.5" width="36" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const logoCloudMarqueeThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
