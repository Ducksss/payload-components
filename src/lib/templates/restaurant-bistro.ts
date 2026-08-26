import type { TemplateShowcase } from './types'

/* Restaurant — "Tansy", a fictional dining room in the fictional harbour town
 * of Porthmere.
 *
 * WAVE 0 SKELETON — the recipe (pages, sections, tones) is frozen; the copy
 * below is a coherent first draft the art-direction wave replaces. Do not ship
 * this file without that pass.
 *
 * Register this concept must own (uncovered by the other twelve): hospitality —
 * sensory, unhurried, food-first. The information architecture is a menu and a
 * reservation: what is on tonight, whether there is a table, and how to get
 * one. The site's whole job is to make you ring before six.
 *
 * Canonical facts, kept consistent across every page: the room seats 38 with
 * eight more at the zinc counter; Etta Voss cooks, her partner Joan Carrow runs
 * the floor; open Wednesday to Sunday, dinner from six, Sunday lunch from
 * twelve; the menu is written at four each afternoon after the boats and the
 * morning market; the Long Room upstairs seats 22; ten years on Weir Street
 * this autumn.
 *
 * Everything is fictional: the restaurant, the town, the people, the suppliers,
 * the local paper, and every review. No hygiene rating, guide, star scheme, or
 * awards body is named or invented. Phone numbers sit inside the 01632 96xxxx
 * fiction range; email uses the reserved `.example` domain.
 *
 * There are NO currency amounts anywhere. A dining room solves this naturally:
 * set menus are counted in courses ("Three courses", "The whole table"), and
 * everything else is "ask when you book". */

export const restaurantBistroTemplate: TemplateShowcase = {
  assets: [],
  category: 'restaurant',
  description:
    'Tansy is a fictional 38-seat dining room in the fictional harbour town of Porthmere: a menu written at four each afternoon after the boats come in, a zinc counter, and a phone number you ring before six. The concept owns the hospitality register — sensory, unhurried, food-first — across five pages: Home, Menu, Private dining, Our story, and Find us, with the reservation as the one action everything points at. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Menu', path: 'menu' },
    { label: 'Private dining', path: 'private-dining' },
    { label: 'Our story', path: 'story' },
    { label: 'Find us', path: 'visit' },
  ],
  pages: [
    {
      description:
        'The room, tonight’s cooking, and the phone number — everything a first-time guest needs to decide to ring before six.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'A small dining room on Weir Street, ten years old this autumn. Etta cooks what the boats and the market give her; Joan will find you a table if there is one to find. Dinner from six, Wednesday to Sunday.',
            eyebrow: 'Tansy · Porthmere',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Tonight’s menu' } },
            ],
            proofItems: [
              { label: 'Dinner from six' },
              { label: '38 seats, 8 at the counter' },
              { label: 'Menu written at four' },
            ],
            title: 'A dining room by the harbour wall.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'The room',
            links: [{ link: { appearance: 'outline', label: 'See the menu' } }],
            paragraphs: [
              {
                text: 'One low-lit room: a dozen tables, a zinc counter along the pass with eight stools, and the kitchen open at the far end. Nothing on the walls but the day’s menu and a clock Joan refuses to fix.',
              },
              {
                text: 'The counter is the best seat in the house and the last to book out — you eat in front of the stove and Etta will talk to you between checks, or not, depending on the night.',
              },
            ],
            title: 'Twelve tables and a counter.',
          },
          id: 'the-room',
          tone: 'muted',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Tonight, roughly',
            paragraphs: [
              {
                text: 'The menu is written at four and posted in the window by five. These three have been on more often than not this month, which is as close to a signature as this kitchen gets.',
              },
            ],
            rows: [
              {
                description:
                  'Whatever came off the day boats, grilled whole over the fire with green sauce and not much else. Sold by the fish, shared by the table.',
                title: 'The day-boat fish',
              },
              {
                description:
                  'Baked in its own dish until the top catches, with bread from the morning bake to drag through it.',
                title: 'Crab and cider gratin',
              },
              {
                description:
                  'The pudding that has never once left the menu in ten years. Burnt at the top on purpose. One spoon per person, no exceptions Joan will admit to.',
                title: 'Brown-butter tart',
              },
            ],
            title: 'Written at four. Gone by ten.',
          },
          id: 'tonight',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Maren Sedgewick',
            body: 'Ten years in, the shape of a night has not changed: one sitting at the counter, two in the room, and the menu ends when the kitchen says it ends. The numbers stay small because the room does.',
            description:
              'The whole operation, counted honestly. A room this size does not need bigger numbers — it needs the same ones every night.',
            eyebrow: 'The ledger',
            logoLabel: 'THE PORTHMERE COURANT',
            metrics: [
              { label: 'seats, and eight more at the counter', value: '38' },
              { label: 'suppliers, all within a morning’s drive', value: '9' },
              { label: 'the hour the menu is written, daily', value: '4pm' },
              { label: 'years on Weir Street this autumn', value: '10' },
            ],
            quote:
              'Tansy is the reason people miss the last ferry on purpose. A menu written the same afternoon you eat it, a counter you can watch it cooked from, and a room that has never once rushed a table.',
            role: 'Food pages, The Porthmere Courant',
            title: 'A small room, on purpose.',
          },
          id: 'ledger',
          tone: 'contrast',
        },
        {
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'Bram Hollis',
              quote:
                'We ate at the counter on a Wednesday in February — storm outside, six of us in the room. Etta cooked the whole menu for whoever turned up and Joan poured what she thought we should drink. Best table I have ever had, and it was a stool.',
              role: 'Regular since the second winter',
            },
          },
          id: 'word-of-mouth',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description:
              'The four things Joan answers on the phone most nights, saved here so the line stays free.',
            eyebrow: 'Before you come',
            items: [
              {
                answer:
                  'Ring after three, when the day’s book is open. We hold four tables every night for the phone, and the counter is first come while it lasts.',
                question: 'How do I get a table?',
              },
              {
                answer:
                  'Always — that is what the counter is for. If the room is full, Joan will tell you honestly how long the wait looks and where to have a drink in the meantime.',
                question: 'Do you take walk-ins?',
              },
              {
                answer:
                  'Tell us when you book and the kitchen writes you into the menu, not around it. Etta would rather know at four than at eight.',
                question: 'Can you cook around allergies?',
              },
              {
                answer:
                  'Dinner from six, Wednesday to Sunday, and Sunday lunch from twelve. The kitchen rests Monday and Tuesday, and so do we.',
                question: 'When are you open?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Find us' } }],
            title: 'Asked most nights',
          },
          id: 'before-you-come',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Ring after three and Joan will find you a table or tell you the honest wait. The counter cannot be booked — it belongs to whoever walks in first.',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Tonight’s menu' } },
            ],
            title: 'Ring before six.',
          },
          id: 'book',
        },
      ],
      title: 'Tansy — A dining room in Porthmere',
    },
    {
      description:
        'Tonight’s cooking in full — what comes first, what the fire gets, what the set menus hold — and the kitchen’s honest small print.',
      label: 'Menu',
      path: 'menu',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Written at four each afternoon, after the boats and the market have said what there is. What follows is a fair picture of a night; the window on Weir Street has the real thing from five.',
            eyebrow: 'The menu',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Private dining' } },
            ],
            proofItems: [
              { label: 'Changes daily' },
              { label: 'Nine suppliers, one morning' },
              { label: 'Bread baked at seven' },
            ],
            title: 'The menu changes with the boats.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'To start',
            paragraphs: [
              {
                text: 'Small things first, made to be argued over in the middle of the table while the fire gets on with the mains.',
              },
            ],
            rows: [
              {
                description: 'Shucked to order at the counter, with cider vinegar and not lemon.',
                title: 'Oysters from the Nare beds',
              },
              {
                description:
                  'On dripping toast, under pickled onions sliced thin enough to read through.',
                title: 'Potted mackerel',
              },
              {
                description:
                  'The morning bake, burnt butter, and salt Joan brings back from the far side of the estuary.',
                title: 'Bread and brown butter',
              },
              {
                description:
                  'Charred on the plancha and dressed at the last second, while you watch.',
                title: 'First-of-season leeks',
              },
            ],
            title: 'For the middle of the table.',
          },
          id: 'to-start',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'From the fire',
            paragraphs: [
              {
                text: 'Mains come off the wood fire at the back of the pass. Most nights there are five; these are the shapes they take.',
              },
            ],
            rows: [
              {
                description:
                  'Whole, over the coals, finished with green sauce. Sized for two who like each other.',
                title: 'The day-boat fish',
              },
              {
                description:
                  'Ten days in the cold room, cooked dark, carved at the counter, bones to the dog you promised.',
                title: 'Rib of Dunnet Farm beef',
              },
              {
                description:
                  'Whatever the walled garden sent, cooked with as much care as the beef and priced by the plate — ask Joan when you book.',
                title: 'The garden plate',
              },
            ],
            title: 'Five most nights.',
          },
          id: 'from-the-fire',
          tone: 'muted',
        },
        {
          componentSlug: 'pricing-cards-muted',
          content: {
            description:
              'Two ways to hand the night to the kitchen. Both are counted in courses, not choices — tell us what you cannot eat and Etta writes the rest.',
            eyebrow: 'Set menus',
            plans: [
              {
                description: 'Wednesday to Friday, whole table only',
                features: [
                  'A start, a main, and the tart',
                  'Written for the table, not the person',
                  'The night’s bread and butter included',
                ],
                link: { appearance: 'outline', label: 'Book the early sitting' },
                name: 'The early sitting',
                price: 'Three courses',
              },
              {
                description: 'The kitchen decides, course by course',
                featured: true,
                features: [
                  'Everything the market gave us that morning',
                  'The counter’s running commentary included',
                  'Ends when the kitchen says it ends',
                ],
                link: { appearance: 'default', label: 'Ask for the counter menu' },
                name: 'The counter menu',
                price: 'Seven courses',
              },
            ],
            title: 'Let the kitchen drive.',
          },
          id: 'set-menus',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'The kitchen’s small print, stated plainly.',
            eyebrow: 'Kitchen notes',
            items: [
              {
                answer:
                  'Tell us when you book. Allergies are cooked around properly — separate pans, separate boards — not picked off the top.',
                question: 'Allergies and what you cannot eat',
              },
              {
                answer:
                  'Yes, always at least one, and it is written with the same attention as the fish. Say when you book so the garden plate is a plan rather than a scramble.',
                question: 'Cooking without meat or fish',
              },
              {
                answer:
                  'Bring a bottle that means something to you on a Wednesday or a Thursday and Joan will open it, no charge for the first. She will also tell you if she has something better.',
                question: 'Bringing your own bottle',
              },
              {
                answer:
                  'The menu in the window at five is the menu. When a dish runs out the line goes through it in pen, and the counter hears it first.',
                question: 'When things run out',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Book a table' } }],
            title: 'Honest small print',
          },
          id: 'kitchen-notes',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'The window on Weir Street has tonight’s menu from five. The phone has Joan from three. Between the two of them you will know everything we do.',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Find us' } },
            ],
            title: 'Eat what the day sent.',
          },
          id: 'book',
        },
      ],
      title: 'Tansy — The menu',
    },
    {
      description:
        'The Long Room upstairs — how a private night runs, what the table can hold, and the two ways to take the room.',
      label: 'Private dining',
      path: 'private-dining',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'One long table under the window, twenty-two chairs, and the same kitchen working one floor down. For birthdays, wakes, weddings the size of a family, and any night that needs a door that closes.',
            eyebrow: 'The Long Room',
            links: [
              { link: { appearance: 'default', label: 'Send an enquiry' } },
              { link: { appearance: 'outline', label: 'See the menu' } },
            ],
            proofItems: [
              { label: 'Seats 22 at one table' },
              { label: 'Its own stair from the street' },
              { label: 'One party a night' },
            ],
            title: 'The room upstairs.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'One table',
            paragraphs: [
              {
                text: 'The Long Room runs the length of the building: one oak table, the harbour out of three windows, and its own stair up from the street so your night never crosses the main room.',
              },
              {
                text: 'It holds twenty-two seated, or thirty standing if what you want is glasses and things on toast. We host one party a night up here — the room is never split and never shared.',
              },
            ],
            title: 'The length of the building.',
          },
          id: 'the-long-room',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'Three steps between the first email and the chairs going back against the wall. Nothing is signed before the tasting.',
            eyebrow: 'How a night runs',
            items: [
              {
                description:
                  'Tell us the date, the number, and the occasion. Joan replies within a day with what the room can do and holds the date for a week while you decide.',
                title: 'Ask for the date',
              },
              {
                description:
                  'You come in on a quiet evening, eat the menu Etta proposes at the counter, and change anything you like. The menu you leave with is the menu you get.',
                title: 'Taste the menu',
              },
              {
                description:
                  'The room is yours from an hour before your guests. One bill for the table at the end, arranged however you asked for it when you booked.',
                title: 'Take the room',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Send an enquiry' } }],
            title: 'Ask. Taste. Take the room.',
          },
          id: 'how-it-runs',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'Two ways to take the room, and the whole-house option for the nights that outgrow it. Numbers are seats, not promises — the table does not stretch.',
            features: [
              {
                feature: 'Seats at the table',
                values: [
                  { label: 'Up to 22' },
                  { label: 'Up to 30' },
                  { label: '46 across both floors' },
                ],
              },
              {
                feature: 'Own entrance from the street',
                values: [{ included: true }, { included: true }, { included: true }],
              },
              {
                feature: 'Menu format',
                values: [
                  { label: 'Set, tasted first' },
                  { label: 'Standing — things on toast' },
                  { label: 'Set, tasted first' },
                ],
              },
              {
                feature: 'The counter included',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Music of your own',
                values: [{ included: true }, { included: true }, { included: true }],
              },
            ],
            plans: [
              { highlighted: true, name: 'The Long Room, seated' },
              { name: 'The Long Room, standing' },
              { badge: 'Rare', name: 'The whole house' },
            ],
            title: 'The room, at a glance.',
          },
          id: 'rooms',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Odile Fairweather',
              quote:
                'We married at the harbour office at four and were at the long table by six, all nineteen of us. Etta sent up the counter menu, Joan ran the room like she had known our families for years, and at midnight they let my father sing. I would not change one minute of it.',
              role: 'The Long Room, last September',
            },
          },
          id: 'a-wedding',
          tone: 'contrast',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'Tell us the date and the number and Joan will come back within a day — usually the same afternoon, once the book is open at three.',
            emailPlaceholder: 'you@yourhouse.example',
            submitLabel: 'Send the enquiry',
            title: 'Ask for the Long Room.',
          },
          id: 'enquire',
        },
      ],
      title: 'Tansy — The Long Room',
    },
    {
      description:
        'Ten years of the same idea — the people who cook and run the room, and the nine suppliers the menu is written around.',
      label: 'Our story',
      path: 'story',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Tansy opened the autumn the fish market nearly closed, in a chandlery that had stood empty for years. The idea has not changed since: shop first, write the menu second, and keep the room small enough to look after.',
            eyebrow: 'Our story',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Meet the suppliers' } },
            ],
            proofItems: [
              { label: 'Est. ten years ago' },
              { label: 'Same kitchen, same floor' },
              { label: 'Named after the weed outside' },
            ],
            title: 'A kitchen that shops before it writes.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Etta Voss, chef and co-owner',
            eyebrow: 'The idea',
            paragraphs: [
              {
                text: 'The name is the yellow weed that grew through the step the first winter, when the room was six tables and the fire did not always light. The step got fixed. The name stayed to keep us honest about where we started.',
              },
            ],
            quote:
              'I do not write a menu and then go shopping for it. I go to the harbour and the market, see what is good, and the menu is whatever that was. Some afternoons that takes ten minutes. Some afternoons it is a fight.',
            title: 'Shop first. Write second.',
          },
          id: 'the-idea',
        },
        {
          componentSlug: 'team-grid',
          content: {
            description:
              'Eight of us, most of whom have been here long enough to argue properly. You will be looked after by someone in this grid, not by a rota.',
            eyebrow: 'The people',
            members: [
              { name: 'Etta Voss', role: 'Chef & co-owner' },
              { name: 'Joan Carrow', role: 'The floor & co-owner' },
              { name: 'Sülo Demirkan', role: 'Sous chef' },
              { name: 'Prue Ganley', role: 'Pastry & the morning bake' },
              { name: 'Fenn Aldous', role: 'The fire' },
              { name: 'Marta Okonjo', role: 'The counter' },
            ],
            title: 'The kitchen and the floor.',
          },
          id: 'the-people',
          tone: 'muted',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The suppliers',
            features: [
              {
                description:
                  'Two day boats out of Porthmere harbour. What they land by eleven decides the top half of the menu.',
                title: 'The Merrow sisters',
              },
              {
                description:
                  'Beef and lamb from the hill behind the town, hung properly and delivered on Thursdays in an estate car older than the restaurant.',
                title: 'Dunnet Farm',
              },
              {
                description:
                  'A walled garden two lanes inland that grows to the kitchen’s list — and beyond it, whenever Ada decides the kitchen’s list is boring.',
                title: 'Ada’s walled garden',
              },
              {
                description:
                  'Oysters and mussels from the Nare beds, counted in dozens on a slate that has never once matched the invoice.',
                title: 'The Nare beds',
              },
              {
                description:
                  'Flour from the last working mill on the estuary, which becomes the seven o’clock bake and the dripping toast.',
                title: 'Saltmill flour',
              },
              {
                description:
                  'Cheese from three farms over the water, chosen by Joan on the ferry every other Tuesday.',
                title: 'The Tuesday cheese run',
              },
            ],
            paragraphs: [
              {
                text: 'Nine suppliers, all within a morning’s drive or a ferry ride, every one of them visited before they were ever rung. The menu is theirs as much as ours.',
              },
            ],
            stats: [
              { label: 'suppliers on the book, and no brokers', value: '9' },
              { label: 'miles to the farthest of them', value: '31' },
              { label: 'the hour the last van leaves', value: '11am' },
              { label: 'of the menu decided by that morning', value: 'All of it' },
            ],
            title: 'Nine names the menu answers to.',
          },
          id: 'the-suppliers',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Maren Sedgewick' },
              { name: 'Bram Hollis' },
              { name: 'Odile Fairweather' },
              { name: 'Fenn Aldous' },
              { name: 'Ada Meadowcroft' },
            ],
            eyebrow: 'The town',
            paragraphs: [
              {
                text: 'A room this size only works if the town wants it there. The fishermen eat at the counter on Sundays, the market traders take the first tables in winter, and half the Long Room’s bookings are birthdays we have watched grow up.',
              },
            ],
            title: 'Porthmere keeps the lights on.',
          },
          id: 'the-harbour',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'The room is small, the menu is tonight’s only, and Joan answers from three. That is the whole system, and it has worked for ten years.',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Find us' } },
            ],
            title: 'Come and eat with us.',
          },
          id: 'book',
        },
      ],
      title: 'Tansy — Our story',
    },
    {
      description:
        'Where the room is, when the kitchen cooks, and every way to reach Joan — with the booking form for anything the phone cannot catch.',
      label: 'Find us',
      path: 'visit',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Number 4 Weir Street, the blue door beside the old chandlery crane, two minutes up from the harbour steps. Dinner from six Wednesday to Sunday; Sunday lunch from twelve.',
            eyebrow: 'Find us',
            links: [{ link: { appearance: 'outline', label: 'Tonight’s menu' } }],
            proofItems: [
              { label: 'Wed–Sun from six' },
              { label: 'Sunday lunch from twelve' },
              { label: 'The blue door on Weir Street' },
            ],
            title: 'Two minutes up from the harbour.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Joan, from three each afternoon the kitchen cooks. The fastest way to a table tonight, and the only way to the last four we hold back.',
                label: 'Ring the room',
                value: '01632 960 447',
              },
              {
                description:
                  'For dates further out, the Long Room, and anything with a question mark in it. Answered before the first covers sit.',
                label: 'Email',
                value: 'joan@tansy.example',
              },
              {
                description:
                  'The window has tonight’s menu from five. If you are standing in front of it, come in — the counter may have a stool.',
                label: 'The blue door',
                value: '4 Weir Street, Porthmere',
              },
            ],
            description:
              'Ring for tonight — the book lives by the phone and Joan can see it and you cannot. The form is for everything with more notice than that.',
            eyebrow: 'Bookings',
            formConfigured: true,
            formDescription:
              'Tell us the date, the number of you, and anything the kitchen should know before it writes the menu at four.',
            formLabels: [
              'Your name',
              'Phone',
              'How many of you',
              'The date',
              'Anything we should know',
            ],
            formTitle: 'Ask for a table',
            submitLabel: 'Send it to Joan',
            title: 'The book lives by the phone.',
          },
          id: 'book',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Getting here',
            links: [{ link: { appearance: 'default', label: 'Book a table' } }],
            paragraphs: [
              {
                text: 'Weir Street is foot traffic only from five, which is half the charm and all of the parking problem. The harbour car park is two minutes down the steps and free after six; the last town bus leaves the quay at 10:40 and Joan knows the timetable better than the driver.',
              },
              {
                text: 'The room is level from the street through the blue door, and the counter has two low stools we keep for anyone who wants them. The Long Room is up one flight of the old chandlery stairs — tell us if the stairs are a problem and we will seat your party downstairs instead.',
              },
            ],
            title: 'Steps, buses, and the car park.',
          },
          id: 'getting-here',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'The practical questions, answered the way Joan answers them.',
            eyebrow: 'Small print',
            items: [
              {
                answer:
                  'Well-behaved dogs are welcome at the counter and the two window tables. The clock dog, Biscuit, was here first and will make that clear.',
                question: 'Can I bring the dog?',
              },
              {
                answer:
                  'Children are welcome and get the same menu smaller, not a different menu worse. High chairs live behind the counter — ask when you book.',
                question: 'What about children?',
              },
              {
                answer:
                  'Life happens. Ring by three and the table goes back in the book, no quibble. Long Room dates ask for a week because the room turns away a whole night for you.',
                question: 'What if we have to cancel?',
              },
              {
                answer:
                  'Tables are yours for the evening — we run one sitting in the room. The counter turns naturally, which is why it cannot be booked.',
                question: 'How long do we get the table?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See the menu' } }],
            title: 'Before you set out',
          },
          id: 'small-print',
        },
      ],
      title: 'Tansy — Find us',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'restaurant-bistro',
  status: 'concept',
  summary:
    'A fictional 38-seat harbour-town dining room where the menu is written at four each afternoon — the hospitality register, built around a menu and a phone number.',
  theme: {
    description:
      'Candlelit warm cream and deep umber ink with a burnt-copper accent — low light, generous type, and the unhurried rhythm of a room that runs one sitting a night.',
    id: 'restaurant-bistro',
    swatches: ['#faf5ec', '#2b241c', '#b3562e'],
  },
  title: 'Restaurant Bistro',
  visualTone: ['Warm', 'Seasonal', 'Low-lit'],
}
