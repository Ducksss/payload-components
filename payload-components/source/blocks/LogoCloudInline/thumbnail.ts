/* Logo Cloud Inline's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="106.5" width="60.8" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="32" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="40" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="77.1" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="85.1" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="122.1" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="130.1" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="167.2" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="175.2" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="212.3" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="220.3" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="257.3" cy="129.5" r="4" fill="#a1a1aa"/>',
  '<rect x="265.3" y="127" width="21.1" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const logoCloudInlineThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
