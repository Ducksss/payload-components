/* Feature Cards Media's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">',
  '<rect x="0" y="0" width="480" height="320" fill="#fafafa"/>',
  '<rect x="28" y="29.6" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="34.6" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="51.6" width="339.2" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="73.4" width="210.3" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="96.4" width="305.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="114.4" width="207" height="144" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="36" y="122.4" width="191" height="70" rx="6" fill="#f1f1f3"/>',
  '<rect x="44" y="130.4" width="104.4" height="23" rx="4" fill="#ffffff"/>',
  '<rect x="156.4" y="130.4" width="62.6" height="23" rx="4" fill="#e4e4e7"/>',
  '<rect x="44" y="161.4" width="50.1" height="23" rx="4" fill="#e4e4e7"/>',
  '<rect x="102.1" y="161.4" width="116.9" height="23" rx="4" fill="#ffffff"/>',
  '<rect x="36" y="202.4" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="42" cy="208.4" r="2.2" fill="#a1a1aa"/>',
  '<rect x="36" y="220.4" width="105.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="36" y="233.4" width="171.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="36" y="244.4" width="106.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="245" y="114.4" width="207" height="144" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="253" y="122.4" width="191" height="70" rx="6" fill="#f1f1f3"/>',
  '<rect x="261" y="130.4" width="104.4" height="23" rx="4" fill="#ffffff"/>',
  '<rect x="373.4" y="130.4" width="62.6" height="23" rx="4" fill="#e4e4e7"/>',
  '<rect x="261" y="161.4" width="50.1" height="23" rx="4" fill="#e4e4e7"/>',
  '<rect x="319.1" y="161.4" width="116.9" height="23" rx="4" fill="#ffffff"/>',
  '<rect x="253" y="202.4" width="12" height="12" rx="3.4" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<circle cx="259" cy="208.4" r="2.2" fill="#a1a1aa"/>',
  '<rect x="253" y="220.4" width="105.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="253" y="233.4" width="171.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="253" y="244.4" width="106.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="270.4" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="43.5" y="278.4" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const featureCardsMediaThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
