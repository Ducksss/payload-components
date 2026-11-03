/* FAQ Grid's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 304">',
  '<rect x="0" y="0" width="456" height="304" fill="#fafafa"/>',
  '<rect x="198" y="30.5" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="210" y="35.5" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="96" y="52.5" width="264" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="104" y="75.5" width="248" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="95.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="107.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="120.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="131.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="232" y="95.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="244" y="107.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="244" y="120.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="244" y="131.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="157.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="169.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="182.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="193.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="232" y="157.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="244" y="169.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="244" y="182.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="244" y="193.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="219.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="231.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="244.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="255.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="232" y="219.5" width="196" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="244" y="231.5" width="94.6" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="244" y="244.5" width="154.8" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="244" y="255.5" width="96" height="6" rx="3" fill="#d4d4d8"/>',
  '</svg>',
].join('')

export const faqGridThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
