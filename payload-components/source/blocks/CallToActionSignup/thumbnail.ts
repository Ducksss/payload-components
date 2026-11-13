/* Call To Action Signup's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="104" y="78" width="152" height="19" rx="9.5" fill="#27272a"/>',
  '<rect x="85.8" y="111" width="188.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="121.6" y="122" width="116.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="96.4" y="142" width="97.2" height="20" rx="6" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="106.4" y="150" width="48" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="199.6" y="142" width="64" height="20" rx="10" fill="#27272a"/>',
  '<rect x="215.6" y="150" width="32" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const callToActionSignupThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
