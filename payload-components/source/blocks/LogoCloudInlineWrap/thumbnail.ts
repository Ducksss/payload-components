/* Logo Cloud Inline Wrap's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="117.5" width="32.7" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="90.9" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="98.9" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="133.7" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="141.7" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="176.6" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="184.6" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="219.4" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="227.4" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="262.3" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="270.3" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<circle cx="305.1" cy="120" r="4" fill="#a1a1aa"/>',
  '<rect x="313.1" y="117.5" width="18.9" height="5" rx="2.5" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const logoCloudInlineWrapThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
