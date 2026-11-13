/* Feature Bento's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">',
  '<rect x="0" y="0" width="480" height="320" fill="#fafafa"/>',
  '<rect x="28" y="30" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="35" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="52" width="279.8" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="75" width="305.3" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="91" width="277.3" height="116" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="103" width="139.3" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="116" width="228" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="127" width="228" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="138" width="228" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="149" width="141.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="313.3" y="91" width="138.7" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="325.3" y="103" width="63.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="325.3" y="116" width="103.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="325.3" y="127" width="64" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="313.3" y="153" width="138.7" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="325.3" y="165" width="63.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="325.3" y="178" width="103.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="325.3" y="189" width="64" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="217" width="138.7" height="43" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="229" width="63.1" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="242" width="103.2" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="270" width="62" height="20" rx="10" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="43.5" y="278" width="31" height="4" rx="2" fill="#a1a1aa"/>',
  '</svg>',
].join('')

export const featureBentoThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
