import type { TemplateShowcase } from './types'

import type {
  ComparatorTableDemoContent,
  ContentSectionDemoContent,
  CtaDemoContent,
  FaqDemoContent,
  FaqGroupedDemoContent,
  FeatureSectionDemoContent,
  HeroAuroraDemoContent,
  HeroBasicDemoContent,
  LogoCloudDemoContent,
  PricingDemoContent,
  StatsProofDemoContent,
  TeamSectionDemoContent,
  TestimonialDemoContent,
} from '@/lib/demo-content'

/* Frameworks ’26 (event-conference) — a fictional design + engineering
 * conference, art-directed as the gallery's one near-black concept.
 *
 * Everything below is invented: the conference, its venue, its speakers, its
 * sponsors, its committee, and every metric. The voice is a working event's
 * voice — dates, times, rooms, and seat counts stated plainly, no marketing
 * hedging, no vendor language.
 *
 * Copy contract for template surfaces: never an install command, never
 * "waitlist" or "coming soon", and never a literal currency amount. Ticket
 * tiers are therefore expressed as release waves and what each one includes —
 * which is closer to how a real conference sells anyway. Every CTA label
 * either names a page in this concept's own navigation (Tickets, Schedule,
 * Speakers, Venue) or reads as a state ("Wave one closed"). */

const GET_TICKET = { appearance: 'default', label: 'Get your ticket' } as const
const READ_SCHEDULE = { appearance: 'outline', label: 'Read the schedule' } as const
const SEE_LINEUP = { appearance: 'outline', label: 'See the lineup' } as const
const FIND_VENUE = { appearance: 'outline', label: 'Find the venue' } as const

/* ————————————————————————————— Home ————————————————————————————— */

/* The showpiece: an aurora hero tuned to read as an electric stage wash on
 * near-black. The word cascade lands on "compounds." — set in serif italic by
 * the component — so the headline argues the conference's whole thesis in one
 * beat. The metric ticker counts up event proof rather than product proof. */
const homeHero: HeroAuroraDemoContent = {
  description:
    'Two days at Halle Nord with the engineers and designers who put the modern web into production. Three rooms, sixty-two sessions, and not one vendor keynote.',
  eyebrow: 'Berlin · 12–13 March 2026',
  imageCaption:
    'Attendance by edition since 2019 — Halle Nord is the largest room we have ever booked.',
  links: [{ link: GET_TICKET }, { link: READ_SCHEDULE }],
  metrics: [
    { label: 'Speakers', value: '48' },
    { label: 'Sessions', value: '62' },
    { label: 'Attendees', value: '2,400' },
    { label: 'Editions', value: '7' },
  ],
  proofItems: [
    { label: 'Three rooms, two days' },
    { label: 'Hallway track all day' },
    { label: 'Every session captioned live' },
    { label: 'Recordings up within 72 hours' },
  ],
  title: 'Frameworks come and go. The craft compounds.',
}

const homeSponsors: LogoCloudDemoContent = {
  heading: 'Underwritten by the teams who maintain the tools:',
}

const homeProof: StatsProofDemoContent = {
  author: 'Halvard Ness',
  body:
    'Nothing is pre-recorded and nothing is a product demo. The programme committee rejects any proposal that cannot name the trade-off it made.',
  description:
    'Every session ships something real — a migration, a rendering budget, a design system that survived a reorg — and the speaker stays in the room afterwards to answer for it.',
  eyebrow: 'Seven editions',
  logoLabel: 'NORTHWIND',
  metrics: [
    { label: 'Attendees across seven editions', value: '11,600' },
    { label: 'Sessions that published their source', value: '94%' },
    { label: 'Speakers who had never keynoted', value: '31' },
    { label: 'Vendor keynotes, ever', value: 'Zero' },
  ],
  quote:
    'I have been to conferences that made me feel behind. Frameworks made me want to open my laptop on the train home and fix something.',
  role: 'Principal engineer, Northwind',
  title: 'The room where shipped work gets taken apart.',
}

const homeWhyAttend: FeatureSectionDemoContent = {
  description:
    'The committee is nine working engineers and designers. They read every proposal blind and cut anything that reads like a launch post.',
  eyebrow: 'Why clear two days',
  items: [
    {
      description:
        'Main Stage sets the argument each morning; Systems and Craft take it apart all afternoon. Nothing is ever scheduled against its own audience.',
      title: 'Three rooms, one argument',
    },
    {
      description:
        'Every speaker commits to both days. You will find them at the Long Table, in the corridor, or on the workshop floor — never in a green room.',
      title: 'Speakers stay for both days',
    },
    {
      description:
        'Twenty-four seats, three hours, one machine each. You leave a workshop with something running on your own laptop, not a slide deck.',
      title: 'Workshops with a seat limit',
    },
  ],
  links: [{ link: READ_SCHEDULE }],
  title: 'A programme built by people who still have to merge it.',
}

const homeFeaturedSpeakers: TeamSectionDemoContent = {
  description:
    'The full lineup by room is on the Speakers page — including the eleven first-time speakers the committee pulled out of blind review.',
  eyebrow: 'The lineup',
  members: [
    { name: 'Ines Okonjo', role: 'Opening keynote · streaming media' },
    { name: 'Dmitri Vance', role: 'Closing keynote · type systems at scale' },
    { name: 'Priya Raman', role: 'Main Stage · design engineering' },
    { name: 'Amara Diallo', role: 'Main Stage · accessibility architecture' },
    { name: 'Tobias Lindqvist', role: 'Systems · rendering runtimes' },
    { name: 'Ren Nakamura', role: 'Craft · editorial systems' },
  ],
  title: 'Forty-eight speakers. These six open the rooms.',
}

const homeScheduleTeaser: FeatureSectionDemoContent = {
  description: 'Two days, one continuous argument. This is the shape of it.',
  eyebrow: 'How the two days run',
  items: [
    {
      description:
        'Opening keynote at ten, then Systems and Craft run in parallel until six. The coffee is real and the queue is not.',
      title: 'Wednesday — Foundations',
    },
    {
      description:
        'One very long table, three hundred seats, no seating plan. Speakers, first-timers, and the committee all eating the same thing.',
      title: 'Wednesday night — The Long Table',
    },
    {
      description:
        'Workshops all morning on the top floor, the closing keynote at half past four, and the hallway track until they turn the lights off.',
      title: 'Thursday — Frontiers',
    },
  ],
  links: [{ link: { appearance: 'default', label: 'Read the schedule' } }],
  title: 'Doors at nine. Last talk at six. Long Table until late.',
}

const homeTestimonial: TestimonialDemoContent = {
  testimonial: {
    author: 'Béatrice Okafor',
    quote:
      'Three of the four things we changed about our rendering pipeline last year came out of one Frameworks afternoon. I have never had that from a conference before.',
    role: 'Head of engineering, Vandelay',
  },
}

const homeTickets: PricingDemoContent = {
  description:
    'One band for everyone, a genuinely free community allocation, and an invoice if your studio is sending a table.',
  eyebrow: 'Wave two',
  plans: [
    {
      description: 'Released in November. Gone in nine hours.',
      features: ['Both days, all three rooms', 'Long Table seat included', 'Workshop ballot entry'],
      link: { appearance: 'outline', label: 'Wave one closed' },
      name: 'Early bird',
      period: 'wave one',
      price: 'Closed',
    },
    {
      description: 'The main allocation. Roughly six hundred left.',
      featured: true,
      features: [
        'Both days, all three rooms',
        'Long Table seat included',
        'Workshop ballot entry',
        'Recordings within 72 hours',
        'Transferable until 1 March',
      ],
      link: GET_TICKET,
      name: 'Standard',
      period: 'wave two',
      price: 'On sale',
    },
    {
      description: 'Students, maintainers, and first-time speakers.',
      features: [
        'Both days, all three rooms',
        'Long Table seat included',
        'Travel bursary considered',
      ],
      link: { appearance: 'outline', label: 'Applications open' },
      name: 'Community pass',
      period: 'by application',
      price: 'Free',
    },
  ],
  title: 'Three ways in. No corporate tier.',
}

const homeCta: CtaDemoContent = {
  description:
    'One email when the board lands, one when the last workshop seats open. That is the entire list.',
  emailPlaceholder: 'you@yourteam.dev',
  submitLabel: 'Keep me posted',
  title: 'The full session board goes live on Friday.',
}

/* ————————————————————————————— Speakers ————————————————————————————— */

const speakersHero: HeroBasicDemoContent = {
  description:
    'Every talk on this list was proposed blind, read by nine working engineers and designers, and accepted on the strength of the trade-off it names. Eleven of these speakers have never keynoted anywhere.',
  eyebrow: 'The lineup · 48 speakers',
  links: [{ link: GET_TICKET }, { link: READ_SCHEDULE }],
  proofItems: [
    { label: 'Blind review, every edition' },
    { label: 'Eleven first-time speakers' },
    { label: 'Everyone stays both days' },
  ],
  title: 'Forty-eight people who had to ship it first.',
}

const speakersLineup: TeamSectionDemoContent = {
  eyebrow: 'By room',
  groups: [
    {
      label: 'Main Stage — Halle Nord',
      members: [
        { name: 'Ines Okonjo', role: 'Opening keynote' },
        { name: 'Dmitri Vance', role: 'Closing keynote' },
        { name: 'Priya Raman', role: 'Design engineering' },
        { name: 'Amara Diallo', role: 'Accessibility architecture' },
      ],
    },
    {
      label: 'Systems — The Annex',
      members: [
        { name: 'Tobias Lindqvist', role: 'Rendering runtimes' },
        { name: 'Wren Alcázar', role: 'Data at the edge' },
        { name: 'Kofi Mensah', role: 'Build pipelines' },
        { name: 'Sana Beric', role: 'Observability' },
      ],
    },
    {
      label: 'Craft — The Gallery',
      members: [
        { name: 'Ren Nakamura', role: 'Editorial systems' },
        { name: 'Lucía Ferrand', role: 'Motion and interaction' },
        { name: 'Elias Thorne', role: 'Typography on screen' },
        { name: 'Nour Haddad', role: 'Design tokens' },
      ],
    },
    {
      label: 'Workshop floor — Level three',
      members: [
        { name: 'Marguerite Oyelaran', role: 'Content modelling' },
        { name: 'Jonas Vermeer', role: 'Migrations without downtime' },
        { name: 'Thandi Nkosi', role: 'Testing the front end' },
        { name: 'Vikram Sahu', role: 'Performance clinic' },
      ],
    },
  ],
  title: 'The rooms, and who is in them.',
}

/* No logoLabel — the section's whole argument is "No names. No logos." */
const speakersQuote: ContentSectionDemoContent = {
  citation: 'Amara Diallo, programme chair',
  eyebrow: 'Blind review',
  paragraphs: [
    {
      text: 'Proposals arrive with the speaker’s name, employer, and links stripped out. The committee reads the argument and the trade-off, scores it, and only afterwards finds out who wrote it.',
    },
    {
      text: 'It is slower and it is far more work, and it is the reason a first-time speaker from a four-person studio has opened Main Stage two editions running.',
    },
  ],
  quote:
    'We rejected a proposal from someone on our own committee this year. That is the entire point of doing it blind.',
  title: 'Nine readers. No names. No logos.',
}

const speakersPastEditions: TestimonialDemoContent = {
  description:
    'Six things people wrote to us after Frameworks ’25, lightly trimmed and otherwise left alone.',
  eyebrow: 'Past editions',
  items: [
    {
      author: 'Halvard Ness',
      quote:
        'The Systems room ran a live terminal on every talk. Watching someone actually break their own build in front of nine hundred people did more for me than a year of blog posts.',
      role: 'Principal engineer, Northwind',
    },
    {
      author: 'Meret Buchholz',
      quote:
        'I came on a community pass with no employer behind me and nobody treated me differently. The badge has your name on it and nothing else, and that changes every conversation.',
      role: 'Independent design engineer',
    },
    {
      author: 'Osei Boateng',
      quote:
        'Every speaker was still in the building at six. I got twenty minutes with the person whose migration we had copied wholesale, and she told me which half of it not to.',
      role: 'Platform lead, Globex',
    },
    {
      author: 'Lena Þórsdóttir',
      quote:
        'Captions in all three rooms, a quiet room with nothing programmed in it, and a step-free route to every seat. I did not have to ask for any of it in advance.',
      role: 'Accessibility consultant',
    },
    {
      author: 'Rafael Idrissi',
      quote:
        'The workshop had twenty-four people and one machine each. Three hours later my laptop was serving the thing we had spent two sprints failing to serve.',
      role: 'Staff engineer, Initech',
    },
    {
      author: 'Suvi Karhu',
      quote:
        'No sponsor stage, no lanyard logo, no keynote that was secretly a launch. It is a conference that behaves as if your attention costs something.',
      role: 'Engineering manager, Umbra',
    },
  ],
  title: 'Seven editions of people telling us what actually stuck.',
}

const speakersCta: CtaDemoContent = {
  description:
    'Wave two is on sale now, and the community allocation is still open for students, maintainers, and first-time speakers.',
  links: [{ link: GET_TICKET }, { link: READ_SCHEDULE }],
  title: 'Forty-eight speakers. One ticket. Two days.',
}

/* ————————————————————————————— Schedule ————————————————————————————— */

const scheduleHero: HeroBasicDemoContent = {
  description:
    'Main Stage sets the argument, Systems and Craft take it apart, and the workshop floor makes you type. The full session board goes live on Friday — this is the shape of both days.',
  eyebrow: 'Programme · 12–13 March',
  links: [{ link: GET_TICKET }, { link: FIND_VENUE }],
  proofItems: [
    { label: 'Doors 09:00' },
    { label: 'Last talk 18:00' },
    { label: 'Long Table 19:30' },
    { label: 'Captioned live' },
  ],
  title: 'Sixty-two sessions across three rooms.',
}

const scheduleTracks: FeatureSectionDemoContent = {
  description:
    'Every session is fifty minutes with ten to move between rooms. Workshops are the exception: three hours, top floor, ballot only.',
  eyebrow: 'The three rooms',
  items: [
    {
      description:
        'Nine hundred seats under the original crane rails. Keynotes, the state-of-the-web panel, and the closing talk. Nothing is ever programmed against it.',
      title: 'Main Stage — Halle Nord',
    },
    {
      description:
        'Two hundred and forty seats, one very large screen, and a live terminal on every talk. Runtimes, data, builds, and observability.',
      title: 'Systems — The Annex',
    },
    {
      description:
        'A hundred and eighty seats with daylight on three sides. Typography, motion, tokens, editorial systems, and the accessibility clinic.',
      title: 'Craft — The Gallery',
    },
  ],
  links: [{ link: FIND_VENUE }],
  title: 'Three rooms, never scheduled against their own audience.',
}

const scheduleSessions: ContentSectionDemoContent = {
  eyebrow: 'Both days',
  paragraphs: [
    {
      text: 'You can follow one room end to end or move every fifty minutes — the timings line up on purpose, and the corridors are wide enough to count as part of the programme.',
    },
  ],
  rows: [
    {
      description:
        'Doors at nine, coffee from the freight door. Ines Okonjo opens Main Stage at ten. Systems and Craft run from half past eleven until six, with the accessibility clinic open all afternoon. The Long Table seats at half past seven.',
      title: 'Wednesday 12 March — Foundations',
    },
    {
      description:
        'Workshops from half past nine on level three, ballot seats confirmed the night before. Main Stage returns after lunch, and Dmitri Vance closes the edition at half past four.',
      title: 'Thursday 13 March — Frontiers',
    },
    {
      description:
        'Two hundred metres of corridor, forty-one working demos on trestle tables, and every speaker committed to being findable. More than one migration has been sketched on the back of a lanyard here.',
      title: 'Both days — The hallway track',
    },
  ],
  title: 'Wednesday builds the argument. Thursday tests it.',
}

const scheduleFaq: FaqGroupedDemoContent = {
  description:
    'If it is not here, the crew at the front desk will know — they have run the same conference for seven years.',
  eyebrow: 'Before you plan your day',
  groups: [
    {
      icon: 'clock',
      items: [
        {
          answer:
            'Doors at nine on both days, first talk at ten on Wednesday and half past nine on Thursday. Last talk ends at six on Wednesday and half past four on Thursday.',
          question: 'What time does each day actually start and finish?',
        },
        {
          answer:
            'Fifty-minute sessions with ten minutes between them, and the same ten minutes in all three rooms. You will not miss the opening of a talk by leaving another one late.',
          question: 'Can I move between rooms mid-session?',
        },
        {
          answer:
            'Workshops are three hours and run only on Thursday morning. Seats go to a ballot that opens the moment your ticket is confirmed, and results land the evening before.',
          question: 'How do workshop seats work?',
        },
      ],
      title: 'Times and rooms',
    },
    {
      icon: 'globe',
      items: [
        {
          answer:
            'Halle Nord, on the canal side of Ostkreuz in Berlin. Eleven minutes on foot from the station along a lit, step-free path, or four stops on the tram if the weather turns.',
          question: 'Where is the venue?',
        },
        {
          answer:
            'Bag drop is staffed by the freight door from eight in the morning on both days, so you can come straight from the train and collect on your way out.',
          question: 'Can I arrive with luggage?',
        },
      ],
      title: 'Getting there',
    },
    {
      icon: 'help-circle',
      items: [
        {
          answer:
            'Every session in every room is captioned live on a second screen, and the captions are burned into the recordings that go up within 72 hours.',
          question: 'Are the sessions captioned?',
        },
        {
          answer:
            'The front two rows of every room are held for anyone who needs them, no request required. The freight lift reaches all three floors and the whole route is step-free.',
          question: 'Is the venue step-free?',
        },
        {
          answer:
            'Level two has a quiet room with nothing programmed in it for the whole two days. No screens, no talks, no queue.',
          question: 'Is there somewhere quiet?',
        },
      ],
      title: 'Access and captions',
    },
  ],
  title: 'The practical questions, answered honestly.',
}

const scheduleCta: CtaDemoContent = {
  description:
    'Wave two covers both days and all three rooms, and the workshop ballot opens the moment your ticket is confirmed.',
  links: [{ link: GET_TICKET }, { link: SEE_LINEUP }],
  title: 'The session board lands Friday. Tickets are on sale now.',
}

/* ————————————————————————————— Venue ————————————————————————————— */

const venueHero: HeroBasicDemoContent = {
  description:
    'Halle Nord stood empty for nineteen years before a cooperative of set builders took it over. It has nine hundred seats, a working freight lift, and the best coffee cart in the district.',
  eyebrow: 'Halle Nord · Berlin',
  links: [{ link: GET_TICKET }, { link: READ_SCHEDULE }],
  proofItems: [
    { label: 'Step-free throughout' },
    { label: 'Eleven minutes from Ostkreuz' },
    { label: 'Quiet room on level two' },
  ],
  title: 'A turbine hall with the crane rails left in.',
}

const venueCity: ContentSectionDemoContent = {
  eyebrow: 'The city',
  links: [{ link: READ_SCHEDULE }],
  paragraphs: [
    {
      text: 'Flights land into BER all morning and the express train runs from the terminal to Ostkreuz in forty minutes without a change. From there it is an eleven-minute walk along the canal to the hall.',
    },
    {
      text: 'March is the honest month here. Bring a coat you can carry, expect four degrees and horizontal light, and take the long way back along the water at least once.',
    },
  ],
  title: 'Berlin in March: cold, cheap, and wide awake.',
}

const venueSpace: ContentSectionDemoContent = {
  eyebrow: 'The hall',
  paragraphs: [
    {
      text: 'Main Stage sits on the turbine floor under the original crane rails. The Annex is the old switch room directly behind it, and the Gallery runs the length of level two with daylight on three sides.',
    },
    {
      text: 'The freight lift reaches every floor and every room is step-free. Seating is unreserved except the front two rows, which are held for anyone who needs them.',
    },
  ],
  title: 'One building, three floors, no bad seat.',
}

const venueLogistics: ContentSectionDemoContent = {
  eyebrow: 'Getting there and staying',
  features: [
    {
      description:
        'BER to Ostkreuz on the express or the S9 — forty minutes, no change, and one ticket covers the whole trip including the tram.',
      icon: 'gauge',
      title: 'From the airport',
    },
    {
      description:
        'Eleven minutes on foot along the canal path, lit and step-free the whole way. Trams run every six minutes if the weather turns.',
      icon: 'zap',
      title: 'From Ostkreuz',
    },
    {
      description:
        'Step-free entry, a freight lift to all three floors, live captions in every room, and a quiet room on level two with nothing programmed in it.',
      icon: 'shield',
      title: 'Access',
    },
    {
      description:
        'Two kitchens on site, both with vegan and gluten-free as the default rather than a request. The Long Table is included with every ticket.',
      icon: 'sparkles',
      title: 'Food',
    },
    {
      description:
        'Staffed bag drop by the freight door from eight in the morning on both days. Bring your case straight from the train and collect on the way out.',
      icon: 'lock',
      title: 'Left luggage',
    },
    {
      description:
        'A socket per seat in the Annex and the Gallery, a hard-wired line on the workshop floor, and a network that has survived six editions.',
      icon: 'cpu',
      title: 'Power and wifi',
    },
  ],
  paragraphs: [
    {
      text: 'No shuttle bus, no conference hotel block, no lanyard sponsor. The hall is eleven minutes from a major interchange and the neighbourhood has beds at every price.',
    },
  ],
  stats: [
    { label: 'seats on the turbine floor', value: '900' },
    { label: 'walk from Ostkreuz station', value: '11 min' },
    { label: 'step-free floors, lift to all of them', value: '3' },
    { label: 'sponsor logos on the walls', value: 'Zero' },
  ],
  title: 'Everything practical, in one place.',
}

const venueFaq: FaqDemoContent = {
  description: 'Five things people ask us every March.',
  eyebrow: 'Venue questions',
  items: [
    {
      answer:
        'No. We do not hold a hotel block and we do not take a cut of one. The neighbourhood around Ostkreuz has beds at every price and the walk to the hall is eleven minutes from most of them.',
      question: 'Is there a conference hotel?',
    },
    {
      answer:
        'Yes — both kitchens treat vegan and gluten-free as the default rather than a request, and the Long Table on Wednesday night is included with every ticket.',
      question: 'Is food included?',
    },
    {
      answer:
        'Step-free from the street to every seat in all three rooms, with a freight lift serving all three floors. The front two rows are held for anyone who needs them, with no request required.',
      question: 'How accessible is the building?',
    },
    {
      answer:
        'A socket per seat in the Annex and the Gallery, and a hard-wired line on the workshop floor. Main Stage has power along the aisle rows only, so charge over lunch.',
      question: 'Will there be power at my seat?',
    },
    {
      answer:
        'March in Berlin runs around four degrees with a wind off the water. The hall is heated and the corridors are not, so bring a layer you are happy to carry all day.',
      question: 'What is the weather like?',
    },
  ],
  links: [{ link: READ_SCHEDULE }],
  title: 'Before you book a bed.',
}

const venueCta: CtaDemoContent = {
  description:
    'Wave two is on sale, the community allocation is open, and the turbine floor holds nine hundred.',
  links: [{ link: GET_TICKET }, { link: SEE_LINEUP }],
  title: 'Halle Nord, 12–13 March. Bring a coat.',
}

/* ————————————————————————————— Tickets ————————————————————————————— */

const ticketsHero: HeroBasicDemoContent = {
  description:
    'There is no VIP line at Frameworks and no corporate tier. Everyone gets the same badge, the same seat at the Long Table, and the same shot at a workshop ballot.',
  eyebrow: 'Wave two · on sale',
  links: [{ link: GET_TICKET }, { link: READ_SCHEDULE }],
  proofItems: [
    { label: 'Both days included' },
    { label: 'Long Table seat included' },
    { label: 'Community allocation open' },
    { label: 'Transferable until 1 March' },
  ],
  title: 'One ticket. Both days. Every room.',
}

const ticketsTiers: PricingDemoContent = {
  description:
    'Same rooms, same seat at the Long Table, same recordings. The only difference is how you pay and when you booked.',
  eyebrow: 'Three ways in',
  plans: [
    {
      description: 'Released in November. Gone in nine hours.',
      features: [
        'Both days, all three rooms',
        'Long Table seat included',
        'Workshop ballot entry',
        'Your name on the badge',
      ],
      link: { appearance: 'outline', label: 'Wave one closed' },
      name: 'Early bird',
      period: 'wave one',
      price: 'Closed',
    },
    {
      description: 'The main allocation. Roughly six hundred left.',
      featured: true,
      features: [
        'Both days, all three rooms',
        'Long Table seat included',
        'Workshop ballot entry',
        'Recordings within 72 hours',
        'Transferable until 1 March',
      ],
      link: GET_TICKET,
      name: 'Standard',
      period: 'wave two',
      price: 'On sale',
    },
    {
      description: 'Students, maintainers, and first-time speakers.',
      features: [
        'Both days, all three rooms',
        'Long Table seat included',
        'Workshop ballot entry',
        'Travel bursary considered',
      ],
      link: { appearance: 'outline', label: 'Applications open' },
      name: 'Community pass',
      period: 'by application',
      price: 'Free',
    },
  ],
  title: 'Pick the row that describes you.',
}

const ticketsCompare: ComparatorTableDemoContent = {
  description:
    'The full matrix, including the things people write in about after they have already booked.',
  features: [
    {
      feature: 'Both days, all three rooms',
      groupLabel: 'In the rooms',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Main Stage seating',
      values: [{ label: 'Unreserved' }, { label: 'Unreserved' }, { label: 'Unreserved' }],
    },
    {
      feature: 'Live captions in every room',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Workshop ballot entry',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Long Table seat',
      groupLabel: 'After the talks',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Reserved Long Table run',
      values: [{}, { label: 'On request' }, {}],
    },
    {
      feature: 'Recordings within 72 hours',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Transfer to a colleague',
      groupLabel: 'Practical',
      values: [{ label: 'Until 1 March' }, { label: 'Until 1 March' }, { label: 'Not transferable' }],
    },
    {
      feature: 'Invoice instead of card',
      values: [{}, { included: true }, {}],
    },
    {
      feature: 'Travel bursary considered',
      values: [{}, {}, { included: true }],
    },
  ],
  plans: [
    {
      badge: 'Closed',
      links: [{ link: { appearance: 'outline', label: 'Wave one closed' } }],
      name: 'Early bird',
      period: 'wave one',
    },
    {
      badge: 'On sale',
      highlighted: true,
      links: [{ link: GET_TICKET }],
      name: 'Standard',
      period: 'wave two',
    },
    {
      badge: 'Free',
      links: [{ link: { appearance: 'outline', label: 'Applications open' } }],
      name: 'Community',
      period: 'by application',
    },
  ],
  title: 'What each way in includes.',
}

const ticketsFaq: FaqGroupedDemoContent = {
  description:
    'Straight answers. If we get one wrong, the front desk will fix it for you on the day.',
  eyebrow: 'Ticket questions',
  groups: [
    {
      icon: 'credit-card',
      items: [
        {
          answer:
            'Card at checkout for a single ticket, or an invoice if you are booking five seats or more. Invoices are issued the same day and settle on thirty-day terms.',
          question: 'How can we pay?',
        },
        {
          answer:
            'Yes. Five seats or more are booked as one order under one invoice, and the badges are issued individually with each attendee’s own name.',
          question: 'Can a studio book a group on one invoice?',
        },
        {
          answer:
            'There is no student rate as such — students apply for the community allocation instead, which covers both days and includes the Long Table.',
          question: 'Is there a student rate?',
        },
      ],
      title: 'Paying and invoicing',
    },
    {
      icon: 'package',
      items: [
        {
          answer:
            'Standard and early-bird tickets transfer to a colleague until 1 March, from your order page, as many times as you need. Community passes are issued to a person and cannot be transferred.',
          question: 'Can I transfer my ticket?',
        },
        {
          answer:
            'Refunds in full until 1 February and half up to 1 March. After that a transfer is the only option, and the front desk will help you find someone if you ask.',
          question: 'What if I cannot come?',
        },
        {
          answer:
            'Nothing arrives in the post. Your badge is printed at the front desk when you arrive, and it carries your name and nothing else — no employer, no logo.',
          question: 'When do I get my badge?',
        },
      ],
      title: 'Changes and transfers',
    },
    {
      icon: 'help-circle',
      items: [
        {
          answer:
            'Students, maintainers of open-source the programme depends on, and anyone who has never spoken at a conference before. Applications are read by the same committee, in the same blind way.',
          question: 'Who is the community allocation for?',
        },
        {
          answer:
            'A travel bursary is considered alongside every community application. It is a fixed contribution towards the journey, decided when the pass is offered.',
          question: 'Does it cover travel?',
        },
      ],
      title: 'The community allocation',
    },
  ],
  title: 'Everything people write in about.',
}

const ticketsCta: CtaDemoContent = {
  description:
    'One email the morning it opens and one when the workshop ballot closes. Nothing else, and nothing from a sponsor.',
  emailPlaceholder: 'you@yourteam.dev',
  submitLabel: 'Keep me posted',
  title: 'Wave three opens on 20 February.',
}

/* ————————————————————————————— The showcase ————————————————————————————— */

export const eventConferenceTemplate: TemplateShowcase = {
  assets: [],
  category: 'event',
  description:
    'Frameworks ’26 is a fictional design + engineering conference in Berlin — the gallery’s one near-black concept. Electric violet on a near-black stage, oversized display type, hard edges, and dense date/room/time information across Home, Speakers, Schedule, Venue, and Tickets. Every section is composed from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Speakers', path: 'speakers' },
    { label: 'Schedule', path: 'schedule' },
    { label: 'Venue', path: 'venue' },
    { label: 'Tickets', path: 'tickets' },
  ],
  pages: [
    {
      description: 'Sells the two days: the date lockup, event proof, the lineup, and the waves.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-aurora', content: homeHero, id: 'hero' },
        { componentSlug: 'logo-cloud-inline-wrap', content: homeSponsors, id: 'sponsors', tone: 'muted' },
        { componentSlug: 'stats-proof', content: homeProof, id: 'proof', tone: 'contrast' },
        { componentSlug: 'feature-split', content: homeWhyAttend, id: 'why-attend' },
        { componentSlug: 'team-grid', content: homeFeaturedSpeakers, id: 'featured-speakers' },
        { componentSlug: 'feature-steps', content: homeScheduleTeaser, id: 'schedule-teaser', tone: 'muted' },
        { componentSlug: 'testimonials-quote', content: homeTestimonial, id: 'testimonial', tone: 'contrast' },
        { componentSlug: 'pricing-cards', content: homeTickets, id: 'tickets' },
        { componentSlug: 'call-to-action-signup', content: homeCta, id: 'cta', tone: 'muted' },
      ],
      title: 'Frameworks ’26 — Two days for people who ship the web',
    },
    {
      description: 'The full speaker lineup by room, how blind review works, and past editions.',
      label: 'Speakers',
      path: 'speakers',
      sections: [
        { componentSlug: 'hero-basic', content: speakersHero, id: 'hero' },
        { componentSlug: 'team-roster', content: speakersLineup, id: 'lineup' },
        { componentSlug: 'content-quote', content: speakersQuote, id: 'quote', tone: 'muted' },
        { componentSlug: 'testimonials-wall', content: speakersPastEditions, id: 'past-editions', tone: 'contrast' },
        { componentSlug: 'call-to-action-centered', content: speakersCta, id: 'cta' },
      ],
      title: 'Frameworks ’26 — Speakers',
    },
    {
      description: 'The two-day programme by room and time, with the practical questions answered.',
      label: 'Schedule',
      path: 'schedule',
      sections: [
        { componentSlug: 'hero-basic', content: scheduleHero, id: 'hero' },
        { componentSlug: 'feature-steps', content: scheduleTracks, id: 'tracks', tone: 'muted' },
        { componentSlug: 'content-rows', content: scheduleSessions, id: 'sessions' },
        { componentSlug: 'faq-grouped', content: scheduleFaq, id: 'faq', tone: 'muted' },
        { componentSlug: 'call-to-action-boxed', content: scheduleCta, id: 'cta', tone: 'contrast' },
      ],
      title: 'Frameworks ’26 — Schedule',
    },
    {
      description: 'The host city, the turbine hall itself, and every logistic in one place.',
      label: 'Venue',
      path: 'venue',
      sections: [
        { componentSlug: 'hero-basic', content: venueHero, id: 'hero' },
        { componentSlug: 'content-image-lead', content: venueCity, id: 'city' },
        { componentSlug: 'content-image-frame', content: venueSpace, id: 'space', tone: 'muted' },
        { componentSlug: 'content-stats', content: venueLogistics, id: 'logistics' },
        { componentSlug: 'faq-card', content: venueFaq, id: 'faq', tone: 'muted' },
        { componentSlug: 'call-to-action-boxed', content: venueCta, id: 'cta', tone: 'contrast' },
      ],
      title: 'Frameworks ’26 — Venue',
    },
    {
      description: 'The three release waves, a full inclusion matrix, and the ticket questions.',
      label: 'Tickets',
      path: 'tickets',
      sections: [
        { componentSlug: 'hero-basic', content: ticketsHero, id: 'hero' },
        { componentSlug: 'pricing-cards', content: ticketsTiers, id: 'tiers' },
        { componentSlug: 'comparator-table', content: ticketsCompare, id: 'compare', tone: 'muted' },
        { componentSlug: 'faq-grouped', content: ticketsFaq, id: 'faq' },
        { componentSlug: 'call-to-action-signup', content: ticketsCta, id: 'cta', tone: 'contrast' },
      ],
      title: 'Frameworks ’26 — Tickets',
    },
  ],
  revision: 3,
  schemaVersion: 1,
  slug: 'event-conference',
  status: 'concept',
  summary:
    'A near-black, electric-violet concept for a fictional two-day design and engineering conference in Berlin.',
  theme: {
    description:
      'Near-black stage surfaces washed in electric violet, oversized display type on hard edges, and monospace room-and-time labels — a poster identity that stays legible at AA.',
    id: 'event-conference',
    swatches: ['#030206', '#a47fff', '#f3f3f9'],
  },
  title: 'Event Conference',
  visualTone: ['Near-black', 'Electric', 'Date-driven'],
}
