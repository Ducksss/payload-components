/* Stats Inline's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">',
  '<rect x="0" y="0" width="360" height="240" fill="#fafafa"/>',
  '<rect x="28" y="71.8" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="76.8" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="93.8" width="200.6" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="116.8" width="218.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="127.8" width="135.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="149.8" width="90.7" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="161.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="52" y="162.3" width="42" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="134.7" y="149.8" width="90.7" height="1.5" fill="#e4e4e7"/>',
  '<rect x="134.7" y="161.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="158.7" y="162.3" width="42" height="5" rx="2.5" fill="#d4d4d8"/>',
  '<rect x="241.3" y="149.8" width="90.7" height="1.5" fill="#e4e4e7"/>',
  '<rect x="241.3" y="161.3" width="18" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="265.3" y="162.3" width="42" height="5" rx="2.5" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const statsInlineThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
