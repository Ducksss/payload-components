import type { TemplateShowcase } from './types'

/* Portfolio Solo — "Ilse Renko", a fictional solo designer-developer in Tallinn.
 *
 * Art direction: the most restrained concept in the gallery. Cool off-white
 * paper, near-black ink, hairline rules instead of card chrome, small precise
 * type on a single narrow column, and one low-chroma slate accent used almost
 * grudgingly. Personality comes from typographic precision and a first-person
 * voice, not decoration — where the other concepts fill space, this one leaves
 * it empty on purpose.
 *
 * Voice: first person singular, always. No agency plural, no "we deliver", no
 * team behind the maker. `stats-proof` and `testimonials-wall` are framed
 * honestly for one person: years worked alone, projects logged, clients who
 * came back, and quotes about what it is like to work with an individual.
 *
 * Every string below is original fiction written for this concept. Ilse Renko,
 * her clients (Kaskad, Lume Type, Icefield Institute, Nordsund Rail,
 * Plainform), her collaborators, and every number are invented; any
 * resemblance to real people or companies is coincidental. Content stays
 * editor-shaped (the demo-content types demanded by TemplateSectionContentMap)
 * so a future installer RFC can reuse the recipe as Payload field data.
 *
 * CTA labels correspond to routes included in this concept:
 * 'Say hello' → contact · 'See the work' / 'See it in the work' → work ·
 * 'Read about me' → about · 'Read the notes' → writing.
 *
 * One section swap against the frozen skeleton: the Writing page's `topics`
 * section moved content-showcase → content-columns. Rationale in the page
 * comment below. */

export const portfolioSoloTemplate: TemplateShowcase = {
  assets: [],
  category: 'portfolio',
  description:
    'Ilse Renko is a fictional solo designer-developer working alone from Tallinn. The concept spans Home, Work, About, Writing, and Contact — the quietest site in the gallery, art-directed as cool off-white paper, near-black ink, hairline rules, and one low-chroma slate accent, with a single narrow column, numbered sections, and generous empty margins. It opens on a kinetic first-person headline whose closing word lands in italic serif, and every section is composed from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Work', path: 'work' },
    { label: 'About', path: 'about' },
    { label: 'Writing', path: 'writing' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'States who the maker is in one line, shows the practice and a few projects, and offers one honest way in.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-kinetic',
          content: {
            description:
              'I am a designer who writes the code, or a developer who draws the screens — it depends who is asking. I work with four or five teams a year, one project at a time, from the first sketch to the last deploy.',
            eyebrow: 'Solo practice · Tallinn',
            imageCaption: 'My desk at 06:40 — the only quiet hour I get.',
            links: [
              { link: { appearance: 'default', label: 'See the work' } },
              { link: { appearance: 'outline', label: 'Say hello' } },
            ],
            marqueeItems: [
              { label: 'Interface design' },
              { label: 'Design systems' },
              { label: 'TypeScript' },
              { label: 'React' },
              { label: 'Payload' },
              { label: 'Typography' },
              { label: 'Accessibility' },
              { label: 'Postgres' },
              { label: 'Prototyping' },
            ],
            /* Two, not three: the twin lays the proof line beside the CTAs in
               a shrink-to-fit column, and a third item pushes that column past
               the measure and wraps it onto its own row. */
            proofItems: [{ label: 'One project at a time' }, { label: 'I answer my own email' }],
            title: 'I build interfaces that stay legible.',
          },
          id: 'opening',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'The practice',
            features: [
              {
                description:
                  'Screens, states, and the empty ones nobody remembers to draw until launch week.',
                icon: 'sparkles',
                title: 'Interface design',
              },
              {
                description:
                  'Tokens, components, and documentation short enough that a team actually keeps it.',
                icon: 'cpu',
                title: 'Design systems',
              },
              {
                description:
                  'TypeScript and React, written to be read by someone else six months from now.',
                icon: 'zap',
                title: 'Front-end',
              },
              {
                description:
                  'Hierarchy, measure, and words that fit the box they were given. Usually fewer words.',
                icon: 'gauge',
                title: 'Type and copy',
              },
            ],
            paragraphs: [
              {
                text: 'There is no team behind me. That means nothing gets lost between the design and the build, nobody junior quietly inherits your project, and there is exactly one person to hold responsible.',
              },
            ],
            title: 'Design and code, by the same pair of hands.',
          },
          id: 'practice',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Selected work',
            paragraphs: [
              {
                text: 'Three from the last seven years. Each one designed and built by me, alongside one or two people on the client side who knew their domain far better than I did.',
              },
            ],
            rows: [
              {
                description:
                  'A freight-forwarding console that had grown to three hundred near-identical screens. I spent fourteen weeks reducing it to nineteen components and a set of rules the in-house team still follows.',
                title: 'Kaskad — Freight console',
              },
              {
                description:
                  'A small foundry with beautiful type and a website that hid it. New specimen pages, a trial flow that works on a phone, and a licensing step that stopped losing people halfway through.',
                title: 'Lume Type — Foundry site',
              },
              {
                description:
                  'Forty years of glacier measurements, previously a folder of spreadsheets. Now a public explorer that a journalist on a deadline can read without calling a scientist first.',
                title: 'Icefield Institute — Data explorer',
              },
            ],
            title: 'Three projects I still think about.',
          },
          id: 'selected-work',
        },
        {
          /* No logoLabel here or on either content-quote: a one-person site
           * does not badge other people's words with their employer's mark, so
           * every quote in this concept stands on its own type. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Kaia Lund',
            body: 'One project at a time means there are fewer of them. It also means none of them were handed to somebody else while I was busy with yours.',
            description:
              'I keep a plain-text log of every project since I went out on my own. These are the numbers in it — not rounded up, and not counting the ones that died in week two.',
            eyebrow: 'The record',
            metrics: [
              { label: 'years working alone', value: '7' },
              { label: 'projects shipped since 2019', value: '29' },
              { label: 'clients who came back', value: '11' },
              { label: 'median project length', value: '9 wks' },
            ],
            quote:
              'Working with Ilse is the shortest path I know between a decision and a shipped screen. There is nobody to brief, nothing gets diluted, and she tells you when you are wrong.',
            role: 'Head of Product, Kaskad',
            title: 'Small numbers, kept honestly.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'From “Legible by default”, March 2026',
            eyebrow: 'From the notes',
            paragraphs: [
              {
                text: 'Most interface problems are not visual problems. They are somebody upstream failing to decide what matters, and then asking design to hide the indecision. I would rather help make the decision.',
              },
            ],
            quote:
              'Clarity is not a style you apply at the end. It is a series of small refusals, made early, by someone willing to be unpopular for an afternoon.',
            title: 'Legibility is the whole job.',
          },
          id: 'thesis',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'I take four or five projects a year and I am usually booked a month or two out. Tell me what you are making and I will tell you honestly whether I am the right person for it.',
            links: [
              { link: { appearance: 'default', label: 'Say hello' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'If you are building something small and careful, write to me.',
          },
          id: 'cta',
        },
      ],
      title: 'Ilse Renko — Designer and developer',
    },
    {
      description:
        'Five projects with case notes and quotes from the people who worked with the maker directly.',
      label: 'Work',
      path: 'work',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'I publish only what the client is happy to show and what I would still defend today. Five projects, roughly in the order they taught me the most.',
            eyebrow: 'Work',
            links: [],
            proofItems: [
              { label: '2019 — 2026' },
              { label: 'Designed and built by me' },
              { label: 'One at a time' },
            ],
            title: 'Everything here, I made myself.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Case notes',
            paragraphs: [
              {
                text: 'Both of these were handed over to in-house teams the week they launched. The real measure is whether the work still holds up two years later without me in the room. It does.',
              },
            ],
            rows: [
              {
                description:
                  'Nine lines, four seasons, one timetable nobody could parse. A departure-board system that survives low light and older screens, plus a public site their station staff update from a phone on the platform.',
                title: 'Nordsund Rail — Departure system',
              },
              {
                description:
                  'A two-person forms product with a very good engine and a marketing site that undersold it badly. I rewrote the pages, the docs, and the empty states, then left them a component set they have extended six times since.',
                title: 'Plainform — Site and docs',
              },
            ],
            title: 'Two systems that had to survive without me.',
          },
          id: 'projects',
        },
        {
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'Lume Type — Foundry',
            paragraphs: [
              {
                text: 'Lume draws some of the best text faces I know and their old site set all of them in the same 15px grey. We rebuilt the specimens so each family is shown at the sizes it was actually designed for, made the trial flow work with one thumb, and cut the licensing step from nine fields to four. Trial-to-licence conversion went up by half in the first quarter, and I still get sent screenshots when someone spots the specimen pages in the wild.',
              },
            ],
            title: 'A type foundry that finally reads like one.',
          },
          id: 'lead-project',
        },
        {
          componentSlug: 'content-feature-split',
          content: {
            eyebrow: 'Kaskad — Freight console',
            features: [
              {
                description:
                  'Three hundred screens audited down to nineteen components and eleven documented rules.',
                icon: 'cpu',
                title: 'Nineteen components',
              },
              {
                description:
                  'Fourteen weeks from first audit to full rollout, with a working build every Friday.',
                icon: 'gauge',
                title: 'Fourteen weeks',
              },
            ],
            paragraphs: [
              {
                text: 'Kaskad move freight for a living and their console had grown one screen at a time for six years. Nobody had done anything wrong; there was simply never a week for the boring work. I took the boring work, then taught two of their engineers to keep it that way.',
              },
            ],
            title: 'Three hundred screens, nineteen components.',
          },
          id: 'case-study',
        },
        {
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Collected from project wrap-ups over the last few years, quoted with permission and edited only for length.',
            items: [
              {
                author: 'Kaia Lund',
                quote:
                  'She showed up in week one with a list of things we should stop doing. It was uncomfortable and it was correct.',
                role: 'Head of Product, Kaskad',
              },
              {
                author: 'Dilara Aksoy',
                quote:
                  'Ilse is the only person I have hired who cared more about our type than we did.',
                role: 'Creative Director, Lume Type',
              },
              {
                author: 'Ove Straumen',
                quote:
                  'Two of us, no designer, and a site we were embarrassed by. Six weeks later it was the thing customers complimented.',
                role: 'Founder, Plainform',
              },
              {
                author: 'Hattie Osei',
                quote:
                  'She read four decades of our field notes before drawing anything. Our scientists noticed immediately.',
                role: 'Director, Icefield Institute',
              },
              {
                author: 'Piotr Zawadzki',
                quote:
                  'The handover was one afternoon and a document I still open. I have never said that about an agency.',
                role: 'Engineering Manager, Nordsund Rail',
              },
              {
                author: 'Rafa Quintela',
                quote:
                  'I have shared clients with Ilse twice. Her work arrives having already survived an argument, and it shows.',
                role: 'Independent design lead, Porto',
              },
            ],
            title: 'What it is like to work with one person.',
          },
          id: 'proof',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'If any of this looks like the work you need, send me two paragraphs about it. I answer everything within a day or two, including the noes.',
            links: [
              { link: { appearance: 'default', label: 'Say hello' } },
              { link: { appearance: 'outline', label: 'Read about me' } },
            ],
            title: 'I have room for one more project this autumn.',
          },
          id: 'cta',
        },
      ],
      title: 'Ilse Renko — Work',
    },
    {
      description:
        'The maker’s background, how she thinks about the craft, and the small bench of independents behind her.',
      label: 'About',
      path: 'about',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'I am Ilse. I design interfaces and write the code that runs them, from one room in Tallinn with a window I mostly ignore. Five years in-house, seven on my own, no plans to hire.',
            eyebrow: 'About',
            links: [],
            proofItems: [
              { label: 'Tallinn, Estonia' },
              { label: 'Solo since 2019' },
              { label: 'No employees, no plans' },
            ],
            title: 'One person, one desk, twelve years in.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'How I think about it',
            links: [{ link: { appearance: 'outline', label: 'See it in the work' } }],
            paragraphs: [
              {
                text: 'I start with the words. Before a typeface is chosen, I want one written sentence that says what this screen is for and what it refuses to do. If nobody will sign that sentence, the design problem is not a design problem yet.',
              },
              {
                text: 'The rest is craft and patience: a type scale you can count on, states drawn for the bad days as well as the good ones, and code plain enough that the next person does not quietly rewrite it.',
              },
            ],
            title: 'Decide first. Draw second. Ship on the date.',
          },
          id: 'philosophy',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Rafa Quintela, independent design lead',
            eyebrow: 'From a collaborator',
            paragraphs: [
              {
                text: 'Working alone is not the same as working in isolation. Every Thursday I sit down with two other independents — a developer in Porto and a writer in Leeds — and we take each other’s work apart before a client ever sees it.',
              },
            ],
            quote:
              'Ilse brings work to Thursday that she already knows is wrong somewhere, and she wants to be told where. Most people bring work they want praised.',
            title: 'Alone at the desk, never alone with the work.',
          },
          id: 'quote',
          tone: 'muted',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The shape of it',
            features: [
              {
                description:
                  'I turn down more work than I take. It is the only way one person can promise a date and mean it.',
                icon: 'shield',
                title: 'Saying no is part of the craft',
              },
              {
                description:
                  'Every project ends on a named day. A deadline is a design constraint, not an administrative detail.',
                icon: 'gauge',
                title: 'Deadlines are decisions',
              },
              {
                description:
                  'If I cannot write down why a thing looks like that, I do not understand it yet. So I write it down.',
                icon: 'sparkles',
                title: 'I write everything down',
              },
            ],
            paragraphs: [
              {
                text: 'Twelve years, condensed. I have never had employees, never taken investment, and never billed a client for a meeting about a meeting.',
              },
            ],
            stats: [
              { label: 'first product job — a bank in Riga', value: '2014' },
              { label: 'went out on my own, one client, no plan', value: '2019' },
              { label: 'projects since, one at a time', value: '29' },
              { label: 'notes published instead of posting', value: '68' },
            ],
            title: 'Twelve years, condensed.',
          },
          id: 'background',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Rafa Quintela' },
              { name: 'Neve Ashworth' },
              { name: 'Tobias Kral' },
              { name: 'Amara Ekwueme' },
              { name: 'Signe Holt' },
              { name: 'Jun Park' },
            ],
            eyebrow: 'The bench',
            paragraphs: [
              {
                text: 'When a project genuinely needs a second pair of hands, I bring in one of these six rather than pretending one person can do everything. They invoice you directly and I do not take a cut — I would rather keep the recommendation clean.',
              },
            ],
            title: 'The people I call when it is bigger than me.',
          },
          id: 'community',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'I answer my own email, usually the same day. There is a form if you prefer one, but a plain message is honestly fine.',
            links: [
              { link: { appearance: 'default', label: 'Say hello' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'Still reading? Then we probably get along.',
          },
          id: 'cta',
        },
      ],
      title: 'Ilse Renko — About',
    },
    {
      /* The Writing page's `topics` section swaps the skeleton's
       * content-showcase for content-columns: a writing index should stay
       * text-forward, and the centred showcase composition already carries the
       * home page's `practice` section — repeating it here made the concept
       * read templated rather than personal. */
      description:
        'A writing index: the three most recent notes, what they tend to be about, and no list to join.',
      label: 'Writing',
      path: 'writing',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'I write to work out what I think, then publish it in case it is useful to somebody else. Mostly type, design systems, and the parts of front-end work that never make it into a conference talk.',
            eyebrow: 'Writing',
            links: [],
            proofItems: [
              { label: '68 notes since 2019' },
              { label: 'Roughly monthly' },
              { label: 'No newsletter' },
            ],
            title: 'Sixty-eight notes on making things carefully.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Recent',
            paragraphs: [
              {
                text: 'In reverse order, dated the day I actually finished them rather than the day I started — there is often a year between the two.',
              },
            ],
            rows: [
              {
                description:
                  'Why I set body text before headlines, and what happens to a hierarchy when you build it the other way round. Includes the scale I have used on every project since 2022.',
                title: 'Legible by default — March 2026',
              },
              {
                description:
                  'Three hundred screens became nineteen components, and the audit method that got me there. Mostly a defence of spending two weeks counting things before drawing any.',
                title: 'Counting before drawing — January 2026',
              },
              {
                description:
                  'On the states nobody specifies: the empty list, the slow network, the row somebody deleted while you were reading it. Ten examples, redrawn.',
                title: 'The screens you forgot to design — October 2025',
              },
            ],
            title: 'The last three things I published.',
          },
          id: 'essays',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Topics',
            links: [{ link: { appearance: 'outline', label: 'See it in the work' } }],
            paragraphs: [
              {
                text: 'Typography and reading, mostly: measure, scale, and the quiet decisions that make a screen easy to be on. Then design systems, because that is where most of my paid hours go, and the unglamorous half of front-end work — empty states, focus order, forms that survive being used badly.',
              },
              {
                text: 'Occasionally something about working alone: how I quote, how I say no, and what seven years of invoices taught me about scope. Those get the most replies, which tells you something about how many of us are out here.',
              },
            ],
            title: 'What I keep circling back to.',
          },
          id: 'topics',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'There is a feed and that is the whole distribution strategy. If a note was useful, tell me — the replies are reliably the best part of my week.',
            links: [
              { link: { appearance: 'default', label: 'Say hello' } },
              { link: { appearance: 'outline', label: 'See the work' } },
            ],
            title: 'Nothing here to sign up for.',
          },
          id: 'cta',
        },
      ],
      title: 'Ilse Renko — Writing',
    },
    {
      description:
        'One honest way to start a project: three real channels, a short form, and the questions that decide it.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Tell me what you are making, roughly when it needs to exist, and what is currently in the way. That is enough for me to answer yes, no, or “talk to this person instead”.',
            eyebrow: 'Contact',
            links: [],
            proofItems: [
              { label: 'Answered within a day' },
              { label: 'No brief template' },
              { label: 'No pitch theatre' },
            ],
            title: 'Two paragraphs is plenty.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'The one I actually read. Same day if you catch me before lunch, always within two.',
                label: 'Email',
                value: 'ilse@renko.studio',
              },
              {
                description:
                  'Tallinn, weekdays 09:00–17:00 EET. Voicemail lands in the same inbox as everything else.',
                label: 'Telephone',
                value: '+372 5 555 0148',
              },
              {
                description:
                  'Specimens, sketches, and the occasional strongly worded postcard. Visits by arrangement.',
                label: 'Post',
                value: 'Telliskivi 60a, 10412 Tallinn',
              },
            ],
            description:
              'No shared inbox, no assistant, no routing rules. Whichever way you write, it lands on the same screen in front of the same person.',
            eyebrow: 'How to reach me',
            formConfigured: true,
            formTitle: 'Tell me what you are making',
            formDescription:
              'Five fields and only the last one matters. I would rather have two honest paragraphs than a completed form.',
            formLabels: ['Name', 'Email', 'Where you are', 'Rough timing', 'What are you making?'],
            submitLabel: 'Send it over',
            title: 'One inbox, and it is mine.',
          },
          id: 'contact',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description:
              'Rates, availability, and the things I am not good at — answered before you have to ask.',
            eyebrow: 'Before you write',
            items: [
              {
                answer:
                  'I work in weeks rather than hours: a rate per week, with a fixed number of them agreed before we start. You get the number on the first call, before you tell me your budget.',
                question: 'How do you charge?',
              },
              {
                answer:
                  'Usually four to six weeks out, because I only run one project at a time. If your date is real, say so — I do occasionally reshuffle for work I badly want to make.',
                question: 'When could you start?',
              },
              {
                answer:
                  'Happily, and it tends to go better. I spent five years as the only designer in a room full of engineers, so I am comfortable being outnumbered and useful.',
                question: 'Can you work inside my team?',
              },
              {
                answer:
                  'Brand from scratch, illustration, and anything that needs six people by Friday. I will tell you who is good at those, and I do not take a referral fee for it.',
                question: 'What are you not good at?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See the work' } }],
            title: 'What you probably want to know.',
          },
          id: 'faq',
        },
      ],
      title: 'Ilse Renko — Contact',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'portfolio-solo',
  status: 'concept',
  summary:
    'A quiet, near-monochrome personal site for a fictional solo designer-developer — small precise type, hairline rules, and one grudging slate accent.',
  theme: {
    description:
      'Cool off-white paper, near-black ink, and one low-chroma slate accent used sparingly: hairline rules instead of card chrome, a single narrow column with numbered sections, small precise type, and generous empty margins.',
    id: 'portfolio-solo',
    swatches: ['#f7f7f8', '#111217', '#4a5480'],
  },
  title: 'Portfolio Solo',
  visualTone: ['Restrained', 'Typographic', 'First-person'],
}
