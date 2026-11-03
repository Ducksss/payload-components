/* Contact Routing Form's picture in Payload's admin Blocks Drawer (admin.images.thumbnail,
 * Payload 3.79 or newer): a 3:2 layout schematic as an SVG data URI, so it needs
 * no file in public/ and no network request. The drawer names every block under
 * its picture, so the picture is decorative and its alt text is empty. */
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468 312">',
  '<rect x="0" y="0" width="468" height="312" fill="#fafafa"/>',
  '<rect x="28" y="28" width="60" height="14" rx="7" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="33" width="36" height="4" rx="2" fill="#a1a1aa"/>',
  '<rect x="28" y="50" width="271.9" height="15" rx="7.5" fill="#27272a"/>',
  '<rect x="28" y="73" width="296.6" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="93" width="160" height="54" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="105" width="74.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="118" width="122.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="40" y="129" width="75.9" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="28" y="155" width="160" height="43" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="40" y="167" width="74.8" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="40" y="180" width="122.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="200" y="93" width="240" height="191" rx="8" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="212" y="105" width="108" height="7" rx="3.5" fill="#27272a"/>',
  '<rect x="212" y="120" width="194.4" height="6" rx="3" fill="#d4d4d8"/>',
  '<rect x="212" y="134" width="31.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="212" y="144" width="104" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="324" y="134" width="31.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="324" y="144" width="104" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="212" y="170" width="31.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="212" y="180" width="104" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="324" y="170" width="31.2" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="324" y="180" width="104" height="18" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="212" y="206" width="64.8" height="5" rx="2.5" fill="#a1a1aa"/>',
  '<rect x="212" y="216" width="216" height="28" rx="5" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5"/>',
  '<rect x="212" y="252" width="52" height="20" rx="10" fill="#27272a"/>',
  '<rect x="225" y="260" width="26" height="4" rx="2" fill="#ffffff"/>',
  '</svg>',
].join('')

export const contactRoutingFormThumbnail = {
  alt: '',
  url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
}
