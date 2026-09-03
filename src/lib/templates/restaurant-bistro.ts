import type { TemplateShowcase } from './types'

/* Restaurant — "Tansy", a fictional dining room in the fictional harbour town
 * of Porthmere.
 *
 * Art direction: the hospitality register — a candlelit room. Warm cream
 * paper, deep umber ink, one burnt-copper accent, and a menu set in serif.
 * The interesting problem is low light on a forced-light site, and it is
 * solved by inversion of where the light lives: the PAGE stays warm cream
 * paper, and the candlelight lives in the things on it — every token-painted
 * image plate is a small dark still with a candle-glow pooled in it, each
 * page carries exactly one night band (the room after dark), and the tone
 * bands deepen the same cream the way light falls off across a table. Type
 * does the rest: headlines, dish names, and pull quotes move to the serif the
 * site already loads, so every page reads as a written menu — which is the
 * fiction (the menu is written at four, daily, by hand). The reservation is
 * the one action everything points at: ring before six.
 *
 *   Home            the room, tonight's cooking, and the phone number —
 *                   everything needed to decide to ring
 *   Menu            the written menu: starters as type, mains off the fire,
 *                   the set menus, and the kitchen's honest small print
 *   Private dining  the Long Room upstairs — how a night runs, what the
 *                   table holds, and the enquiry
 *   Our story       ten years of the same idea, the people, the nine
 *                   suppliers the menu answers to
 *   Find us         where the room is, when the kitchen cooks, and the form
 *                   for everything the phone cannot catch
 *
 * Canonical facts, kept consistent across every page: the room seats 38 with
 * eight more at the zinc counter; Etta Voss cooks, her partner Joan Carrow
 * runs the floor; open Wednesday to Sunday, dinner from six, Sunday lunch
 * from twelve; the menu is written at four each afternoon after the boats and
 * the morning market, posted in the window by five; the room runs one sitting
 * a night and the counter turns at its own pace, unbooked; the Long Room
 * upstairs seats 22 at one table (30 standing, one party a night); nine
 * suppliers, all within a morning's drive or a ferry ride; ten years on Weir
 * Street this autumn, at number 4, the blue door.
 *
 * Everything is fictional: the restaurant, the town, the people, the
 * suppliers, the local paper (The Porthmere Courant), and every review. No
 * hygiene rating, guide, star scheme, or awards body is named or invented.
 * Phone numbers sit inside the 01632 96xxxx fiction range; email uses the
 * reserved `.example` domain.
 *
 * There are NO currency amounts anywhere. A dining room solves this
 * naturally: set menus are counted in courses ("Three courses", "Seven
 * courses"), and everything else is "ask when you book". All copy stays
 * editor-shaped (demo-content types); layout belongs to the twins and to the
 * Tansy shell and theme. */

export const restaurantBistroTemplate: TemplateShowcase = {
  assets: [],
  category: 'restaurant',
  description:
    'Tansy is a fictional 38-seat dining room in the fictional harbour town of Porthmere: a menu written at four each afternoon after the boats come in, a zinc counter, and a phone number you ring before six. The concept owns the hospitality register — candlelit warm cream, deep umber ink, one burnt-copper accent, and headlines set in a menu serif — across five pages: Home, Menu, Private dining, Our story, and Find us, with the reservation as the one action everything points at. Composed entirely from blocks in the open registry.',
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
          /* The quietest hero in the registry, which is the right one: a
           * dining room of this register does not shout, it states. The theme
           * gives the home hero its own id ('welcome', interior pages keep
           * 'hero') and the fullest version of the candle wash — a warm glow
           * rising from the FOOT of the band, because candlelight comes from
           * low, with a hairline at the bottom so the band reads as the front
           * of a menu card rather than a gap. The serif headline carries it.
           * The proof chips are restyled into the classic menu-foot line —
           * plain type separated by copper diamonds. Both CTAs map to real
           * routes: Book a table → visit, Tonight's menu → menu. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'A small room on Weir Street, ten years old this autumn. Etta cooks whatever the boats and the morning market hand her; Joan will find you a table if there is one to find. Dinner from six, Wednesday to Sunday.',
            eyebrow: 'Tansy · Porthmere',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Tonight’s menu' } },
            ],
            proofItems: [
              { label: 'Dinner from six' },
              { label: '38 seats, 8 at the counter' },
              { label: 'The menu is written at four' },
            ],
            title: 'A dining room by the harbour wall.',
          },
          id: 'welcome',
        },
        {
          /* The concept's first picture, so it has to establish the whole
           * visual grammar: the 16/7 plate is repainted by the theme as a
           * candlelit still — a deep umber field with the glow pooled low
           * left, where the counter lamp sits in the fiction. On the muted
           * band (a deeper sheet of the same cream) the dark plate reads as a
           * window into the low-lit room, while the page around it stays
           * paper. The clock Joan refuses to fix stays: it is the single
           * detail every reader remembers. */
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'The room',
            links: [{ link: { appearance: 'outline', label: 'Read the menu' } }],
            paragraphs: [
              {
                text: 'One low-lit room: a dozen tables, a zinc counter along the pass with eight stools, and the kitchen open at the far end. Nothing on the walls but tonight’s menu and a clock Joan refuses to fix.',
              },
              {
                text: 'The counter is the best seat in the house and the last to sell out — you eat in front of the stove, and Etta will talk to you between checks, or not, depending on the night.',
              },
            ],
            title: 'Twelve tables and a zinc counter.',
          },
          id: 'the-room',
          tone: 'muted',
        },
        {
          /* Three dishes with plates — the home page is allowed pictures of
           * the food where the Menu page deliberately is not (see that page's
           * swap note). Each row's still is lit from a different corner via
           * per-section glow variables, so the three plates read as three
           * moments in one room rather than one image copied down the page.
           * Dish names take the serif, so the row titles read as menu
           * entries. "Roughly" in the eyebrow is doing real work: the fiction
           * is a daily menu, so nothing on this page can promise a dish. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Tonight, roughly',
            paragraphs: [
              {
                text: 'The menu is written at four each afternoon and posted in the window by five. These three have been on more nights than not this month, which is as close to a signature as this kitchen lets itself get.',
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
                  'Picked white and brown meat baked in its own dish until the top catches, with bread from the morning bake to drag through it.',
                title: 'Crab and cider gratin',
              },
              {
                description:
                  'The pudding that has never once left the menu in ten years. Burnt at the top on purpose. One spoon each, and no exceptions Joan will admit to.',
                title: 'Brown-butter tart',
              },
            ],
            title: 'Written at four. Gone by ten.',
          },
          id: 'tonight',
        },
        {
          /* The page's one night band — the room after dark. A restaurant
           * has no metrics culture, so the four numbers are the ones a guest
           * would actually ask (seats, suppliers, the hour the menu is
           * written, the years), set as serif numerals. The quote panel is
           * the press voice: The Porthmere Courant is the concept's one
           * invented paper, attributed as such, and its logoLabel is restyled
           * by the theme into a small tracked masthead lockup in candlelight
           * amber. Note the body copy fixes a wave-0 inconsistency: the room
           * runs ONE sitting (as Find us says), the counter turns at its own
           * pace. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Maren Sedgewick',
            body: 'Ten years in, the shape of a night has not changed: one sitting in the room, the counter turning at its own pace, and the menu ending when the kitchen says it ends. The numbers stay small because the room does.',
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
          /* Two quotes in a row is deliberate, not an oversight: the ledger
           * above carries the PRESS voice on the night band, and this carries
           * a REGULAR's voice back on paper — review and word of mouth are
           * different kinds of proof for a restaurant and they should not be
           * merged into one band. The theme sets the blockquote in serif
           * italic at size, so it reads as the evening's best line rather
           * than a testimonial widget. */
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'Bram Hollis',
              quote:
                'We ate at the counter on a Wednesday in February — storm outside, six of us in the whole room. Etta cooked the entire menu for whoever turned up and Joan poured what she thought we should drink. The best table I have ever had, and it was a stool.',
              role: 'A regular since the second winter',
            },
          },
          id: 'word-of-mouth',
        },
        {
          /* The muted band gives the FAQ the feel of the back page of a menu.
           * Four questions only — the ones Joan actually answers on the
           * phone — because a first visit needs the table mechanics, not a
           * policy document. Everything else lives on Menu (kitchen notes)
           * and Find us (small print), so nothing repeats. */
          componentSlug: 'faq-accordion',
          content: {
            description:
              'The four questions Joan answers on the phone most evenings, kept here so the line stays free for tables.',
            eyebrow: 'Before you come',
            items: [
              {
                answer:
                  'Ring after three, when the day’s book opens. We hold four tables a night for the phone, and the counter is first come, first sat, while it lasts.',
                question: 'How do I get a table?',
              },
              {
                answer:
                  'Always — that is what the counter is for. If the room is full, Joan will tell you honestly how long the wait looks and where to have a drink in the meantime.',
                question: 'Do you take walk-ins?',
              },
              {
                answer:
                  'Tell us when you book and the kitchen writes you into the menu rather than around it. Etta would much rather know at four than at eight.',
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
          /* The reservation card. The theme frames the boxed CTA's inner
           * panel with a double hairline rule in copper — the border of a
           * printed menu cover — because this panel is the one object the
           * whole site exists to get you to. Title stays the concept's
           * thesis, four words long. */
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
        'Tonight’s cooking in full — starters as written type, what the fire gets, what the set menus hold — and the kitchen’s honest small print.',
      label: 'Menu',
      path: 'menu',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Written at four each afternoon, once the boats and the market have said what there is. What follows is a fair picture of a night — the window on Weir Street has the real thing from five.',
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
          /* SWAPPED from content-rows. Two reasons. First, the wave-0 page
           * ran two identical content-rows blocks back to back — seven
           * near-identical photo plates in a row, which is the "second moving
           * strip" problem in another costume. Second, and more importantly,
           * photographing every starter CONTRADICTS the fiction: this menu is
           * written by hand at four and dead by ten — it is type, not a photo
           * shoot. content-stats without icons renders exactly a set menu
           * card: dish names in serif over short descriptions, three to a
           * line, with the arrow list underneath restyled as the kitchen's
           * margin notes. The Menu page becomes the most typographic page in
           * the gallery, which is the thesis of the whole concept. */
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'To start',
            features: [
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
                  'The seven o’clock bake, burnt butter, and salt Joan carries back from the far side of the estuary.',
                title: 'Bread and brown butter',
              },
              {
                description:
                  'Charred on the plancha and dressed at the last second, while you watch.',
                title: 'First-of-season leeks',
              },
              {
                description:
                  'Sliced thin off the bone, with pickled gooseberries when Ada’s garden has them.',
                title: 'Cured sea trout',
              },
              {
                description:
                  'Out of the walled garden that morning, with salt and what is left of the brown butter.',
                title: 'Radishes and butter',
              },
            ],
            paragraphs: [
              {
                text: 'Small things first, made to be argued over in the middle of the table while the fire gets on with the mains. Six or so most nights; these are the shapes they take.',
              },
            ],
            stats: [
              { label: 'small plates at the top of the menu, most nights', value: 'Six or seven' },
              { label: 'oysters at the counter, counted on the slate', value: 'By the dozen' },
              { label: 'of bread a day — when it is gone, it is gone', value: 'One bake' },
            ],
            title: 'For the middle of the table.',
          },
          id: 'to-start',
        },
        {
          /* The page's ONE image band, kept on rows because the mains earn
           * pictures the starters do not: they come off a wood fire, and the
           * fire is the kitchen's heart. On the muted band the theme lights
           * these three plates hotter and lower than anywhere else on the
           * site — ember plates, the glow sitting at the bottom edge like
           * coals. Note the garden plate is priced by conversation, not by a
           * number: "ask Joan when you book" is the concept's whole approach
           * to money. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'From the fire',
            paragraphs: [
              {
                text: 'Mains come off the wood fire at the back of the pass. Most nights there are five; these are the three shapes the middle of the menu takes.',
              },
            ],
            rows: [
              {
                description:
                  'Whole, over the coals, finished with green sauce. Sized for two people who like each other.',
                title: 'The day-boat fish',
              },
              {
                description:
                  'Ten days in the cold room, cooked dark, carved at the counter — bones to the dog you promised.',
                title: 'Rib of Dunnet Farm beef',
              },
              {
                description:
                  'Whatever Ada’s walled garden sent, cooked over the same fire with the same attention as the beef. Ask Joan what it is tonight when you book.',
                title: 'The garden plate',
              },
            ],
            title: 'Five most nights.',
          },
          id: 'from-the-fire',
          tone: 'muted',
        },
        {
          /* The set menus take the page's night band: service, after dark.
           * On the umber band the three cards read as lit menu cards, the
           * featured counter menu ringed in candlelight amber. Three plans
           * now, not two — the wave-0 pair left a third of the grid empty,
           * and Sunday lunch was already canon (from twelve) with nowhere on
           * the site that said what it was. Everything is counted in courses;
           * no currency appears anywhere on this concept. */
          componentSlug: 'pricing-cards-muted',
          content: {
            description:
              'Two ways to hand the night to the kitchen, and Sunday, which runs by its own rules. All of it is counted in courses, not choices — tell us what you cannot eat and Etta writes the rest.',
            eyebrow: 'Set menus',
            plans: [
              {
                description: 'Wednesday to Friday, the whole table in by half six',
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
              {
                description: 'From twelve, until the beef runs out',
                features: [
                  'The rib carved at the counter',
                  'Children get the same menu, smaller',
                  'The tart is not negotiable',
                ],
                link: { appearance: 'outline', label: 'Book Sunday lunch' },
                name: 'Sunday lunch',
                price: 'Three courses',
              },
            ],
            title: 'Let the kitchen drive.',
          },
          id: 'set-menus',
          tone: 'contrast',
        },
        {
          /* Back on paper for the small print — the kitchen's rules, stated
           * the way Joan states them. faq-card keeps the answers in one
           * raised panel so they read as a printed card rather than a legal
           * page. */
          componentSlug: 'faq-card',
          content: {
            description: 'The kitchen’s small print, stated plainly.',
            eyebrow: 'Kitchen notes',
            items: [
              {
                answer:
                  'Tell us when you book. Allergies are cooked around properly — separate pans, separate boards — not picked off the top at the pass.',
                question: 'Allergies and what you cannot eat',
              },
              {
                answer:
                  'Always at least one plate, written with the same attention as the fish. Say so when you book and the garden plate becomes a plan rather than a scramble.',
                question: 'Cooking without meat or fish',
              },
              {
                answer:
                  'Bring a bottle that means something to you on a Wednesday or Thursday and Joan will open it, no charge for the first. She will also tell you, kindly, if she has something better.',
                question: 'Bringing your own bottle',
              },
              {
                answer:
                  'The menu in the window at five is the menu. When a dish runs out, the line goes through it in pen, and the counter hears it first.',
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
              'One long table under three windows, twenty-two chairs, and the same kitchen working one floor down. For birthdays, wakes, weddings the size of a family, and any night that needs a door that closes.',
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
          /* content-image-frame nests a plate inside a plate, and the theme
           * uses that literally: the outer plate is the dark landing at the
           * top of the chandlery stair, the inner one the lit room seen
           * through the doorway — one long glow down the middle where the
           * table runs. It is the most cinematic image on the concept, and it
           * is built entirely from tokens. */
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'One table',
            paragraphs: [
              {
                text: 'The Long Room runs the whole length of the building: one oak table, the harbour out of three windows, and its own stair up from the street, so your night never crosses the main room.',
              },
              {
                text: 'It seats twenty-two, or holds thirty standing if what you want is glasses and things on toast. One party a night — the room is never split and never shared.',
              },
            ],
            title: 'The length of the building.',
          },
          id: 'the-long-room',
          tone: 'muted',
        },
        {
          /* Three steps, in the imperative the title sets. The step numerals
           * are restyled by the theme into copper seals with serif numerals —
           * the wax-seal register of an invitation rather than an onboarding
           * flow. "Nothing is signed before you have eaten the menu" is the
           * section's whole promise and stays in the description. */
          componentSlug: 'feature-steps',
          content: {
            description:
              'Three steps between the first email and the chairs going back against the wall. Nothing is signed before you have eaten the menu.',
            eyebrow: 'How a night runs',
            items: [
              {
                description:
                  'Tell us the date, the number, and the occasion. Joan replies within a day with what the room can do, and holds the date for a week while you decide.',
                title: 'Ask for the date',
              },
              {
                description:
                  'You come in on a quiet evening, eat the menu Etta proposes at the counter, and change whatever you like. The menu you leave with is the menu you get.',
                title: 'Taste the menu',
              },
              {
                description:
                  'The room is yours from an hour before your guests. One bill for the table at the end, arranged however you asked when you booked.',
                title: 'Take the room',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Send an enquiry' } }],
            title: 'Ask. Taste. Take the room.',
          },
          id: 'how-it-runs',
        },
        {
          /* A comparator with no prices in it — the columns compare seats,
           * doors, and menu format, which is what actually differs, and the
           * highlighted column takes a copper wash. "Numbers are seats, not
           * promises" keeps the table honest; the whole house is badged Rare
           * because it is, one or two nights a season in the fiction. */
          componentSlug: 'comparator-table',
          content: {
            description:
              'Two ways to take the room, and the whole-house option for the nights that outgrow it. The numbers are seats, not promises — the table does not stretch.',
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
          /* The page's night band is a wedding, not a numbers panel — this
           * page sells one night, so its loudest moment should be somebody
           * else's. Serif italic at spotlight size on the umber band, quote
           * mark in candle amber; the father singing at midnight is the line
           * the page is built around. */
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Odile Fairweather',
              quote:
                'We married at the harbour office at four and were at the long table by six, all nineteen of us. Etta sent up the counter menu, Joan ran the room like she had known both families for years, and at midnight they let my father sing. I would not change one minute of it.',
              role: 'The Long Room, last September',
            },
          },
          id: 'a-wedding',
          tone: 'contrast',
        },
        {
          /* The signup CTA is the enquiry: one field, one promise about reply
           * time, and the placeholder keeps the `.example` fiction. The theme
           * gives the input well the same raised-cream treatment as the
           * booking form on Find us, so "forms" feel like one object across
           * the site. */
          componentSlug: 'call-to-action-signup',
          content: {
            action: '/private-dining',
            description:
              'Tell us the date and the number, and Joan will come back within a day — usually the same afternoon, once the book opens at three.',
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
              'Tansy opened the autumn the fish market nearly closed, in a chandlery that had stood empty for years. The idea has not changed since: shop first, write second, and keep the room small enough to look after.',
            eyebrow: 'Our story',
            links: [
              { link: { appearance: 'default', label: 'Book a table' } },
              { link: { appearance: 'outline', label: 'Meet the suppliers' } },
            ],
            proofItems: [
              { label: 'Ten years on Weir Street' },
              { label: 'Same kitchen, same floor' },
              { label: 'Named after a weed' },
            ],
            title: 'A kitchen that shops before it writes.',
          },
          id: 'hero',
        },
        {
          /* Etta's voice, once, at length — the only first-person quote on
           * the site, so it carries the founding idea. The 4/3 plate beside
           * it is lit high and soft (afternoon light, not service light: the
           * menu is written at four). logoLabel is deliberately omitted: a
           * wordmark sliver under a chef's own words would be nonsense — the
           * citation stands alone, and the theme closes the quote with a
           * short copper rule instead. */
          componentSlug: 'content-quote',
          content: {
            citation: 'Etta Voss, chef and co-owner',
            eyebrow: 'The idea',
            paragraphs: [
              {
                text: 'The name is the yellow weed that grew through the front step the first winter, when the room was six tables and the fire did not always light. The step got fixed. The name stayed, to keep us honest about where we started.',
              },
            ],
            quote:
              'I do not write a menu and then go shopping for it. I go down to the harbour and the market, see what is good, and the menu is whatever that was. Some afternoons that takes ten minutes. Some afternoons it is a fight.',
            title: 'Shop first. Write second.',
          },
          id: 'the-idea',
        },
        {
          /* Six people, on the muted band. The twins hide each person's ROLE
           * behind a hover reveal and dangle a dead "Profile" link — on a
           * page about who feeds you, the role is the point, so the theme
           * pins the roles visible, deletes the dead link and the `_01`
           * portfolio ordinals, and sets the names in serif like place cards.
           * The portrait plates step down from h-96 and each one is lit from
           * a different side, six candlelit figures rather than six copies of
           * one. Roles are floor-language, not job titles: "The fire", "The
           * counter". */
          componentSlug: 'team-grid',
          content: {
            description:
              'Eight of us, most here long enough to argue properly. You will be looked after by someone on this page, not by a rota.',
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
          /* The suppliers as a written list — same no-icons decision as the
           * Menu page's starters, because a list of farms wants names, not
           * software glyphs. The arrow list underneath carries the four facts
           * that make "local" checkable instead of decorative, including the
           * slate that has never once matched the invoice. */
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The suppliers',
            features: [
              {
                description:
                  'Two day boats out of Porthmere harbour. What the sisters land by eleven decides the top half of the menu.',
                title: 'The Merrow sisters',
              },
              {
                description:
                  'Beef and lamb from the hill behind the town, hung properly and delivered on Thursdays in an estate car older than the restaurant.',
                title: 'Dunnet Farm',
              },
              {
                description:
                  'A walled garden two lanes inland that grows to the kitchen’s list — and past it, whenever Ada decides the kitchen’s list is boring.',
                title: 'Ada’s walled garden',
              },
              {
                description:
                  'Oysters and mussels from the beds across the estuary, counted in dozens on a slate that has never once matched the invoice.',
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
              { label: 'the hour the last van leaves for the kitchen', value: '11am' },
              { label: 'of the menu decided by that morning', value: 'All of it' },
            ],
            title: 'Nine names the menu answers to.',
          },
          id: 'the-suppliers',
        },
        {
          /* The story page's night band, and the theme's best joke played
           * straight: "Porthmere keeps the lights on" sits on the umber band
           * and the avatar row beneath it is repainted as a line of small lit
           * windows — the town at dusk, built from the same glow recipe as
           * the plates. Seven names, all of them people who already exist
           * elsewhere in the fiction. */
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Maren Sedgewick' },
              { name: 'Bram Hollis' },
              { name: 'Odile Fairweather' },
              { name: 'Ada Meadowcroft' },
              { name: 'Gwen Merrow' },
              { name: 'Sal Merrow' },
              { name: 'Wilf Tregona' },
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
          tone: 'contrast',
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
              'Number 4 Weir Street — the blue door beside the old chandlery crane, two minutes up from the harbour steps. Dinner from six, Wednesday to Sunday; Sunday lunch from twelve.',
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
          /* The working heart of the page, styled sturdy: raised-cream field
           * wells with a visible border weight, and the phone number — the
           * first channel — set in copper at weight, because "the book lives
           * by the phone" is literal in this fiction. Three channels, not
           * four: phone for tonight, email for notice, the door for whoever
           * is already standing at it. This page deliberately has no night
           * band — it is the practical page, and it stays daylight-legible
           * end to end. */
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Joan, from three each afternoon we cook. The fastest way to a table tonight, and the only way to the four we hold back for the phone.',
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
                  'Tonight’s menu is in the window from five. If you are standing in front of it, come in — the counter may have a stool.',
                label: 'The blue door',
                value: '4 Weir Street, Porthmere',
              },
            ],
            description:
              'Ring for tonight — the book lives by the phone, and Joan can see it and you cannot. The form is for everything with more notice than that.',
            eyebrow: 'Bookings',
            formConfigured: true,
            formDescription:
              'The date, the number of you, and anything the kitchen should know before the menu is written at four.',
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
          /* The practicalities carry the access notes in the same breath as
           * the parking — level from the street, low stools at the counter,
           * seat the party downstairs if stairs are a problem — because a
           * dining room that says this plainly on the directions page means
           * it. The bus timetable line stays: Joan knowing it better than the
           * driver is the fiction in one sentence. */
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Getting here',
            links: [{ link: { appearance: 'default', label: 'Book a table' } }],
            paragraphs: [
              {
                text: 'Weir Street is foot traffic only from five, which is half the charm and all of the parking problem. The harbour car park is two minutes down the steps and free after six; the last town bus leaves the quay at 10:40, and Joan knows the timetable better than the driver.',
              },
              {
                text: 'The room is level from the street through the blue door, and the counter keeps two low stools for anyone who wants them. The Long Room is up one flight of the old chandlery stairs — tell us if stairs are a problem and we will seat your party downstairs instead.',
              },
            ],
            title: 'Steps, buses, and the car park.',
          },
          id: 'getting-here',
          tone: 'muted',
        },
        {
          /* The site signs off with Biscuit the clock dog, on purpose — the
           * last thing a reader meets should sound like the room. One-sitting
           * policy is stated here in full and matches the ledger on Home
           * (wave-0 had them contradicting each other). */
          componentSlug: 'faq-split',
          content: {
            description: 'The practical questions, answered the way Joan answers them.',
            eyebrow: 'Small print',
            items: [
              {
                answer:
                  'Well-behaved dogs are welcome at the counter and the two window tables. Biscuit, the clock dog, was here first and will make that clear.',
                question: 'Can I bring the dog?',
              },
              {
                answer:
                  'Children are welcome and get the same menu smaller, not a different menu worse. High chairs live behind the counter — ask when you book.',
                question: 'What about children?',
              },
              {
                answer:
                  'Life happens. Ring by three and the table goes back in the book, no quibble. Long Room dates ask for a week, because the room turns away a whole night for you.',
                question: 'What if we have to cancel?',
              },
              {
                answer:
                  'The evening — we run one sitting in the room, so nobody is hovering for your table. The counter turns at its own pace, which is why it cannot be booked.',
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
    'A fictional 38-seat harbour-town dining room where the menu is written at four each afternoon — the hospitality register: candlelit, unhurried, food-first, built around a menu and a phone number.',
  theme: {
    description:
      'Candlelit warm cream and deep umber ink with one burnt-copper accent — the low light lives in the token-painted plates and one night band per page, the type is a generous menu serif, and the rhythm is a room that runs one sitting a night.',
    id: 'restaurant-bistro',
    swatches: ['#f9f3e6', '#2c1d12', '#913c08'],
  },
  title: 'Restaurant Bistro',
  visualTone: ['Candlelit', 'Seasonal', 'Unhurried'],
}
