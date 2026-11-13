/* Integration List's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 256">',
  '<rect x="0" y="0" width="384" height="256" fill="#fafafa"/>',
  '<rect x="110" y="29.3" width="164" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="101.8" y="58.3" width="180.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="57.5" y="78.3" width="269" height="148.5" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="69.5" y="92.3" width="14" height="14" rx="3.9" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="76.5" cy="99.3" r="2.5" fill="#a1a1aa"/>',
  '<rect x="93.5" y="90.3" width="60.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="93.5" y="102.3" width="172.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="306.5" y="98.3" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="309.5" y="95.3" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '<rect x="69.5" y="116.3" width="245" height="1.5" fill="#e4e4e7"/>',
  '<rect x="69.5" y="127.8" width="14" height="14" rx="3.9" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="76.5" cy="134.8" r="2.5" fill="#a1a1aa"/>',
  '<rect x="93.5" y="125.8" width="60.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="93.5" y="137.8" width="172.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="306.5" y="133.8" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="309.5" y="130.8" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '<rect x="69.5" y="151.8" width="245" height="1.5" fill="#e4e4e7"/>',
  '<rect x="69.5" y="163.3" width="14" height="14" rx="3.9" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="76.5" cy="170.3" r="2.5" fill="#a1a1aa"/>',
  '<rect x="93.5" y="161.3" width="60.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="93.5" y="173.3" width="172.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="306.5" y="169.3" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="309.5" y="166.3" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '<rect x="69.5" y="187.3" width="245" height="1.5" fill="#e4e4e7"/>',
  '<rect x="69.5" y="198.8" width="14" height="14" rx="3.9" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="76.5" cy="205.8" r="2.5" fill="#a1a1aa"/>',
  '<rect x="93.5" y="196.8" width="60.9" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="93.5" y="208.8" width="172.5" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="306.5" y="204.8" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="309.5" y="201.8" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const integrationListThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
