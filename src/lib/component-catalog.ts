import generatedCatalog from '@/generated/component-catalog.json' with { type: 'json' }

/* Editorial catalog context stays hand-curated here. Install-contract order and
 * versions are generated from manifests; commands, routes, and family are
 * deterministic projections. */
export const componentCategories = {
  hero: {
    family: 'pages',
    label: 'Hero',
  },
  features: {
    family: 'pages',
    label: 'Features',
  },
  comparator: {
    family: 'pages',
    label: 'Comparator',
  },
  pricing: {
    family: 'pages',
    label: 'Pricing',
  },
  cta: {
    family: 'pages',
    label: 'Call to action',
  },
  contact: {
    family: 'pages',
    label: 'Contact',
  },
  integration: {
    family: 'pages',
    label: 'Integration',
  },
  logos: {
    family: 'pages',
    label: 'Logo cloud',
  },
  testimonials: {
    family: 'pages',
    label: 'Testimonials',
  },
  stats: {
    family: 'pages',
    label: 'Stats',
  },
  faq: {
    family: 'pages',
    label: 'FAQ',
  },
  content: {
    family: 'pages',
    label: 'Content',
  },
  team: {
    family: 'pages',
    label: 'Team',
  },
  embed: {
    family: 'pages',
    label: 'Embed',
  },
  footer: {
    family: 'pages',
    label: 'Footer',
  },
  cards: {
    family: 'posts',
    label: 'Cards',
  },
  archive: {
    family: 'posts',
    label: 'Archive',
  },
  header: {
    family: 'posts',
    label: 'Post header',
  },
  index: {
    family: 'posts',
    label: 'Index',
  },
  author: {
    family: 'posts',
    label: 'Author',
  },
  newsletter: {
    family: 'posts',
    label: 'Newsletter',
  },
  related: {
    family: 'posts',
    label: 'Related',
  },
} as const

export type ComponentCategory = keyof typeof componentCategories

const componentEditorialEntries = [
  {
    category: 'hero',
    description:
      'A headline-led marketing hero with CTA links, proof badges, Payload block config, and frontend rendering.',
    fields: ['eyebrow', 'title', 'description', 'links', 'proofItems'],
    slug: 'hero-basic',
    target: 'Hero section',
    title: 'Hero Basic',
  },
  {
    category: 'hero',
    description:
      'A two-column hero pairing the shared hero copy with an editor-managed visual that can sit on either side.',
    fields: ['eyebrow', 'title', 'description', 'links', 'image', 'imagePosition', 'highlights'],
    slug: 'hero-split',
    target: 'Split hero',
    title: 'Hero Split',
  },
  {
    category: 'hero',
    description:
      'A full-bleed video hero with editor-managed media, CTA links, proof labels, and a reduced-motion poster fallback.',
    fields: ['eyebrow', 'title', 'description', 'links', 'video', 'poster', 'proofItems'],
    slug: 'hero-video',
    target: 'Video hero',
    title: 'Hero Video',
  },
  {
    category: 'hero',
    description:
      'A centered product hero with a static perspective frame, CTA links, proof labels, and editor-managed media.',
    fields: [
      'eyebrow',
      'title',
      'description',
      'links',
      'productImage',
      'imageCaption',
      'proofItems',
    ],
    slug: 'hero-product-tilt',
    target: 'Product hero',
    title: 'Hero Product Tilt',
  },
  {
    category: 'hero',
    description:
      'A motion-first product hero with an animated aurora field, staggered headline reveal, pointer-parallax media panel, and a live metric ticker.',
    fields: [
      'eyebrow',
      'title',
      'description',
      'links',
      'metrics',
      'productImage',
      'imageCaption',
      'proofItems',
    ],
    slug: 'hero-aurora',
    target: 'Motion hero',
    title: 'Hero Aurora',
  },
  {
    category: 'hero',
    description:
      'A motion-first editorial hero with a line-masked type reveal, cinematic media plate, and a velocity-aware marquee strip.',
    fields: [
      'eyebrow',
      'title',
      'description',
      'links',
      'marqueeItems',
      'image',
      'imageCaption',
      'proofItems',
    ],
    slug: 'hero-kinetic',
    target: 'Editorial motion hero',
    title: 'Hero Kinetic',
  },
  {
    category: 'features',
    description:
      'An asymmetric bento grid that leads with a featured cell and fills supporting cells.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-bento',
    target: 'Bento grid',
    title: 'Feature Bento',
  },
  {
    category: 'features',
    description:
      'A two-column feature section pairing a heading and CTA with a stacked feature list.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-split',
    target: 'Split section',
    title: 'Feature Split',
  },
  {
    category: 'features',
    description: 'A numbered steps block for sequential, how-it-works feature flows.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-steps',
    target: 'Steps section',
    title: 'Feature Steps',
  },
  {
    category: 'features',
    description:
      'A text-first feature grid with repeatable items, optional CTA wiring, and idempotent registration.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-grid-basic',
    target: 'Feature section',
    title: 'Feature Grid Basic',
  },
  {
    category: 'features',
    description:
      'A synchronized feature accordion with editor-selected icons, optional media, and CTA links.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-accordion',
    target: 'Feature accordion',
    title: 'Feature Accordion',
  },
  {
    category: 'features',
    description:
      'A two-column feature layout with independent media, optional icons, and CTA links.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-cards-media',
    target: 'Media feature cards',
    title: 'Feature Cards Media',
  },
  {
    category: 'features',
    description:
      'A dense feature grid with editor-selected icons and a tokenized radial grid decorator.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'feature-icon-grid',
    target: 'Icon feature grid',
    title: 'Feature Icon Grid',
  },
  {
    category: 'comparator',
    description:
      'A plan-column comparison card: pricing columns over a feature matrix, with a highlighted column and per-plan CTAs.',
    fields: ['title', 'description', 'plans', 'features'],
    slug: 'comparator-grid',
    target: 'Pricing grid',
    title: 'Comparator Grid',
  },
  {
    category: 'comparator',
    description:
      'A tiered feature-comparison table: plan columns with CTAs over grouped feature rows of checkmarks or text values.',
    fields: ['title', 'description', 'plans', 'features'],
    slug: 'comparator-table',
    target: 'Comparison table',
    title: 'Comparator Table',
  },
  {
    category: 'comparator',
    description:
      'A stacked plan-card comparison: one card per plan with its own price, CTA, and feature checklist.',
    fields: ['title', 'description', 'plans'],
    slug: 'comparator-stack',
    target: 'Plan cards',
    title: 'Comparator Stack',
  },
  {
    category: 'pricing',
    description:
      'A three-up pricing table of editable plan cards — price, period, feature list, and CTA — with one plan highlighted in emerald.',
    fields: ['eyebrow', 'title', 'description', 'plans'],
    slug: 'pricing-cards',
    target: 'Pricing section',
    title: 'Pricing Cards',
  },
  {
    category: 'pricing',
    description:
      'The three-up pricing table on soft muted card surfaces, with one plan highlighted in emerald.',
    fields: ['eyebrow', 'title', 'description', 'plans'],
    slug: 'pricing-cards-muted',
    target: 'Pricing section',
    title: 'Pricing Cards Muted',
  },
  {
    category: 'pricing',
    description:
      'The three-up pricing table with the call-to-action button placed inside each plan header.',
    fields: ['eyebrow', 'title', 'description', 'plans'],
    slug: 'pricing-cards-cta',
    target: 'Pricing section',
    title: 'Pricing Cards CTA',
  },
  {
    category: 'pricing',
    description:
      'A two-plan split pricing layout — a compact entry plan beside an expanded featured plan with its full feature list.',
    fields: ['eyebrow', 'title', 'description', 'plans'],
    slug: 'pricing-split',
    target: 'Pricing section',
    title: 'Pricing Split',
  },
  {
    category: 'pricing',
    description:
      'A single wide enterprise pricing panel: price and CTA beside an included-features list and an editable wall of trust logos.',
    fields: ['eyebrow', 'title', 'description', 'plans', 'logos'],
    slug: 'pricing-enterprise',
    target: 'Pricing section',
    title: 'Pricing Enterprise',
  },
  {
    category: 'cta',
    description:
      'A centered call-to-action block: heading, supporting copy, and one or two CTA links.',
    fields: ['title', 'description', 'links'],
    slug: 'call-to-action-centered',
    target: 'Call to action',
    title: 'Call To Action Centered',
  },
  {
    category: 'cta',
    description:
      'A boxed call-to-action block: heading, copy, and CTA links inside a nested panel.',
    fields: ['title', 'description', 'links'],
    slug: 'call-to-action-boxed',
    target: 'Boxed CTA',
    title: 'Call To Action Boxed',
  },
  {
    category: 'cta',
    description:
      'A split call-to-action block: heading and copy on one side, CTA links and an assurance line on the other.',
    fields: ['title', 'description', 'assurance', 'links'],
    slug: 'call-to-action-split',
    target: 'Split CTA',
    title: 'Call To Action Split',
  },
  {
    category: 'cta',
    description:
      'An email-capture call-to-action block: heading, copy, and a form that posts to a same-origin endpoint.',
    fields: ['title', 'description', 'emailPlaceholder', 'submitLabel', 'action'],
    slug: 'call-to-action-signup',
    target: 'Email capture',
    title: 'Call To Action Signup',
  },
  {
    category: 'contact',
    description:
      'A contact section with validated channels and a fixed accessible form that posts to a same-origin endpoint.',
    fields: [
      'eyebrow',
      'title',
      'description',
      'channels',
      'formTitle',
      'formDescription',
      'formLabels',
      'submitLabel',
      'action',
    ],
    slug: 'contact-routing-form',
    target: 'Contact section',
    title: 'Contact Routing Form',
  },
  {
    category: 'contact',
    description:
      'A form-free contact section: heading, supporting copy, and a grid of validated email, phone, and URL channels.',
    fields: ['eyebrow', 'title', 'description', 'channels', 'footnote'],
    slug: 'contact-channels',
    target: 'Contact channels',
    title: 'Contact Channels',
  },
  {
    category: 'integration',
    description: 'Concentric rings of integration logos that orbit a featured brand mark on hover.',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    slug: 'integration-orbit',
    target: 'Integration section',
    title: 'Integration Orbit',
  },
  {
    category: 'integration',
    description:
      'Three auto-scrolling rows of integration logos around a featured brand mark, with progressive edge fades.',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    slug: 'integration-marquee',
    target: 'Integration section',
    title: 'Integration Marquee',
  },
  {
    category: 'integration',
    description:
      'Integration logos wired to a central brand mark by connector lines, installed as a wired Payload block.',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo'],
    slug: 'integration-connect',
    target: 'Integration section',
    title: 'Integration Connect',
  },
  {
    category: 'integration',
    description:
      'A centered cluster of integration logos around a featured brand mark, with a heading and CTA.',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo', 'links'],
    slug: 'integration-cluster',
    target: 'Integration section',
    title: 'Integration Cluster',
  },
  {
    category: 'integration',
    description:
      'A two-column section pairing a featured-mark logo cluster with a heading, subtext, and CTA.',
    fields: ['heading', 'subtext', 'integrations', 'featuredLogo', 'links'],
    slug: 'integration-split',
    target: 'Integration section',
    title: 'Integration Split',
  },
  {
    category: 'integration',
    description:
      'A responsive grid of integration cards — logo, name, description, and a learn-more link — installed as a wired Payload block.',
    fields: ['heading', 'subtext', 'integrations'],
    slug: 'integration-grid',
    target: 'Integration section',
    title: 'Integration Grid',
  },
  {
    category: 'integration',
    description:
      'A vertical list of integration rows — logo, name, description, and an add action — installed as a wired Payload block.',
    fields: ['heading', 'subtext', 'integrations'],
    slug: 'integration-list',
    target: 'Integration section',
    title: 'Integration List',
  },
  {
    category: 'integration',
    description:
      'A two-column section pairing a customer quote with a grid of integration logo cards.',
    fields: ['heading', 'subtext', 'integrations', 'quote', 'author', 'role'],
    slug: 'integration-testimonial',
    target: 'Integration section',
    title: 'Integration Testimonial',
  },
  {
    category: 'logos',
    description: 'An auto-scrolling marquee of editable logos with progressive-blur edge fades.',
    fields: ['heading', 'logos'],
    slug: 'logo-cloud-marquee',
    target: 'Logo cloud',
    title: 'Logo Cloud Marquee',
  },
  {
    category: 'logos',
    description: 'A logo wall that dims and blurs on hover to reveal a single call-to-action.',
    fields: ['heading', 'logos', 'links'],
    slug: 'logo-cloud-hover',
    target: 'Logo cloud',
    title: 'Logo Cloud Hover',
  },
  {
    category: 'logos',
    description:
      'A centered, wrapping wall of editable logo uploads under a heading, installed as a wired Payload block.',
    fields: ['heading', 'logos'],
    slug: 'logo-cloud-grid',
    target: 'Logo cloud',
    title: 'Logo Cloud Grid',
  },
  {
    category: 'logos',
    description: 'A compact label-over-logos strip for editable trust logos.',
    fields: ['heading', 'logos'],
    slug: 'logo-cloud-inline',
    target: 'Logo cloud',
    title: 'Logo Cloud Inline',
  },
  {
    category: 'logos',
    description: 'A single wrapping row that keeps the label inline with editable trust logos.',
    fields: ['heading', 'logos'],
    slug: 'logo-cloud-inline-wrap',
    target: 'Logo cloud',
    title: 'Logo Cloud Inline Wrap',
  },
  {
    category: 'testimonials',
    description:
      'A testimonials section: a heading above a responsive grid of quote cards, each with author, optional role, and avatar.',
    fields: ['eyebrow', 'title', 'description', 'testimonials'],
    slug: 'testimonials-grid',
    target: 'Testimonials section',
    title: 'Testimonials Grid',
  },
  {
    category: 'testimonials',
    description:
      'A testimonials bento: an asymmetric grid with one featured quote in a large cell and supporting quotes around it.',
    fields: ['eyebrow', 'title', 'description', 'testimonials'],
    slug: 'testimonials-bento',
    target: 'Testimonials section',
    title: 'Testimonials Bento',
  },
  {
    category: 'testimonials',
    description:
      'A dense wall-of-love: a multi-column masonry of compact testimonial cards, each with author, optional role, and avatar.',
    fields: ['eyebrow', 'title', 'description', 'testimonials'],
    slug: 'testimonials-wall',
    target: 'Testimonials section',
    title: 'Testimonials Wall',
  },
  {
    category: 'testimonials',
    description:
      'A testimonials section: a responsive grid of review cards, each with a star rating, quote, author, optional role, and avatar.',
    fields: ['eyebrow', 'title', 'description', 'testimonials'],
    slug: 'testimonials-rating',
    target: 'Testimonials section',
    title: 'Testimonials Rating',
  },
  {
    category: 'testimonials',
    description:
      'A single centered testimonial with a quote-mark, large avatar, author, and role — a hero-style social-proof moment.',
    fields: ['quote', 'author', 'role', 'avatar'],
    slug: 'testimonials-spotlight',
    target: 'Testimonials section',
    title: 'Testimonials Spotlight',
  },
  {
    category: 'testimonials',
    description:
      'A single featured testimonial: a quote with a left accent bar, author, optional role, and avatar.',
    fields: ['quote', 'author', 'role', 'avatar'],
    slug: 'testimonials-quote',
    target: 'Testimonials section',
    title: 'Testimonials Quote',
  },
  {
    category: 'stats',
    description:
      'A proof section pairing narrative, prominent string metrics, and a semantic customer quote.',
    fields: [
      'eyebrow',
      'title',
      'description',
      'body',
      'metrics',
      'quote',
      'author',
      'role',
      'logo',
      'logoLabel',
    ],
    slug: 'stats-proof',
    target: 'Stats section',
    title: 'Stats Proof',
  },
  {
    category: 'stats',
    description:
      'Heading and intro above a responsive grid of large string metrics on rule-topped columns.',
    fields: ['eyebrow', 'title', 'description', 'metrics'],
    slug: 'stats-grid',
    target: 'Stats section',
    title: 'Stats Grid',
  },
  {
    category: 'stats',
    description:
      'A centred heading above one divided panel that splits metrics into equal columns.',
    fields: ['eyebrow', 'title', 'metrics'],
    slug: 'stats-card',
    target: 'Stats section',
    title: 'Stats Card',
  },
  {
    category: 'stats',
    description:
      'Heading and intro above rule-topped rows where each figure reads as one sentence.',
    fields: ['eyebrow', 'title', 'description', 'metrics'],
    slug: 'stats-inline',
    target: 'Stats section',
    title: 'Stats Inline',
  },
  {
    category: 'faq',
    description:
      'A two-column FAQ pairing a sticky heading and CTA with an accordion of question/answer items.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'faq-split',
    target: 'FAQ section',
    title: 'Faq Split',
  },
  {
    category: 'faq',
    description:
      'A centered FAQ accordion of question/answer items with an optional CTA — the base of the FAQ family.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'faq-accordion',
    target: 'FAQ section',
    title: 'Faq Accordion',
  },
  {
    category: 'faq',
    description: 'An FAQ split into titled, icon-tagged category groups of accordions.',
    fields: ['eyebrow', 'title', 'description', 'groups'],
    slug: 'faq-grouped',
    target: 'FAQ section',
    title: 'Faq Grouped',
  },
  {
    category: 'faq',
    description: 'A centered FAQ accordion wrapped in a card with an optional CTA below.',
    fields: ['eyebrow', 'title', 'description', 'items', 'links'],
    slug: 'faq-card',
    target: 'FAQ section',
    title: 'Faq Card',
  },
  {
    category: 'faq',
    description: 'An FAQ accordion with a per-question icon picked from a fixed allowlist.',
    fields: ['eyebrow', 'title', 'description', 'items'],
    slug: 'faq-icons',
    target: 'FAQ section',
    title: 'Faq Icons',
  },
  {
    category: 'faq',
    description:
      'A static two-column grid of question/answer cards — every answer visible, no accordion.',
    fields: ['eyebrow', 'title', 'description', 'items'],
    slug: 'faq-grid',
    target: 'FAQ section',
    title: 'Faq Grid',
  },
  {
    category: 'content',
    description:
      'A centered content section with an intro, a full-width image, and a four-up grid of icon features.',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'features'],
    slug: 'content-showcase',
    target: 'Content section',
    title: 'Content Showcase',
  },
  {
    category: 'content',
    description:
      'A content section led by a full-width image above a two-column heading, body, and CTA.',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'links'],
    slug: 'content-image-lead',
    target: 'Content section',
    title: 'Content Image Lead',
  },
  {
    category: 'content',
    description:
      'A content section pairing a side media panel with body copy and two icon features.',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'image'],
    slug: 'content-feature-split',
    target: 'Content section',
    title: 'Content Feature Split',
  },
  {
    category: 'content',
    description:
      'A content section pairing body copy and two icon features beside a framed media panel.',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'image'],
    slug: 'content-feature-media',
    target: 'Content section',
    title: 'Content Feature Media',
  },
  {
    category: 'content',
    description: 'A centered content section with an intro and a layered, framed screenshot.',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'backgroundImage'],
    slug: 'content-image-frame',
    target: 'Content section',
    title: 'Content Image Frame',
  },
  {
    category: 'content',
    description: 'A content section with an intro and alternating media-and-text rows.',
    fields: ['eyebrow', 'title', 'paragraphs', 'rows'],
    slug: 'content-split-rows',
    target: 'Content section',
    title: 'Content Split Rows',
  },
  {
    category: 'content',
    description: 'A content section with an intro and a uniform stack of media-and-text rows.',
    fields: ['eyebrow', 'title', 'paragraphs', 'rows'],
    slug: 'content-rows',
    target: 'Content section',
    title: 'Content Rows',
  },
  {
    category: 'content',
    description: 'A content section with an intro, a grid of icon features, and a stats list.',
    fields: ['eyebrow', 'title', 'paragraphs', 'features', 'stats'],
    slug: 'content-stats',
    target: 'Content section',
    title: 'Content Stats',
  },
  {
    category: 'content',
    description: 'A content section pairing a media panel with body copy and a cited pull quote.',
    fields: ['eyebrow', 'title', 'paragraphs', 'image', 'quote', 'citation', 'logo', 'logoLabel'],
    slug: 'content-quote',
    target: 'Content section',
    title: 'Content Quote',
  },
  {
    category: 'content',
    description:
      'A centered content section with a heading, body copy, and a wall of community avatars.',
    fields: ['eyebrow', 'title', 'paragraphs', 'avatars'],
    slug: 'content-community',
    target: 'Content section',
    title: 'Content Community',
  },
  {
    category: 'content',
    description:
      'A two-column content section pairing a heading with body paragraphs and a CTA, installed as a wired Payload block.',
    fields: ['eyebrow', 'title', 'paragraphs', 'links'],
    slug: 'content-columns',
    target: 'Content section',
    title: 'Content Columns',
  },
  {
    category: 'content',
    description: 'A serif-headed content section pairing a heading with a labeled-term list.',
    fields: ['eyebrow', 'title', 'items'],
    slug: 'content-list',
    target: 'Content section',
    title: 'Content List',
  },
  {
    category: 'content',
    description: 'A serif-headed content section with a two-column labeled-term list.',
    fields: ['eyebrow', 'title', 'items'],
    slug: 'content-list-columns',
    target: 'Content section',
    title: 'Content List Columns',
  },
  {
    category: 'content',
    description: 'A serif-headed content section with an intro and a multi-column icon list.',
    fields: ['eyebrow', 'title', 'description', 'items'],
    slug: 'content-list-icons',
    target: 'Content section',
    title: 'Content List Icons',
  },
  {
    category: 'team',
    description:
      'A team section with a heading, intro, and a responsive grid of member photo cards that reveal role on hover.',
    fields: ['eyebrow', 'title', 'description', 'members'],
    slug: 'team-grid',
    target: 'Team section',
    title: 'Team Grid',
  },
  {
    category: 'team',
    description:
      'A bio-forward team section: heading, intro, and two-up member cards carrying avatar, role, and a short biography.',
    fields: ['eyebrow', 'title', 'description', 'members'],
    slug: 'team-bios',
    target: 'Team bios',
    title: 'Team Bios',
  },
  {
    category: 'team',
    description:
      'A team section that groups members into titled departments, each a grid of avatars with name and role.',
    fields: ['eyebrow', 'title', 'groups'],
    slug: 'team-roster',
    target: 'Team section',
    title: 'Team Roster',
  },
  {
    category: 'embed',
    description:
      'A responsive, sandboxed iframe block for approved HTTPS embeds with a selectable aspect ratio.',
    fields: ['url', 'title', 'aspectRatio', 'caption', 'allowFullscreen'],
    slug: 'embed-basic',
    target: 'Embed / media',
    title: 'Embed Basic',
  },
  {
    category: 'footer',
    description:
      'A brand block beside labelled columns of navigation links, closed by a copyright rule.',
    fields: ['logo', 'brandLabel', 'copyright', 'tagline', 'groups'],
    slug: 'footer-columns',
    target: 'Footer',
    title: 'Footer Columns',
  },
  {
    category: 'footer',
    description:
      'A compact footer keeping the brand and one wrapped row of links on a line, copyright beneath.',
    fields: ['logo', 'brandLabel', 'copyright', 'links'],
    slug: 'footer-simple',
    target: 'Footer',
    title: 'Footer Simple',
  },
  {
    category: 'footer',
    description:
      'A centred brand, tagline, and navigation above a rule carrying copyright and policy links.',
    fields: ['logo', 'brandLabel', 'copyright', 'tagline', 'links', 'legalLinks'],
    slug: 'footer-centered',
    target: 'Footer',
    title: 'Footer Centered',
  },
] as const

const editorialBySlug = new Map<string, (typeof componentEditorialEntries)[number]>(
  componentEditorialEntries.map((component) => [component.slug, component]),
)

export const componentEntries = generatedCatalog.components.map((generated) => {
  const entry = editorialBySlug.get(generated.slug)

  if (!entry) {
    throw new Error(`Generated component "${generated.slug}" has no editorial catalog entry.`)
  }

  return {
    ...entry,
    command: `npx payload-components add ${entry.slug}`,
    family: componentCategories[entry.category].family,
    href: `/docs/components/${entry.slug}`,
    version: generated.version,
  }
})

if (componentEntries.length !== componentEditorialEntries.length) {
  throw new Error('Editorial component catalog contains an entry that is not in the registry.')
}

export type ComponentEntry = (typeof componentEntries)[number]

export const upcomingComponents = [
  {
    category: 'cards',
    description: 'A post card with image, categories, date, title, and excerpt.',
    family: 'posts',
    slug: 'post-card',
    target: 'Archive card',
    title: 'Post Card',
  },
  {
    category: 'archive',
    description: 'An archive grid for rendering arrays of post summaries.',
    family: 'posts',
    slug: 'post-archive',
    target: 'Archive grid',
    title: 'Post Archive',
  },
  {
    category: 'header',
    description: 'A post hero with category, author, date, and summary.',
    family: 'posts',
    slug: 'post-hero',
    target: 'Post header',
    title: 'Post Hero',
  },
  {
    category: 'index',
    description: 'A featured post surface with image, category, and date.',
    family: 'posts',
    slug: 'featured-post',
    target: 'Index spotlight',
    title: 'Featured Post',
  },
  {
    category: 'index',
    description: 'A compact post list with dates, categories, and descriptions.',
    family: 'posts',
    slug: 'post-list',
    target: 'Compact index',
    title: 'Post List',
  },
  {
    category: 'author',
    description: 'An author profile card for article pages and editorial bylines.',
    family: 'posts',
    slug: 'author-card',
    target: 'Byline',
    title: 'Author Card',
  },
  {
    category: 'newsletter',
    description: 'A newsletter callout for post pages and editorial surfaces.',
    family: 'posts',
    slug: 'newsletter-callout',
    target: 'Engagement',
    title: 'Newsletter Callout',
  },
  {
    category: 'related',
    description: 'A related-posts section for compact recommendations.',
    family: 'posts',
    slug: 'related-posts',
    target: 'Post footer',
    title: 'Related Posts',
  },
] as const

export type UpcomingComponent = (typeof upcomingComponents)[number]

export const componentsIntro =
  "No screenshots — each backend-free specimen mirrors the installable component's visual classes."

export const componentFamilies = {
  pages: {
    countLabel: 'Installable',
    description:
      'Blocks for the Pages layout builder — installed with full wiring: collection config, render mapping, generated types, import map.',
    name: 'Page blocks',
  },
  posts: {
    countLabel: 'In development',
    description:
      'Editorial surfaces for the Posts collection — component-level installs, no block wiring needed. In development.',
    name: 'Post components',
  },
} as const
