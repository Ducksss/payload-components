/* Footer Centered's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="158.7" y="83.8" width="42.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="119.2" y="102.8" width="121.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="106.4" y="120.8" width="19.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="138.4" y="120.8" width="19.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="170.4" y="120.8" width="19.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="202.4" y="120.8" width="19.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="234.4" y="120.8" width="19.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="28" y="137.8" width="304" height="1.5" fill="#e4e4e7"/>',
  '<rect x="71.2" y="151.3" width="57.6" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="223.4" y="151.3" width="26.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="264.5" y="151.3" width="26.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="305.5" y="151.3" width="26.5" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const footerCenteredThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
