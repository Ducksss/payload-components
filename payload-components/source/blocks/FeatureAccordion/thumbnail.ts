/* Feature Accordion's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 516 344">',
  '<rect x="0" y="0" width="516" height="344" fill="#fafafa"/>',
  '<rect x="28" y="29.4" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="34.4" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="51.4" width="368" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="73.2" width="228.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="96.2" width="331.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="116.2" width="88.4" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="28" y="129.2" width="159.1" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="140.2" width="98.7" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="155.2" width="176.8" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="165.7" width="32.2" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="196.8" y="168.7" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="199.8" y="165.7" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '<rect x="28" y="182.7" width="176.8" height="1.5" fill="#e4e4e7"/>',
  '<rect x="28" y="193.2" width="28.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="196.8" y="196.2" width="8" height="2" rx="1" fill="#a1a1aa"/>',
  '<rect x="199.8" y="193.2" width="2" height="8" rx="1" fill="#a1a1aa"/>',
  '<rect x="222.8" y="116.2" width="265.2" height="164.4" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="230.8" y="124.2" width="58.3" height="148.4" rx="5" fill="#f1f1f3"/>',
  '<rect x="236.8" y="132.2" width="35" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="236.8" y="142.2" width="26.3" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="236.8" y="152.2" width="29.2" height="4" rx="2" fill="#d4d4d8"/>',
  '<rect x="297.1" y="124.2" width="182.9" height="70.2" rx="5" fill="#f1f1f3"/>',
  '<rect x="297.1" y="202.4" width="87.4" height="70.2" rx="5" fill="#f1f1f3"/>',
  '<rect x="392.6" y="202.4" width="87.4" height="70.2" rx="5" fill="#e4e4e7"/>',
  '<rect x="28" y="294.6" width="62" height="20" rx="10" fill="#27272a"/>',
  '<rect x="43.5" y="302.6" width="31" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const featureAccordionThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
