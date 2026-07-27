import type { TemplateShowcase } from './types'

/* Trade — "Halloran & Sons", a fictional heating and plumbing firm in the
 * fictional town of Ashcombe.
 *
 * Art direction: the plainest, least "designed-looking" concept in the gallery,
 * on purpose. Its whole job is to be believed and phoned. Safety orange and
 * steel on off-white paper, heavy type, hard edges, big tap targets, and no
 * decoration for its own sake — workwear and signage, not a startup. The
 * interesting problem is making something genuinely handsome that still reads as
 * unpretentious, so every move is a signwriter's move: solid orange label bars,
 * a painted rule under the headline's last word, corrugated-steel plates.
 *
 *   Home      what they fix, where, what it costs to get them out, and the
 *             number — the whole firm on one screen
 *   Services  the jobs in full, how a callout actually runs, and the money
 *   Areas     the six rings they cover by name, and how fast they get there
 *   Reviews   the proof engine: ordinary people, named streets, real jobs
 *   Contact   three ways to reach them, and who picks up
 *
 * Canonical facts, kept consistent across every page: started in 1991 by Dermot
 * Halloran with one van; his sons Kieran and Sean run it now and Dermot still
 * does the Friday services; Bernadette answers the phone; four engineers, three
 * vans, one number; the yard is Unit 4, Tannery Row, Ashcombe; Ashcombe and
 * about twelve miles around; Mon–Fri 7:30–6, Sat 8–1, emergencies any hour;
 * 1,140 callouts last year and nine of them needed a second visit.
 *
 * Everything is fictional: the firm, the family, the engineers, the town and
 * every place and street in it, the customers, the commercial clients, and every
 * figure. Credentials are deliberately generic and clearly illustrative — no
 * real accreditation body, association, licence number, or insurer is named, and
 * no registration number is invented. The phone numbers are inside the
 * 01632 96xxxx range reserved for fiction, and email uses the reserved
 * `.example` domain.
 *
 * There are NO currency amounts anywhere. That is a real constraint on a trade
 * site and it is solved rather than dodged: rates are expressed the way a
 * plumber actually says them out loud — no callout fee, a fixed first-hour rate
 * then by the half hour, a written quote before anything long, parts at cost
 * plus a flat handling charge, one flat out-of-hours surcharge told to you on
 * the phone. All copy stays editor-shaped (demo-content types); layout belongs
 * to the twins and to the Halloran shell and theme. */

export const tradeServiceTemplate: TemplateShowcase = {
  assets: [],
  category: 'trade',
  description:
    'Halloran & Sons is a fictional second-generation heating and plumbing firm in the fictional town of Ashcombe: deliberately the plainest concept in the gallery, built to be believed and phoned rather than admired. Safety orange and steel on off-white paper, heavy type, hard edges, signwriter label bars, and corrugated-steel plates carry five pages — Home, Services, Areas, Reviews, and Contact — with reviews as the entire proof engine and every rate stated the way a tradesman says it out loud. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Areas', path: 'areas' },
    { label: 'Reviews', path: 'reviews' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'States what they fix and where, says plainly what it costs to get a van out, proves it with reviews, and keeps the number in front of you the whole way down.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The signboard. The headline splits 23/13 characters with a bonus at
           * the sentence full stop, so the word cascade lands its closing
           * "today." in the accent slot — which this theme repaints from the
           * catalog's serif italic into heavy sans under a painted orange rule
           * (a signwriter's underline; Instrument Serif italic reads far too
           * refined for a plumber). The plate's letterbox still and the
           * marquee's diamonds are mixed from --brand, tuned here to safety
           * orange, so the still reads as a lit yard at half six rather than a
           * product shot. CTAs map to real routes: See what we fix → services,
           * Areas we cover → areas. */
          componentSlug: 'hero-kinetic',
          content: {
            description:
              'A family firm in Ashcombe since 1991. Dad started it with one van; we run it now, and he still does the Friday services. Four engineers, three vans, one number — and no callout fee.',
            eyebrow: 'Halloran & Sons · Est. 1991',
            imageCaption: 'The roller door at Unit 4, Tannery Row. Half six on a Tuesday.',
            links: [
              { link: { appearance: 'default', label: 'See what we fix' } },
              { link: { appearance: 'outline', label: 'Areas we cover' } },
            ],
            marqueeItems: [
              { label: 'Boiler repairs' },
              { label: 'New boilers' },
              { label: 'Cylinders' },
              { label: 'Leaks' },
              { label: 'Blocked drains' },
              { label: 'Radiators' },
              { label: 'Bathrooms' },
              { label: 'Landlord checks' },
              { label: 'Power flushing' },
            ],
            proofItems: [
              { label: 'No callout fee' },
              { label: 'Same day, most days' },
              { label: 'Family firm since 1991' },
            ],
            title: 'Boilers, leaks, drains. Sorted today.',
          },
          id: 'signage',
        },
        {
          /* SWAPPED from logo-cloud-marquee. Two reasons: the hero directly
           * above already carries a scroll-velocity marquee, so a second moving
           * strip under it is noise; and this strip cannot be an accreditation
           * wall — inventing certifying bodies is off limits — so it becomes
           * what a real local firm actually shows, the commercial customers who
           * keep it on the books. A static wrapped line of names is also simply
           * the plainer object, which is the register of this whole concept. */
          componentSlug: 'logo-cloud-inline-wrap',
          content: { heading: 'On the books for' },
          id: 'on-the-books',
          tone: 'muted',
        },
        {
          /* All six icons in the block's allowlist, used once each: zap for the
           * emergency, database (a stack of cylinders) for tanks, chart for
           * radiator fins, fingerprint for tracing a leak, shield for gas work,
           * id-card for a landlord certificate. */
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'If it carries water or gas, we work on it. Repairs first — we would rather fix your boiler than sell you a new one, and we will tell you honestly when it is past that.',
            eyebrow: 'What we do',
            items: [
              {
                description:
                  'No heat, no hot water, or a boiler locked out on a fault code. Ring before eleven and it is almost always the same day.',
                icon: 'zap',
                title: 'Boiler repairs',
              },
              {
                description:
                  'Swaps, new cylinders, unvented systems, and moving a boiler somewhere it should have been in the first place.',
                icon: 'database',
                title: 'New boilers and cylinders',
              },
              {
                description:
                  'Cold radiators, half-warm radiators, air in the system, balancing a house that has never been balanced, power flushing.',
                icon: 'chart',
                title: 'Radiators and heating',
              },
              {
                description:
                  'We trace a leak before we lift a floorboard. Burst pipes, dripping stopcocks, blocked drains, and the smell you cannot place.',
                icon: 'fingerprint',
                title: 'Leaks and blocked drains',
              },
              {
                description:
                  'Every engineer on our vans is gas-qualified and carries their card. Ask to see it at the door — we bring them out without being asked.',
                icon: 'shield',
                title: 'Gas work, done safely',
              },
              {
                description:
                  'Annual checks and paperwork for landlords and letting agents, booked in a block and emailed the same afternoon.',
                icon: 'id-card',
                title: 'Landlord checks',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See what we fix' } }],
            title: 'Heating and plumbing. Nothing else.',
          },
          id: 'what-we-do',
        },
        {
          /* The one steel band on the page. Deliberately a ledger, not a brag —
           * a trade firm has no metrics culture, so the four numbers are the
           * ones a customer would actually want (including the one that counts
           * against us) and the quote comes from a commercial client. The twin
           * ships a static wordmark, restyled by the theme into a small tracked
           * lockup and attributed to that fictional lettings firm. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Rosalind Achebe',
            body: 'The money is just as plain. No callout fee, a fixed first-hour rate, then by the half hour — and you know both numbers before we set off. Anything longer than half a day gets a written quote first, and the quote is the price.',
            description:
              'Thirty-five years, three vans, and the same four pairs of hands. Here is the honest version, including the number we are not proud of.',
            eyebrow: 'The ledger',
            metrics: [
              { label: 'the year Dad bought the first van', value: '1991' },
              { label: 'vans, and the same four engineers', value: '3' },
              { label: 'callouts last year', value: '1,140' },
              { label: 'of them needed a second visit', value: '9' },
            ],
            quote:
              'We look after ninety-odd rented properties and Halloran do the heating on all of them. They turn up when they say, they ring the tenant themselves, and I have never once had to chase an invoice or an argument.',
            role: 'Property manager, Northwind Lettings',
            title: 'The numbers, including the bad one.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            description:
              'Left on our page by people in Ashcombe. We have not tidied the wording.',
            eyebrow: 'Recent reviews',
            items: [
              {
                author: 'Prue Hetherington',
                quote:
                  'Boiler died on the Sunday of the cold snap. Sean was on Cobb Lane within the hour, found a seized pump, and had it running by half nine. Charged me the out-of-hours rate he quoted on the phone and not a penny over.',
                rating: 5,
                role: 'Cobb Lane, Ashcombe',
              },
              {
                author: 'Marcus Ofori',
                quote:
                  'They came out three times over two years for the same old boiler and kept patching it. When it finally went, Kieran said so straight and quoted a swap. No hard sell in any of it.',
                rating: 5,
                role: 'Fenn Street, Ashcombe',
              },
              {
                author: 'Jean Whitlow',
                quote:
                  'Late by about forty minutes and rang twice to tell me so, which I would rather have than silence. Fixed the leak under the bath and took the old lino out to the van.',
                rating: 4,
                role: 'Harkness Close, Sattersfield',
              },
            ],
            title: 'What people said last month.',
          },
          id: 'reviews',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Why us',
            links: [{ link: { appearance: 'default', label: 'Read the reviews' } }],
            paragraphs: [
              {
                text: 'You get one of four people, and you will recognise all of them by the second visit. Bernie answers the phone in the office on Tannery Row, not a call centre, and she books what we can actually do rather than what fills the diary.',
              },
              {
                text: 'We text you a two-hour window before we set off and ring if we are going to miss it. Boots come off or covers go down. Old parts and packaging leave in the van. If we get something wrong we come back and put it right, and we do not bill you twice for the same fault.',
              },
            ],
            title: 'Same four faces. Same phone number. Since 1991.',
          },
          id: 'why-us',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description:
              'The five things people ask Bernie before they book. If yours is not here, ring and ask her.',
            eyebrow: 'Before you ring',
            items: [
              {
                answer:
                  'No, and there never has been. You pay for the time we are actually working and the parts we actually fit. Getting the van to your door is on us.',
                question: 'Do you charge a callout fee?',
              },
              {
                answer:
                  'A fixed rate for the first hour, then by the half hour after that. Bernie tells you both figures on the phone before we set off, and out of hours carries one flat surcharge she will also tell you.',
                question: 'How do you work out the bill?',
              },
              {
                answer:
                  'Ring before eleven and no heat or no hot water is almost always the same day. Everything else is usually within two working days, and we text you a two-hour window before we leave the yard.',
                question: 'How soon can you get someone out?',
              },
              {
                answer:
                  'Anything expected to run longer than half a day gets a written quote before we start, and the quote is the price. Parts go on the invoice at what we paid for them plus a flat handling charge.',
                question: 'Will you quote before you start?',
              },
              {
                answer:
                  'Every engineer on our vans is gas-qualified and carries their card, and we hold public liability cover — ask at the door or on the phone and we will show you both.',
                question: 'Are you qualified and insured?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Get in touch' } }],
            title: 'Questions people ask first',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Ring the office and Bernie will tell you when we can be there and what it will cost to find out. If it is out of hours, one of us picks up the mobile.',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'Areas we cover' } },
            ],
            title: 'No heat? Ring us now.',
          },
          id: 'cta',
        },
      ],
      title: 'Halloran & Sons — Heating and plumbing in Ashcombe',
    },
    {
      description:
        'Lists the jobs they take on in full, then walks through exactly how a callout runs from the phone call to the invoice.',
      label: 'Services',
      path: 'services',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Four groups of work, and honestly not much outside them. We do not do electrics, we do not do roofs, and we will tell you who does.',
            eyebrow: 'Services',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'Areas we cover' } },
            ],
            proofItems: [
              { label: 'No callout fee' },
              { label: 'Quoted before we start' },
              { label: 'Gas-qualified engineers' },
            ],
            title: 'What we fix.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'Roughly in the order the phone rings. Anything in these four we can talk about properly on the phone before anyone gets in a van.',
            eyebrow: 'The work',
            items: [
              {
                description:
                  'Fault-code lockouts, seized pumps, failed diverter valves, noisy boilers, no hot water, cold radiators, pressure that will not hold. We carry the common parts, so most repairs are finished on the first visit.',
                icon: 'zap',
                title: 'Boilers and heating',
              },
              {
                description:
                  'Burst pipes, dripping stopcocks, leaks under floors we trace with a meter before lifting anything, blocked sinks, blocked toilets, and drains we jet from the outside.',
                icon: 'fingerprint',
                title: 'Leaks, drains, and blockages',
              },
              {
                description:
                  'Boiler swaps, new cylinders, unvented systems, whole heating installs, and moving a boiler out of a bedroom cupboard. Written quote first, fixed price, and we take the old one away.',
                icon: 'database',
                title: 'Installs and replacements',
              },
              {
                description:
                  'Annual boiler services, power flushing a system that has never had one, landlord checks with the paperwork emailed the same afternoon, and outside taps before the summer.',
                icon: 'id-card',
                title: 'Servicing and landlord work',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Read the reviews' } }],
            title: 'Four kinds of job.',
          },
          id: 'jobs',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Two we get asked about',
            paragraphs: [
              {
                text: 'Two jobs come up often enough that it is worth saying more than a line. Both are quoted in writing before anything starts, and both are priced as one job rather than by the hour.',
              },
            ],
            rows: [
              {
                description:
                  'We size the boiler to the house, not to the old one — half the cold-radiator calls we get are a boiler somebody oversized fifteen years ago. Quote in writing, one price, old boiler and packaging away in the van, and the system flushed and balanced before we hand it back. Two days for a straight swap, three or four if the pipework has to move.',
                title: 'Swapping a boiler',
              },
              {
                description:
                  'If the top of a radiator is warm and the bottom is cold, that is sludge, and no amount of bleeding will shift it. We pump the system through with a magnetic filter on the return until it runs clear, then dose it and fit a filter so it does not come back. One long day for a normal house, and you keep the water we take out if you want to see it.',
                title: 'Power flushing a system',
              },
            ],
            title: 'The two big ones, explained.',
          },
          id: 'detail',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'This is the whole thing, start to finish. Nothing appears on the invoice that was not said out loud first.',
            eyebrow: 'How a callout runs',
            items: [
              {
                description:
                  'Bernie asks what it is doing, how long it has been doing it, and the make of the boiler if you can see it. She tells you the first-hour rate and the day we can come. No callout fee, so that conversation costs you nothing.',
                title: 'You ring the office',
              },
              {
                description:
                  'We text a two-hour window before leaving the yard, and ring if we are going to miss it. Covers down, boots off, and we find the fault before we quote the fix — then tell you the price and wait for you to say yes.',
                title: 'A van turns up in the window',
              },
              {
                description:
                  'Most jobs finish that visit. If a part has to come, we make it safe and give you a day. Old parts and packaging leave with us, the invoice comes the same day, and you have seven days to pay it however suits you.',
                title: 'It gets fixed, and cleared up',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Get in touch' } }],
            title: 'Three steps, no surprises.',
          },
          id: 'how-a-callout-works',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description:
              'Grouped the way people ask them: when, what it costs, and what happens on the day.',
            eyebrow: 'The detail',
            groups: [
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'Monday to Friday, half seven to six, and Saturday morning until one. Emergencies any hour of any day, including Christmas — that is one of us on the mobile, not an agency.',
                    question: 'When are you working?',
                  },
                  {
                    answer:
                      'Ring before eleven and no heat or no hot water is almost always the same day. Everything else is usually inside two working days, and installs are booked to a date that suits you.',
                    question: 'How far ahead are you booked?',
                  },
                ],
                title: 'Getting someone out',
              },
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'No callout fee. A fixed rate for the first hour, then by the half hour. Bernie tells you both before we set off, and out of hours carries a single flat surcharge she will also tell you on the phone.',
                    question: 'How is the labour charged?',
                  },
                  {
                    answer:
                      'At what we paid for them, plus one flat handling charge that is on the invoice as its own line. We do not mark parts up and we will show you the merchant receipt if you ask.',
                    question: 'What about parts?',
                  },
                  {
                    answer:
                      'Card, bank transfer, or cash. The invoice comes the same day as the work and you have seven days. Landlords and agents can go on monthly account.',
                    question: 'How do we settle up?',
                  },
                ],
                title: 'What it costs',
              },
              {
                icon: 'truck',
                items: [
                  {
                    answer:
                      'One of four: Kieran, Sean, Marek, or Tom. All gas-qualified, all carrying their card, and all of them will show it at the door without being asked.',
                    question: 'Who actually turns up?',
                  },
                  {
                    answer:
                      'Yes, and everything we take out goes with us — old boiler, old radiators, packaging, the lot. If we have made dust we hoover it before we go.',
                    question: 'Do you clear up after yourselves?',
                  },
                  {
                    answer:
                      'Ring the office and we come back. If it is the same fault we are not billing you twice for it — that is the whole of our guarantee and it has not needed writing down in thirty-five years.',
                    question: 'What if it goes wrong again?',
                  },
                ],
                title: 'On the day',
              },
            ],
            title: 'Everything else you might ask.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Tell us what it is doing and how long it has been doing it. If it is heat or water, we will get to you today where we can.',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'Read the reviews' } },
            ],
            title: 'Ring the office.',
          },
          id: 'cta',
        },
      ],
      title: 'Halloran & Sons — What we fix',
    },
    {
      description:
        'Names every area they cover in six plain rings, says how fast they get to each, and shows what is in the vans.',
      label: 'Areas',
      path: 'areas',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Ashcombe and about twelve miles around it. If you are on the list below we come out for the price of the work and nothing for the miles.',
            eyebrow: 'Areas',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'See what we fix' } },
            ],
            proofItems: [
              { label: 'No mileage charge' },
              { label: 'Two-hour arrival window' },
              { label: 'Emergencies seven days' },
            ],
            title: 'Where we come out to.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'The boundary',
            links: [{ link: { appearance: 'default', label: 'Get in touch' } }],
            paragraphs: [
              {
                text: 'We work out of the yard at Unit 4, Tannery Row, and everything below is inside about twelve miles of it. There is no mileage charge anywhere on this page — a van going out is our cost, not yours.',
              },
              {
                text: 'Further than that and it depends on the day. Ring and ask: if we have someone finishing a job out your way, we will say yes, and if we cannot get to you properly we will say so and give you the name of somebody who can.',
              },
            ],
            title: 'Twelve miles from a yard on Tannery Row.',
          },
          id: 'coverage',
        },
        {
          /* One section does the whole job of an areas page: six named rings in
           * the features grid (no icons — the block's allowlist is a software
           * set and a place list reads better plain) with the response facts as
           * the arrow list underneath. */
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Six rings',
            features: [
              {
                description:
                  'Ashcombe town, Bellhouse, Quarry Bank, and the streets off Old Mill Row. Ninety minutes from your call to a van on the drive, most days.',
                title: 'Ashcombe and the ring road',
              },
              {
                description:
                  'Kirkby Wend, Highbridge, and Nettlebed Cross. Half an hour up from the yard once the bridge is clear, which it usually is by nine.',
                title: 'North, over the bridge',
              },
              {
                description:
                  'Marlow Bank, Cold Harbour, and Dyer’s End. Marek lives out that way and starts there, so early appointments are easy to get.',
                title: 'The Marlow side',
              },
              {
                description:
                  'Sattersfield, Pellham Cross, and Wenlock. A good third of the rented properties we look after are in these three.',
                title: 'East, past the works',
              },
              {
                description:
                  'Thornleigh, Ostley Green, and Barrow Hill. The hill adds twenty minutes in bad weather and we will say so when we book you in.',
                title: 'South, up the hill',
              },
              {
                description:
                  'Anywhere else inside about twelve miles. Ring and say where you are — Bernie knows the roads better than any map on a screen.',
                title: 'Everything in between',
              },
            ],
            paragraphs: [
              {
                text: 'Six rings, one phone number, and the same four engineers covering all of them. These are the honest travel times, not the ones that read best.',
              },
            ],
            stats: [
              {
                label: 'for no heat and no hot water, if you ring before eleven',
                value: 'Same day',
              },
              { label: 'arrival window, texted to you before we set off', value: 'Two hours' },
              { label: 'for emergencies, including Sundays and Christmas', value: 'Seven days' },
              { label: 'and no mileage charge, anywhere on this page', value: 'No callout fee' },
            ],
            title: 'How long it takes us to get there.',
          },
          id: 'response',
        },
        {
          /* The theme turns the twin's nested plates into hazard chevrons
           * framing a corrugated van panel — the back doors of a works van,
           * built entirely from tokens. */
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'The vans',
            paragraphs: [
              {
                text: 'Three vans, stocked the same way, so whoever turns up has the part. Pumps, diverter valves, fan assemblies, thermostats, the common PCBs, a metre of every pipe size we use, and a jetter on the roof of the big one.',
              },
              {
                text: 'That is why most jobs finish on the first visit. When something has to come from the merchant we make the system safe, tell you the day, and do not charge you for coming back.',
              },
            ],
            title: 'What is in the back of the van.',
          },
          id: 'the-van',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'Mostly asked by people right on the edge of the map.',
            eyebrow: 'Out your way',
            items: [
              {
                answer:
                  'No. Not inside the twelve miles, not for the first visit, and not for coming back if something we fixed plays up again.',
                question: 'Do you charge for travel?',
              },
              {
                answer:
                  'Ring and ask. If somebody is finishing out that way we will fit you in, and if we cannot do it properly we will say so rather than take the booking.',
                question: 'I am a bit further out — will you still come?',
              },
              {
                answer:
                  'Yes, and it is usually the easiest one to arrange. Give Bernie the agent or the tenant’s number and we will book straight with them and send you the paperwork.',
                question: 'Can you go to a property I do not live in?',
              },
              {
                answer:
                  'One of us has the mobile every night and every weekend, wherever you are on this page. It carries a flat surcharge and Bernie tells you what it is before we set off.',
                question: 'Is the out-of-hours number the same everywhere?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Get in touch' } }],
            title: 'Questions about the map',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Say where you are and what it is doing. Bernie will tell you the day, the window, and what the first hour costs before you commit to anything.',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'See what we fix' } },
            ],
            title: 'Are we near you? Ring and ask.',
          },
          id: 'cta',
        },
      ],
      title: 'Halloran & Sons — Where we come out to',
    },
    {
      description:
        'The proof engine, at length: ordinary reviews from named streets and real jobs, which is the only way this trade is actually judged.',
      label: 'Reviews',
      path: 'reviews',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Every review we have, good and middling, in the words people wrote them. We have not deleted the four-star ones and we have not tidied the spelling.',
            eyebrow: 'Reviews',
            links: [
              { link: { appearance: 'default', label: 'Tell us what is wrong' } },
              { link: { appearance: 'outline', label: 'See what we fix' } },
            ],
            proofItems: [
              { label: '1,140 callouts last year' },
              { label: 'Nine second visits' },
              { label: 'Nothing edited' },
            ],
            title: 'What people say.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            description:
              'The three most recent, including the one that cost us a star. She was right — we were late.',
            eyebrow: 'Last month',
            items: [
              {
                author: 'Prue Hetherington',
                quote:
                  'Boiler died on the Sunday of the cold snap. Sean was on Cobb Lane within the hour, found a seized pump, and had it running by half nine. Charged me the out-of-hours rate he quoted on the phone and not a penny over.',
                rating: 5,
                role: 'Cobb Lane, Ashcombe',
              },
              {
                author: 'Jean Whitlow',
                quote:
                  'Late by about forty minutes and rang twice to tell me so, which I would rather have than silence. Fixed the leak under the bath and took the old lino out to the van. Would have been five stars an hour earlier.',
                rating: 4,
                role: 'Harkness Close, Sattersfield',
              },
              {
                author: 'Denzil Achterberg',
                quote:
                  'Third firm I called about the cold upstairs radiators and the first to say the word sludge. Flushed the whole system in a day, fitted a filter, and the back bedroom is warm for the first time since we moved in.',
                rating: 5,
                role: 'Barrow Hill, Thornleigh',
              },
            ],
            title: 'The three most recent.',
          },
          id: 'recent',
        },
        {
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Nine of them, from nine streets. If you live near one of these, you can knock and ask.',
            eyebrow: 'The wall',
            items: [
              {
                author: 'Nolwenn Traoré',
                quote:
                  'Water coming through the kitchen ceiling at seven in the morning. Kieran answered the mobile himself, told me where the stopcock was before he left the yard, and was here inside forty minutes. Two floorboards up, one joint, done.',
                role: 'Old Mill Row, Ashcombe',
              },
              {
                author: 'Gordon Pyle',
                quote:
                  'Used them for nine years on three properties. Same two lads every time, they ring the tenants themselves, and the paperwork lands the same afternoon. That is the whole reason I have never looked elsewhere.',
                role: 'Landlord, Pellham Cross',
              },
              {
                author: 'Anneke Voss',
                quote:
                  'Quoted a new boiler in writing, stuck to it to the penny, and finished a day early. Tom put dust sheets down the hall without being asked and hoovered the airing cupboard on his way out.',
                role: 'Cadogan Terrace, Ashcombe',
              },
              {
                author: 'Ifeoma Balewa',
                quote:
                  'Rang about a dripping tap and Bernie talked me through tightening it myself over the phone. Would not take a booking for it. That is either very good business or very good manners and I do not much mind which.',
                role: 'Dyer’s Walk, Marlow Bank',
              },
              {
                author: 'Ray Tunnicliffe',
                quote:
                  'Twenty-two year old boiler and Marek got another winter out of it rather than selling me a new one. Told me straight it was the last winter, and it was. When it went they had the replacement in two days.',
                role: 'Wenlock Street, Sattersfield',
              },
              {
                author: 'Siobhán Mulcahy',
                quote:
                  'Blocked drain in the yard, twice in a month. Second time they jetted it properly, found the root that was doing it, and did not charge for the return visit even though I offered.',
                role: 'Tannery Row, Ashcombe',
              },
              {
                author: 'Bill Fothergill',
                quote:
                  'I am eighty-one and I have had a lot of tradesmen through this house. These are the only ones who explain what they are doing before they do it and then charge what they said. Dermot still comes on a Friday.',
                role: 'Ostley Lane, Ostley Green',
              },
              {
                author: 'Hannah Reddish',
                quote:
                  'Landlord check on a Friday afternoon, certificate emailed by five. Tenant said they were polite and quick and took their boots off. Booked all six properties in for next year on the spot.',
                role: 'Letting agent, Highbridge',
              },
              {
                author: 'Owain Prydderch',
                quote:
                  'Not a cheap quote and they did not pretend to be. What they were was exact — same price, same days, same two men, and the site tidy every evening. I would pay it again.',
                role: 'Nettlebed Hill, Kirkby Wend',
              },
            ],
            title: 'Everything people have written.',
          },
          id: 'all-reviews',
        },
        {
          /* SWAPPED from stats-proof. This trade has no metrics culture and the
           * home page already carries the one honest ledger — a second numbers
           * band here would be the exact marketing register this concept is
           * avoiding. The steel band instead prints the single longest review at
           * size, which is what a reviews page's loudest moment should be. */
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Ada Kirkbride',
              quote:
                'My husband died in the February and the heating went the week after. I did not know where the stopcock was, what a cylinder was, or who to ring. Kieran spent an hour showing me the whole system with a torch, wrote the important bits on the back of an envelope for me, and charged me for one hour.',
              role: 'Quarry Bank, Ashcombe — a customer since 2011',
            },
          },
          id: 'spotlight',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Gordon Pyle, landlord — nine years, three properties',
            eyebrow: 'From the commercial side',
            paragraphs: [
              {
                text: 'Landlords and letting agents are about a third of our week, and they judge us on two things: whether the tenant was happy and whether the paperwork arrived. Both of those are just turning up when you said you would.',
              },
            ],
            quote:
              'Same two lads every time, they ring the tenants themselves, and the certificate is in my inbox before they are back in the van. I have not had to chase Halloran once in nine years, which I cannot say about anyone else on my list.',
            title: 'The people who have no reason to be kind.',
          },
          id: 'quote',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'We would rather be judged on this page than on anything we could write about ourselves. Ring the office and we will add yours next month.',
            links: [
              { link: { appearance: 'default', label: 'Get in touch' } },
              { link: { appearance: 'outline', label: 'See what we fix' } },
            ],
            title: 'Ask one of them about us.',
          },
          id: 'cta',
        },
      ],
      title: 'Halloran & Sons — What people say',
    },
    {
      description:
        'Three ways to reach them, who picks up each one, and a form that asks only what an engineer actually needs to know.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'The office number is the one to ring in the day. Out of hours, one of us has the mobile — every night, every weekend, and Christmas.',
            eyebrow: 'Contact',
            links: [{ link: { appearance: 'outline', label: 'See what we fix' } }],
            proofItems: [
              { label: 'Mon–Fri 7:30–6' },
              { label: 'Sat 8–1' },
              { label: 'Emergencies any hour' },
            ],
            title: 'Get hold of us.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Bernadette answers this one, Monday to Friday half seven to six and Saturday until one. She can tell you the day, the window, and what the first hour costs.',
                label: 'Ring the office',
                value: '01632 960 118',
              },
              {
                description:
                  'Evenings, weekends, and bank holidays — one of the four of us, not an agency. Flat surcharge, told to you before we set off.',
                label: 'Out of hours',
                value: '01632 960 204',
              },
              {
                description:
                  'Best for landlord paperwork, quotes, and anything with a photograph attached. Answered by the end of the next working day.',
                label: 'Email',
                value: 'hello@halloran.example',
              },
              {
                description:
                  'There is a bell on the roller door and somebody is usually in it before eight. Weekday mornings are the safest bet.',
                label: 'The yard',
                value: 'Unit 4, Tannery Row',
              },
            ],
            description:
              'Ring if it is urgent — a phone is faster than a form and Bernie can usually tell you what is wrong before anyone gets in a van. Otherwise send the details and we will come back to you.',
            eyebrow: 'Contact',
            formConfigured: true,
            formDescription:
              'What it is doing, how long it has been doing it, and the make of the boiler if you can see it. A photograph of the fault code saves everybody an hour.',
            formLabels: ['Your name', 'Phone', 'Where you are', 'Boiler make', 'What is it doing?'],
            formTitle: 'Or tell us what is wrong',
            submitLabel: 'Send it to the office',
            title: 'One number, and a person on the end of it.',
          },
          id: 'contact',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description:
              'The practical ones. Anything else, ring the office and ask Bernie directly.',
            eyebrow: 'Booking in',
            items: [
              {
                answer:
                  'Ring before eleven and no heat or no hot water is almost always the same day. Everything else is usually within two working days.',
                question: 'How quickly will you come out?',
              },
              {
                answer:
                  'Yes — we text a two-hour window before leaving the yard and ring if we are going to miss it. Nobody is waiting in all day for us.',
                question: 'Do I get a time, or a whole day?',
              },
              {
                answer:
                  'Nothing to get us there and nothing to look. You pay for the time we work and the parts we fit, and you hear both figures before we set off.',
                question: 'What does it cost just to come and look?',
              },
              {
                answer:
                  'Give Bernie the tenant’s number and we will arrange it with them directly, then send you the certificate and the invoice the same day.',
                question: 'Can you deal with my tenant instead of me?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Read the reviews' } }],
            title: 'Before you send it',
          },
          id: 'faq',
        },
      ],
      title: 'Halloran & Sons — Get hold of us',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'trade-service',
  status: 'concept',
  summary:
    'The plainest site in the gallery, on purpose: a fictional family heating and plumbing firm built to be believed and phoned.',
  theme: {
    description:
      'Safety orange and steel on off-white paper — high contrast, heavy type, hard edges, signwriter label bars, and corrugated-steel plates. Workwear and signage, with no decoration for its own sake.',
    id: 'trade-service',
    swatches: ['#f6f5f2', '#1b2026', '#f07a1e'],
  },
  title: 'Trade Service',
  visualTone: ['Plain-spoken', 'High-contrast', 'Signage'],
}
