import type { TemplateShowcase } from './types'

/* Agency Studio — "Northline", a fictional brand and digital-product studio.
 *
 * Art direction: editorial, warm, portfolio-led. Every string below is
 * original Northline copy written for this concept; clients, people, metrics,
 * and testimonials are invented and plausible, never real. Content stays
 * editor-shaped (the demo-content types demanded by TemplateSectionContentMap)
 * so a future installer RFC can reuse the recipe as Payload field data.
 *
 * CTA labels correspond to routes included in this concept:
 * 'Start a project' / 'Ask about availability' / 'Book a first conversation' /
 * 'Ask us directly' / 'Introduce yourself' → contact · 'See the work' /
 * 'See it in the work' → work · 'Read about the studio' → about. */

export const agencyStudioTemplate: TemplateShowcase = {
  assets: [],
  category: 'agency',
  description:
    'Northline is a fictional twenty-three-person brand and digital-product studio in Amsterdam and New York. The concept spans Home, Services, Work, About, and Contact — an editorial, warm, portfolio-led site composed entirely from blocks in the open registry, art-directed with paper surfaces, ink serif headlines, hairline rules, and a single rust accent.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Work', path: 'work' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'States the studio point of view, shows the practice, proof, and the people behind it.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-video',
          content: {
            description:
              'Northline is a twenty-three-person studio in Amsterdam and New York. We design identities, digital products, and the editorial systems that keep them coherent long after launch.',
            eyebrow: 'Northline — Brand & Digital Studio',
            links: [
              { link: { appearance: 'default', label: 'See the work' } },
              { link: { appearance: 'outline', label: 'Start a project' } },
            ],
            proofItems: [
              { label: 'Independent since 2017' },
              { label: 'Amsterdam · New York' },
              { label: '31 brands shipped' },
            ],
            title: 'We build brands that hold their nerve.',
          },
          id: 'cover',
        },
        {
          componentSlug: 'logo-cloud-inline-wrap',
          content: {
            heading: 'Nine years of good company:',
          },
          id: 'clients',
          tone: 'muted',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'The practice',
            features: [
              {
                description: 'Naming, marks, and visual languages built to be used, not framed.',
                icon: 'sparkles',
                title: 'Identity',
              },
              {
                description: 'Sites and products designed and shipped with the identity, not after it.',
                icon: 'cpu',
                title: 'Digital product',
              },
              {
                description: 'Voice, content systems, and the discipline to say less, better.',
                icon: 'zap',
                title: 'Editorial',
              },
              {
                description: 'Title sequences, product film, and the thirty seconds people remember.',
                icon: 'gauge',
                title: 'Motion & film',
              },
            ],
            paragraphs: [
              {
                text: 'Strategy, identity, product, and editorial sit at the same table from the first week. Nothing gets thrown over a wall, and nobody presents work they did not help make.',
              },
            ],
            title: 'One studio. Four disciplines. No handoffs.',
          },
          id: 'practice',
        },
        {
          componentSlug: 'feature-split',
          content: {
            description:
              'No account layer, no B-team. The people who pitch the work make the work — and they will tell you when you are wrong.',
            eyebrow: 'How we work',
            items: [
              {
                description:
                  'Every engagement is led by a founding partner, from kickoff to launch day.',
                title: 'Principals in the room',
              },
              {
                description:
                  'Focused cycles with something real on the table every Friday — no big reveals.',
                title: 'Weeks, not quarters',
              },
              {
                description:
                  'You leave with a living system your own team can run, not a folder of finals.',
                title: 'Systems, not files',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Read about the studio' } }],
            title: 'Small rooms. Senior people. Real decisions.',
          },
          id: 'approach',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Petra Molnar',
            body: 'Hollis & Crane relaunched across 140 years of archive material without losing a single regular customer.',
            description:
              'We measure the work by what it does after we leave: brands that stay coherent, products that ship, and teams that keep the system alive without us.',
            eyebrow: 'The record',
            metrics: [
              { label: 'brands shipped since 2017', value: '31' },
              { label: 'of clients come back', value: '74%' },
              { label: 'median engagement', value: '11 wks' },
              { label: 'cities, one studio', value: '2' },
            ],
            quote:
              'Northline told us the truth about our brand, then gave us the tools to act on it. Three years on, we still open their brand book every week.',
            role: 'Managing Director, Hollis & Crane',
            title: 'Quiet studio, loud results.',
          },
          id: 'proof',
          tone: 'muted',
        },
        {
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'Jonas Verhoeven',
              quote:
                'They treat a brand the way an editor treats a manuscript — nothing precious, everything considered. The work got sharper every single week.',
              role: 'Founder, Tidewater Ferries',
            },
          },
          id: 'voices',
          tone: 'contrast',
        },
        {
          componentSlug: 'team-roster',
          content: {
            eyebrow: 'The studio',
            groups: [
              {
                label: 'Founding partners',
                members: [
                  { name: 'Mara Lindqvist', role: 'Strategy & Voice' },
                  { name: 'Deniz Okur', role: 'Design Director' },
                  { name: 'August Rhee', role: 'Product & Engineering' },
                  { name: 'Ines Beaumont', role: 'Editorial Director' },
                ],
              },
            ],
            title: 'The people you will actually work with.',
          },
          id: 'principals',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'A first conversation costs nothing and usually saves a quarter of wandering. Tell us what you are making.',
            links: [
              { link: { appearance: 'default', label: 'Start a project' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'Say the hard thing. We will help you say it well.',
          },
          id: 'cta',
        },
      ],
      title: 'Northline — A brand and digital product studio',
    },
    {
      description: 'Explains the two engagement shapes, six disciplines, method, and deliverables.',
      label: 'Services',
      path: 'services',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Two engagement shapes, six disciplines, one team. Everything we sell is on this page, priced by conversation rather than rate card.',
            eyebrow: 'Services',
            links: [{ link: { appearance: 'default', label: 'Ask about availability' } }],
            proofItems: [
              { label: 'Principal-led' },
              { label: 'Fixed teams' },
              { label: 'Weekly cadence' },
            ],
            title: 'From first question to shipped work.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Two ways in',
            links: [{ link: { appearance: 'outline', label: 'Ask about availability' } }],
            paragraphs: [
              {
                text: 'The Sprint is six to twelve weeks with a fixed team and a fixed promise: a full identity, a launched product, or both. It suits founders with momentum and institutions with a deadline.',
              },
              {
                text: 'The Retainer is for brands we have already built together. A standing team keeps the system honest — campaigns, product cycles, and the hundred small decisions that erode a brand when nobody owns them.',
              },
            ],
            title: 'The Sprint, or the long game.',
          },
          id: 'offers',
        },
        {
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'Every discipline is practiced in-house by the people who lead it. When a project needs something outside this list, we say so and recommend someone better.',
            eyebrow: 'Disciplines',
            items: [
              {
                description:
                  'Positioning, architecture, and the argument your brand makes before design begins.',
                icon: 'chart',
                title: 'Brand strategy',
              },
              {
                description:
                  'Marks, typography, and colour built as a system, with rules your team can hold.',
                icon: 'fingerprint',
                title: 'Identity systems',
              },
              {
                description:
                  'Names that clear trademark and survive the boardroom; a voice your writers can keep.',
                icon: 'id-card',
                title: 'Naming & voice',
              },
              {
                description:
                  'Marketing sites and product interfaces, designed and built by the same hands.',
                icon: 'zap',
                title: 'Digital products',
              },
              {
                description:
                  'Tokens, components, and documentation that keep product and brand in step.',
                icon: 'database',
                title: 'Design systems',
              },
              {
                description:
                  'Standing counsel on retainer: reviews, refreshes, and a firm no when it matters.',
                icon: 'shield',
                title: 'Brand guardianship',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See the work' } }],
            title: 'Six things we do well. Nothing we do not.',
          },
          id: 'disciplines',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'The process is not the product, so we keep it short enough to explain in one breath.',
            eyebrow: 'Method',
            items: [
              {
                description:
                  'Two weeks inside your world — customers, archives, numbers, and the questions nobody has asked out loud.',
                title: 'Immerse',
              },
              {
                description:
                  'One page that states what the brand is, what it refuses, and what the work must prove. Everyone signs it.',
                title: 'Define',
              },
              {
                description:
                  'Design and build in weekly cycles, with something real on the table every Friday until launch.',
                title: 'Make',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Book a first conversation' } }],
            title: 'Three moves. No mystery.',
          },
          id: 'method',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'Everything we hand over is built to be used by your team on an ordinary Tuesday, without us in the room.',
            eyebrow: 'What you keep',
            items: [
              {
                description:
                  'Strategy, system, and voice in one working document — with the reasoning attached, so future decisions stay easy.',
                icon: 'chart',
                title: 'A brand book that gets opened',
              },
              {
                description:
                  'Production code, a documented design system, and a content model your editors actually enjoy.',
                icon: 'zap',
                title: 'A product your team can run',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See the work' } }],
            title: 'Deliverables that outlive the engagement.',
          },
          id: 'deliverables',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description:
              'What most clients want to know before the first call, answered the way we would answer in person.',
            eyebrow: 'Before you ask',
            items: [
              {
                answer:
                  'Sprints start where a senior annual hire would, and we will give you a number in the first call — no discovery-phase suspense.',
                question: 'What does an engagement cost?',
              },
              {
                answer:
                  'We run three teams and book six to eight weeks out. If your deadline is real, say so — we occasionally re-sequence for the right project.',
                question: 'How fast can we start?',
              },
              {
                answer:
                  'Preferably. The system lands better when the people who will run it help build it. Your designers and writers get a seat, not a review link.',
                question: 'Do you work with in-house teams?',
              },
              {
                answer:
                  'Yes. A founding partner leads every engagement from kickoff to launch — it is the only way we know to keep the bar where we put it.',
                question: 'Will the partners actually be involved?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Ask us directly' } }],
            title: 'The honest answers.',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Two paragraphs about your project beats a forty-page brief. We reply within two working days — with a yes, a no, or a better idea.',
            links: [
              { link: { appearance: 'default', label: 'Start a project' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'Tell us what you are making.',
          },
          id: 'cta',
        },
      ],
      title: 'Northline — Services',
    },
    {
      description:
        'A curated portfolio narrative: five invented case stories with client proof.',
      label: 'Work',
      path: 'work',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'We publish little, deliberately — client work should speak in its own market first. These five projects show the range: heritage retail, regional banking, coastal transit, healthcare, and independent publishing.',
            links: [],
            eyebrow: 'Selected work',
            proofItems: [
              { label: '2017–2026' },
              { label: 'Identity · Product · Editorial' },
            ],
            title: 'Thirty-one brands. Five stories worth your time.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'Hollis & Crane — Heritage retail',
            paragraphs: [
              {
                text: 'Hollis & Crane came to us with three floors of archive and a website that apologised for both. We rebuilt the identity from the 1926 ledger stamps, wrote a voice that sounds like the shop floor, and shipped a commerce experience that made the archive the storefront. Online revenue tripled in the first year; the letterpress department is profitable for the first time since 1989.',
              },
            ],
            title: 'A 140-year-old stationer learns to sell online without selling out.',
          },
          id: 'lead',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Meridian Mutual & Tidewater',
            paragraphs: [
              {
                text: 'Different sectors, same brief underneath: institutions people depend on, speaking a language nobody trusted. Both projects began with the words, not the visuals.',
              },
            ],
            rows: [
              {
                description:
                  'A 96-branch credit union with paperwork nobody could read. We rewrote the product language first, then rebuilt the identity and app around it. Complaint volume fell by a third; new accounts among under-35s doubled.',
                title: 'Meridian Mutual — Banking in plain language',
              },
              {
                description:
                  'Nine islands, four seasons, one confusing timetable. A new mark, a signage system that survives salt spray, and live-service screens run from a small CMS the crew updates from the dock.',
                title: 'Tidewater Ferries — Wayfinding for a coastline',
              },
            ],
            title: 'Two institutions, one discipline.',
          },
          id: 'case-studies',
          tone: 'muted',
        },
        {
          componentSlug: 'content-feature-split',
          content: {
            eyebrow: 'Aster Health — Digital product',
            features: [
              {
                description:
                  'No tracking, no dark patterns, and health data that never leaves the region.',
                icon: 'lock',
                title: 'Private by design',
              },
              {
                description:
                  'Median booking time across 40,000 appointments in the first six months.',
                icon: 'gauge',
                title: 'Ninety seconds, measured',
              },
            ],
            paragraphs: [
              {
                text: 'Aster runs nineteen clinics and was losing patients to a phone queue. We designed and built the booking flow, the triage language, and the design system behind both — then trained their team to own it.',
              },
            ],
            title: 'Booking a clinic visit in ninety seconds.',
          },
          id: 'feature',
        },
        {
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Collected from post-project reviews, quoted with permission, edited only for length.',
            items: [
              {
                author: 'Petra Molnar',
                quote:
                  'The first deck they showed us was the one we launched. I have never seen that before.',
                role: 'Managing Director, Hollis & Crane',
              },
              {
                author: 'Sam Idowu',
                quote:
                  'They killed our favourite idea in week two, and they were right. The one that replaced it won over our own board.',
                role: 'Head of Brand, Meridian Mutual',
              },
              {
                author: 'Jonas Verhoeven',
                quote:
                  'Our crew updates the ferry screens from a phone on the dock. That sentence was science fiction two years ago.',
                role: 'Founder, Tidewater Ferries',
              },
              {
                author: 'Amara Sy',
                quote:
                  'Northline writes like clinicians and designs like publishers. Our patients noticed within a week.',
                role: 'Clinical Director, Aster Health',
              },
              {
                author: 'Ruth Ellison',
                quote:
                  'The brand book is the most-read document in the company — including the payroll calendar.',
                role: 'Publisher, Cobalt Editions',
              },
              {
                author: 'Felix Braun',
                quote: 'Expensive, punctual, and worth it. Hire them before your competitor does.',
                role: 'CEO, Larkspur Markets',
              },
            ],
            title: 'What clients say when we are out of the room.',
          },
          id: 'wall',
          tone: 'contrast',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'We take on eight to ten projects a year and choose them carefully. Tell us what you are making and where it needs to go.',
            links: [
              { link: { appearance: 'default', label: 'Start a project' } },
              { link: { appearance: 'outline', label: 'Read about the studio' } },
            ],
            title: 'The next story on this page could be yours.',
          },
          id: 'cta',
        },
      ],
      title: 'Northline — Work',
    },
    {
      description: 'Explains the philosophy, the founders, the record, the roster, and the open door.',
      label: 'About',
      path: 'about',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Twenty-three people in Amsterdam and New York who believe clarity is a competitive advantage and taste is a discipline. Independent since 2017, profitable since 2018, never acquired.',
            links: [],
            eyebrow: 'About',
            proofItems: [
              { label: '23 people' },
              { label: 'Two cities' },
              { label: 'Zero investors' },
            ],
            title: 'A studio, not an agency.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'What we believe',
            links: [{ link: { appearance: 'outline', label: 'See it in the work' } }],
            paragraphs: [
              {
                text: 'Most brands do not have a design problem; they have a decision problem. The logo is fine. The product is fine. What is missing is one clear sentence everyone upstream agreed to — so we start there, and we do not touch a typeface until it is written.',
              },
            ],
            title: 'Clarity is a design decision.',
          },
          id: 'philosophy',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Mara Lindqvist, founding partner',
            eyebrow: 'From the founders',
            paragraphs: [
              {
                text: 'We founded Northline after a decade inside large agencies, watching good work die in handoffs between departments that never met. The fix was structural, not motivational: keep the room small enough that everyone hears the client say the important thing.',
              },
            ],
            quote:
              'Every brand we admire says one true thing, repeatedly, in a voice you could pick out of a crowd. That is the entire method. The rest is craft and stamina.',
            title: 'Why we kept the studio small.',
          },
          id: 'founders',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The record',
            features: [
              {
                description:
                  'Practised daily: crits every Thursday, no exceptions, partners included.',
                icon: 'sparkles',
                title: 'Taste is a discipline',
              },
              {
                description:
                  'No investors, no network, no upsell quota — advice with nothing behind it but the work.',
                icon: 'shield',
                title: 'Independence keeps us honest',
              },
              {
                description:
                  'Constraint sharpens judgement. Every project ships on a named date.',
                icon: 'gauge',
                title: 'Deadlines are design tools',
              },
            ],
            paragraphs: [
              {
                text: 'We have turned down more work than we have taken, kept the team under twenty-five, and never chased a pitch we did not believe. These are the numbers we actually watch.',
              },
            ],
            stats: [
              { label: 'Founded in Amsterdam', value: '2017' },
              { label: 'People across two studios', value: '23' },
              { label: 'Brands shipped', value: '31' },
              { label: 'Clients who return', value: '74%' },
            ],
            title: 'Slow growth, on purpose.',
          },
          id: 'record',
          tone: 'muted',
        },
        {
          componentSlug: 'team-roster',
          content: {
            description:
              'No account layer, no juniors hidden in the back. This is the whole senior bench.',
            eyebrow: 'The roster',
            groups: [
              {
                label: 'Founding partners',
                members: [
                  { name: 'Mara Lindqvist', role: 'Strategy & Voice' },
                  { name: 'Deniz Okur', role: 'Design Director' },
                  { name: 'August Rhee', role: 'Product & Engineering' },
                  { name: 'Ines Beaumont', role: 'Editorial Director' },
                ],
              },
              {
                label: 'Studio',
                members: [
                  { name: 'Noor El-Amin', role: 'Senior Brand Designer' },
                  { name: 'Tomas Brandt', role: 'Design Engineer' },
                  { name: 'Yuki Onodera', role: 'Motion Designer' },
                  { name: 'Callum Doyle', role: 'Senior Writer' },
                ],
              },
            ],
            title: 'Everyone here makes things.',
          },
          id: 'roster',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Mara Lindqvist' },
              { name: 'Deniz Okur' },
              { name: 'August Rhee' },
              { name: 'Ines Beaumont' },
              { name: 'Noor El-Amin' },
              { name: 'Tomas Brandt' },
              { name: 'Yuki Onodera' },
              { name: 'Callum Doyle' },
            ],
            eyebrow: 'Open door',
            paragraphs: [
              {
                text: 'The Amsterdam studio opens once a month for talks, crits, and arguments about typography — free, recorded, and open to anyone. Students get first crack at the portfolio reviews.',
              },
            ],
            title: 'Northline Nights, first Thursday of the month.',
          },
          id: 'community',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'We hire slowly and answer everyone. If the work on this site looks like the work you want to make, introduce yourself.',
            links: [
              { link: { appearance: 'default', label: 'Introduce yourself' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'Work here, or work with us.',
          },
          id: 'cta',
        },
      ],
      title: 'Northline — About',
    },
    {
      description:
        'Routes new business, studio, and post conversations without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Skip the RFP. Two honest paragraphs — what you are making, where it is stuck, when it needs to exist — and we will come back with a yes, a no, or a better idea.',
            links: [],
            eyebrow: 'Contact',
            proofItems: [
              { label: 'Replies within two working days' },
              { label: 'No pitch theatre' },
            ],
            title: 'Tell us what you are trying to say.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Projects, retainers, and first conversations. Read by a founding partner every morning.',
                label: 'New business',
                value: 'new@northline.studio',
              },
              {
                description:
                  'Amsterdam, Monday to Friday, 9:30–18:00 CET. New York picks up after 15:00.',
                label: 'The studio',
                value: '+31 20 555 0141',
              },
              {
                description: 'Post, portfolios, and the occasional pigeon. Visits by appointment.',
                label: 'Everything else',
                value: 'Herengracht 480, 1017 CB Amsterdam',
              },
            ],
            description: 'Every message lands with a partner, not a shared inbox rota.',
            eyebrow: 'Routes',
            formConfigured: true,
            formDescription:
              'The form feeds straight into our Monday review. Budget honesty gets you a faster, better answer.',
            formLabels: ['Name', 'Email', 'Company', 'Timeline', 'What are you making?'],
            formTitle: 'Start the conversation',
            submitLabel: 'Send it north',
            title: 'Three ways to reach the studio.',
          },
          id: 'routes',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'The questions that decide it, answered plainly.',
            eyebrow: 'Fit',
            items: [
              {
                answer:
                  'Sprints typically land in the range of a senior annual hire; retainers are scoped per quarter. If that is out of reach, ask anyway — we keep a shortlist of smaller studios we rate.',
                question: 'What budgets do you work with?',
              },
              {
                answer:
                  'Rarely, and only alongside a paid engagement with a founder we already know. Cash keeps the advice clean.',
                question: 'Do you take equity or performance deals?',
              },
              {
                answer:
                  'Yes. Roughly a third of our work is evolution rather than reinvention — the discipline is knowing which one you actually need.',
                question: 'Can you work with our existing brand?',
              },
              {
                answer:
                  'The thinking happens in rooms; the making happens anywhere. Expect two or three in-person weeks per engagement — in Amsterdam, New York, or your office.',
                question: 'Do you work remotely?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Start a project' } }],
            title: 'Are we the right studio for you?',
          },
          id: 'fit',
          tone: 'muted',
        },
      ],
      title: 'Northline — Contact',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'agency-studio',
  status: 'concept',
  summary:
    'An editorial studio site concept — warm paper, ink serif headlines, one rust accent — for a fictional brand and digital-product practice.',
  theme: {
    description:
      'Warm paper surfaces, ink foreground, a single rust accent, italic serif display type, hairline rules, sharp corners, and cinematic full-bleed bands.',
    id: 'agency-studio',
    swatches: ['#f5f0e6', '#2b241d', '#a03e1f'],
  },
  title: 'Agency Studio',
  visualTone: ['Editorial', 'Warm', 'Portfolio-led'],
}
