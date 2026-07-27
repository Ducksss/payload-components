import type { TemplateShowcase } from './types'

/* Commerce — "Fieldnote", a fictional specialty-coffee roastery.
 *
 * Art direction: warm, tactile, unhurried, quietly premium. One promise runs
 * through all five pages — Fieldnote holds green coffee, roasts twelve kilos on
 * Tuesday, grinds to your brewer, and prints the roast date on the front of the
 * bag:
 *
 *   Home        the shopfront — the roast-day promise, the shelf, the craft,
 *               the proof, and the standing orders
 *   Collection  the four coffees in full, the grind options, one origin story
 *   Our Story   the mill, the inventory rule, a grower in her own words, the
 *               sourcing record, the bench, the open cupping table
 *   Journal     brewing and origin notes, four recipes, one long read
 *   Contact     three named desks at the reserved fieldnote.example domain
 *
 * Canonical facts, kept consistent across every page: founded 2016, the old
 * ribbon mill at 14 Kestrel Street, twelve-kilo batches on a drum roaster
 * rebuilt in 2019, roast day Tuesday, post out Wednesday, public cupping
 * Wednesdays at eight, thirty-four farms across nine growing regions.
 *
 * Everything is fictional: the roastery, its coffees, the farms and growers,
 * the wholesale café quoted on the espresso band, and every
 * number. There are no prices anywhere — subscriptions are expressed as a
 * rhythm and a weight, which is also how a roaster actually talks. All copy
 * stays editor-shaped (demo-content types); layout belongs to the twins and to
 * the Fieldnote shell and theme. */

export const commerceBrandTemplate: TemplateShowcase = {
  assets: [],
  category: 'commerce',
  description:
    'Fieldnote is a fictional specialty-coffee roastery: a warm, tactile, product-forward DTC marketing site concept spanning Home, Collection, Our Story, Journal, and Contact — cream paper and deep espresso ink with one burnt-orange ember accent, token-derived product plates, soft rounded geometry, and a roast-to-order promise carried through every page, composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Collection', path: 'collection' },
    { label: 'Our Story', path: 'story' },
    { label: 'Journal', path: 'journal' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'Opens on the kinetic shopfront — the roast-day headline, the film-still plate, and a running shop index — then works down through the shelf, the craft, the proof on an espresso band, and the standing orders.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The shopfront. The headline splits 19/19 characters, so the word
           * cascade lands its closing "Thursday." in the serif accent — the
           * whole brand promise in six words. The plate's film still and the
           * marquee's diamonds are mixed from --brand, which this theme tunes
           * to the burnt-orange ember, so the "still" reads as a roast-drum
           * dusk rather than a product shot. CTAs map to real routes:
           * Browse the coffees → collection, Read our story → story. */
          componentSlug: 'hero-kinetic',
          content: {
            description:
              'A small roastery in the old ribbon mill on Kestrel Street. Nine origins, twelve kilos at a time, and the roast date printed on the front of the bag — the most useful thing on it.',
            eyebrow: 'Fieldnote Roastery',
            imageCaption: 'Bench No. 2 — twelve kilos, drum door open, Tuesday morning.',
            links: [
              { link: { appearance: 'default', label: 'Browse the coffees' } },
              { link: { appearance: 'outline', label: 'Read our story' } },
            ],
            marqueeItems: [
              { label: 'Huila' },
              { label: 'Guji' },
              { label: 'Nueva Segovia' },
              { label: 'Filter roast' },
              { label: 'Espresso roast' },
              { label: 'Pour-over' },
              { label: 'Moka' },
              { label: 'Plunger' },
              { label: 'Cold brew' },
            ],
            proofItems: [
              { label: 'Roasted to order' },
              { label: 'Nine origins' },
              { label: 'Ground for your brewer' },
            ],
            title: 'Roasted on Tuesday. Brewed by Thursday.',
          },
          id: 'shopfront',
        },
        {
          componentSlug: 'logo-cloud-marquee',
          content: { heading: 'Poured weekly at' },
          id: 'stockists',
          tone: 'muted',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'The shelf',
            /* No feature icons: the twin's allowlist is a platform set (cpu,
             * lock, shield) and a coffee shelf reads better as four plain
             * tasting notes under one large plate. */
            features: [
              {
                description:
                  'House filter. Cocoa nib, dried fig, demerara. The one we drink at the bench all day.',
                title: 'Kestrel',
              },
              {
                description: 'Huila, washed, 1,850 m. Mandarin, cane sugar, toasted almond.',
                title: 'Long Field',
              },
              {
                description: 'Guji, natural, 2,050 m. Apricot, jasmine, peach skin.',
                title: 'Nine Bells',
              },
              {
                description:
                  'For espresso. Dark chocolate, black plum, walnut. Forgiving at any dose.',
                title: 'Ironwood',
              },
            ],
            paragraphs: [
              {
                text: 'Two coffees we roast every week without fail, two that rotate with the harvest. Each one arrives with the farm, the elevation, the process, and the day it left the drum.',
              },
            ],
            title: 'Four coffees we keep, and whatever the season sends.',
          },
          id: 'range',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'Green coffee keeps for months; roasted coffee does not. So we hold the greens, roast on Tuesday, and post the same week — never from a shelf.',
            eyebrow: 'How we work',
            items: [
              {
                description:
                  'Small batches on a drum roaster we rebuilt in 2019, profiled by ear and by probe, one origin at a time.',
                title: 'Twelve kilos at a time',
              },
              {
                description:
                  'Tell us what you brew on and we grind to match it that morning — or leave it whole and we send the setting we would use.',
                title: 'Ground for your brewer',
              },
              {
                description:
                  'Every bag carries the day it left the drum. If it is more than three weeks old when it reaches you, we got something wrong.',
                title: 'A date, not a best-before',
              },
              {
                description:
                  'We go back to thirty-four farms year on year, and pay above the going rate for the lots we keep asking for.',
                title: 'The same farms, again',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Read our story' } }],
            title: 'Nothing is roasted before you order it.',
          },
          id: 'craft',
          tone: 'muted',
        },
        {
          /* The one espresso band per page. The stockist's wordmark comes from
           * this concept's own fiction via logoLabel; the theme sets it in the
           * soft ember at café-lockup tracking. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Marguerite Oyelaran',
            body: 'Wholesale runs the same way: one roast day, one delivery, and no coffee sitting in a warehouse between us and you.',
            description: 'Ten years at the same bench, counted honestly.',
            eyebrow: 'On the record',
            logoLabel: 'NORTHWIND COFFEE BAR',
            metrics: [
              { label: 'kilos per batch, never more', value: '12' },
              { label: 'farms we buy from, year on year', value: '34' },
              { label: 'hours from drum to post', value: '48' },
              { label: 'years at the same bench', value: '10' },
            ],
            quote:
              'They roast on Tuesday and it is on our grinder by Thursday. Ten years, and I have never once had to call about a stale bag.',
            role: 'Owner, Northwind Coffee Bar',
            title: 'The numbers we would want to read.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Notes that come back through the post — the reason the roast date is on the front of the bag and not hidden underneath.',
            eyebrow: 'From the post',
            items: [
              {
                author: 'Dervla Nunes',
                quote:
                  'Ordered on a Monday, drank it on a Friday, and could taste the difference against the supermarket bag I had been finishing. That is the whole review.',
                role: 'Subscriber, two years',
              },
              {
                author: 'Aurelio Banda',
                quote:
                  'I said I brew on a moka pot and they set the grind for it without being asked twice. Nobody does that.',
                role: 'Moka, every morning',
              },
              {
                author: 'Priya Ravensworth',
                quote:
                  'Nine Bells tasted like apricot jam and I did not believe the bag until the second cup. Gone in ten days.',
                role: 'Pour-over at the weekend',
              },
              {
                author: 'Kit Marlowe',
                quote:
                  'We put Ironwood on the bar and stopped rewriting the recipe every week. It is sweet at eighteen grams and still sweet when the new starter overdoses it.',
                role: 'Café owner',
              },
              {
                author: 'Halldór Ness',
                quote:
                  'Wrote to say a bag arrived flat. Got a reply the same afternoon, a different coffee two days later, and a genuinely interesting explanation of why.',
                role: 'Subscriber, six months',
              },
              {
                author: 'Sunniva Oyelowo',
                quote:
                  'Went to a Wednesday cupping expecting to be out of my depth. Everyone just wanted to know what I tasted. I have not missed one since.',
                role: 'Wednesday regular',
              },
            ],
            title: 'What people write back.',
          },
          id: 'notes',
        },
        {
          /* Subscription without prices: the cadence is the headline fact and
           * the weight is the qualifier, which is how a roaster actually sells
           * a standing order. CTAs route to Collection and Contact. */
          componentSlug: 'pricing-cards',
          content: {
            description:
              'Choose how often the post arrives and which shelf it comes from. Pause it, skip it, or change the grind whenever you like — the roast day never moves.',
            eyebrow: 'Standing orders',
            plans: [
              {
                description: 'One bag, ground to your brewer',
                features: [
                  'One bag of the house filter',
                  'Ground to your brewer, or whole',
                  'Roast date on every bag',
                  'Skip or pause any week',
                ],
                link: { appearance: 'outline', label: 'See the coffees' },
                name: 'The Weekender',
                period: '· 250 g',
                price: 'Weekly',
              },
              {
                description: 'One house coffee, one rotating lot',
                featured: true,
                features: [
                  'House filter plus a seasonal lot',
                  'First call on the small harvests',
                  'A brew card with each new coffee',
                  'Skip, pause, or swap any time',
                ],
                link: { appearance: 'default', label: 'See the coffees' },
                name: 'The Standard',
                period: '· 2 × 250 g',
                price: 'Fortnightly',
              },
              {
                description: 'A kilo of one lot, whole bean',
                features: [
                  'One kilo of a single lot',
                  'Whole bean, sealed the same day',
                  'Cupping notes from the bench',
                  'Wholesale grind on request',
                ],
                link: { appearance: 'outline', label: 'Ask about the cellar' },
                name: 'The Cellar',
                period: '· 1 kg',
                price: 'Monthly',
              },
            ],
            title: 'Pick a rhythm, not a plan.',
          },
          id: 'subscription',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Pick a coffee, tell us what you brew on, and it goes into Tuesday’s roast. If it is not for you, write to the bench and we will send something that is.',
            links: [
              { link: { appearance: 'default', label: 'Browse the coffees' } },
              { link: { appearance: 'outline', label: 'Write to the bench' } },
            ],
            title: 'Start with one bag.',
          },
          id: 'cta',
        },
      ],
      title: 'Fieldnote — Coffee roasted to order',
    },
    {
      description:
        'Presents the four coffees as an illustrated shelf, explains what the grind options actually mean, tells one origin story in full, and answers the questions people ask before ordering.',
      label: 'Collection',
      path: 'collection',
      sections: [
        {
          /* The only inner page that opens on a plate. Collection is the page
           * that sells the coffee, and hero-basic left it arguing in words for
           * four sections before the first bag appeared — so the header
           * becomes a roast-day still, lit the way the product plates are, with
           * the shelf promise set over it. The other three inner pages stay on
           * hero-basic: Our Story and Journal both put a plate in their second
           * section already, and Contact should just open the door. */
          componentSlug: 'hero-video',
          content: {
            description:
              'Two constants and two rotating lots. Every bag is roasted on Tuesday, ground for your brewer, and dated on the front.',
            eyebrow: 'The Collection',
            links: [
              { link: { appearance: 'default', label: 'Read the brewing notes' } },
              { link: { appearance: 'outline', label: 'Ask about wholesale' } },
            ],
            proofItems: [
              { label: 'Roasted Tuesdays' },
              { label: 'Ground to order' },
              { label: 'Nine origins' },
            ],
            title: 'Four coffees, and whatever the harvest sends next.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'On the shelf',
            paragraphs: [
              {
                text: 'Kestrel and Ironwood are here every week. Long Field and Nine Bells change with the harvest — when a lot runs out it is genuinely gone until next season.',
              },
            ],
            rows: [
              {
                description:
                  'Cocoa nib, dried fig, demerara. A washed Colombian base with a little natural Ethiopian for lift. Forgiving in any brewer, and the one we drink at the bench all day.',
                title: 'Kestrel — house filter',
              },
              {
                description:
                  'Mandarin, cane sugar, toasted almond. Finca La Golondrina at 1,850 m, picked and pulped by Yeimy Restrepo and her brother. Roasted light, for filter.',
                title: 'Long Field — Huila, washed',
              },
              {
                description:
                  'Apricot, jasmine, peach skin. Dried on raised beds at 2,050 m and hand-sorted three times before it left the station. Nine days on the bed, hence the name.',
                title: 'Nine Bells — Guji, natural',
              },
              {
                description:
                  'Dark chocolate, black plum, walnut. Roasted longer and rested four days before it ships. Sweet at eighteen grams, still sweet at twenty-two.',
                title: 'Ironwood — for espresso',
              },
            ],
            title: 'What is on the shelf this month.',
          },
          id: 'products',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'A burr grinder is the cheapest upgrade in coffee. If you have not got one yet, tell us the brewer and we will match it for you.',
            eyebrow: 'Grind',
            items: [
              {
                description:
                  'Sealed within the hour, with the setting we would use written on the card. The best of the four if you own a grinder.',
                title: 'Whole bean',
              },
              {
                description:
                  'Medium, for pour-over, batch brew, and anything with a paper filter. Ground the morning the post goes out.',
                title: 'Filter',
              },
              {
                description:
                  'Fine, dialled against our own bench shot. Expect to move a notch on your machine, and write to us if it fights you.',
                title: 'Espresso',
              },
              {
                description:
                  'Coarse for a plunger, fine-but-not-espresso for a moka pot. Say which one and we will set it.',
                title: 'Moka and plunger',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Read the brewing notes' } }],
            title: 'We grind it the morning it leaves.',
          },
          id: 'grinds',
          tone: 'muted',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'Origin',
            links: [{ link: { appearance: 'outline', label: 'Read the field notes' } }],
            paragraphs: [
              {
                text: 'Finca La Golondrina sits at 1,850 m above the Huila valley, steep enough that everything comes down by mule. Yeimy Restrepo picks it in three passes, ferments in tile tanks overnight, and dries it on the patio she rebuilt in 2021.',
              },
              {
                text: 'We have bought the same lot for six harvests. Nothing about it is guaranteed — a wet October can take half of it — which is exactly why the year is on the bag.',
              },
            ],
            title: 'Long Field is one hillside, one family, one pass through the trees.',
          },
          id: 'origin',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description:
              'The five things people write to ask, answered here so you do not have to.',
            eyebrow: 'Good to know',
            items: [
              {
                answer:
                  'We roast on Tuesday and post the same week, so most bags reach you three to five days off the drum. Filter coffee is at its best from day four to day twenty-one; espresso wants a full week to settle.',
                question: 'How fresh will it actually be?',
              },
              {
                answer:
                  'Whole bean if you have a grinder — it keeps roughly twice as long. Otherwise tell us the brewer and we grind it the morning it leaves.',
                question: 'Whole bean or ground?',
              },
              {
                answer:
                  'Sealed bag, dark cupboard, away from the hob. Not the fridge, and not the freezer unless it is a kilo you cannot get through inside a month.',
                question: 'How should I store it?',
              },
              {
                answer:
                  'Write to the bench and tell us what you brewed and how. We will send a different coffee, and we will not ask for the first one back.',
                question: 'What if I do not like it?',
              },
              {
                answer:
                  'Yes — one roast day, one delivery, with route sheets and brew training included. The wholesale desk answers inside a day.',
                question: 'Do you supply cafés?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Ask us anything' } }],
            title: 'Before you order.',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Tell us what you brew on and what you drank last. We will pick the bag we would put in our own post.',
            links: [
              { link: { appearance: 'default', label: 'Write to the bench' } },
              { link: { appearance: 'outline', label: 'Read the brewing notes' } },
            ],
            title: 'Not sure which one?',
          },
          id: 'cta',
        },
      ],
      title: 'Fieldnote — The Collection',
    },
    {
      description:
        'Grounds the roastery: the mill, the rule about inventory, a grower in her own words on the espresso band, the sourcing record, the three people at the drum, and the open cupping table.',
      label: 'Our Story',
      path: 'story',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Fieldnote started in 2016 with twelve kilos a week and a market stall. The van is long gone. The bench, the roast day, and the habit of writing everything down are not.',
            eyebrow: 'Our story',
            links: [
              { link: { appearance: 'default', label: 'Browse the coffees' } },
              { link: { appearance: 'outline', label: 'Visit the roastery' } },
            ],
            proofItems: [
              { label: 'Est. 2016' },
              { label: 'Kestrel Street' },
              { label: 'Thirty-four farms' },
            ],
            title: 'One rebuilt drum roaster and a borrowed van.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'The mill',
            links: [{ link: { appearance: 'outline', label: 'Read the journal' } }],
            paragraphs: [
              {
                text: 'The old mill on Kestrel Street still has the ribbon spools up in the rafters. We took the ground floor in 2018 for the ceiling height and the loading door, and we have not moved a wall since.',
              },
              {
                text: 'The rule that shapes everything else: green coffee keeps for months, roasted coffee does not. So we hold the greens, roast to the week’s orders, and keep nothing roasted on a shelf.',
              },
            ],
            title: 'A ribbon mill, a drum roaster, and one rule about inventory.',
          },
          id: 'mission',
        },
        {
          /* No logoLabel: a grower is a person and a farm, not a brand with a
           * wordmark — the citation already names both. */
          componentSlug: 'content-quote',
          content: {
            citation: 'Yeimy Restrepo — Finca La Golondrina, Huila',
            eyebrow: 'From origin',
            paragraphs: [
              {
                text: 'We buy from thirty-four farms and go back to the same ones. Six harvests in Huila, five in Guji, four in Nueva Segovia — long enough that the conversation is about the coffee rather than the price.',
              },
            ],
            quote:
              'The first year, they asked what I wanted for it. Nobody had asked me that before. Now they ask what the rain did.',
            title: 'We would rather be a small buyer for a long time.',
          },
          id: 'quote',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Sourcing',
            features: [
              {
                description:
                  'A named farm or washing station, and the person who made the calls at harvest.',
                title: 'Who grew it',
              },
              {
                description:
                  'Washed, natural, or honey; the ferment, the drying bed, and how long it sat there.',
                title: 'How it was made',
              },
              {
                description:
                  'The day it left the drum, printed on the front of the bag rather than hidden underneath.',
                title: 'When it was roasted',
              },
            ],
            paragraphs: [
              {
                text: 'Not a story — a record. If we cannot tell you the farm, the elevation, the process, and the year, we do not buy the lot.',
              },
            ],
            stats: [
              { label: 'farms and stations, most of them repeat', value: '34' },
              { label: 'growing regions across three continents', value: '9' },
              { label: 'average elevation of what we buy', value: '1,750 m' },
              { label: 'harvests running with our longest partner', value: '6' },
            ],
            title: 'What we know about every bag we sell.',
          },
          id: 'sourcing',
          tone: 'muted',
        },
        {
          componentSlug: 'team-grid',
          content: {
            description:
              'Three people, one bench, and a cupping table that settles most arguments before lunch.',
            eyebrow: 'The bench',
            members: [
              { name: 'Ines Okonjo', role: 'Head roaster' },
              { name: 'Tobias Kern', role: 'Green buyer' },
              { name: 'Marisol Ferrand', role: 'Cupping and quality' },
            ],
            title: 'Who is at the drum.',
          },
          id: 'roasters',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Ines Okonjo' },
              { name: 'Tobias Kern' },
              { name: 'Marisol Ferrand' },
              { name: 'Sunniva Oyelowo' },
              { name: 'Aurelio Banda' },
              { name: 'Dervla Nunes' },
              { name: 'Kit Marlowe' },
              { name: 'Halldór Ness' },
            ],
            eyebrow: 'Wednesdays',
            paragraphs: [
              {
                text: 'Every Wednesday at eight we cup whatever landed that week — new lots, samples we are unsure about, and the occasional disaster. No booking, no charge, and no need to know anything. Come and say what you taste.',
              },
            ],
            title: 'The table is open, and there is always a spare cup.',
          },
          id: 'community',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Wednesday, eight o’clock, the old mill on Kestrel Street. Or start with a bag and we will send the notes along with it.',
            links: [
              { link: { appearance: 'default', label: 'Find the roastery' } },
              { link: { appearance: 'outline', label: 'Browse the coffees' } },
            ],
            title: 'Come and taste before you buy.',
          },
          id: 'cta',
        },
      ],
      title: 'Fieldnote — Our Story',
    },
    {
      description:
        'A brewing-and-origin journal that keeps the roastery in the conversation: the recent posts, four recipes we would use at home, and one long read from the bench.',
      label: 'Journal',
      path: 'journal',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Roast logs, origin trips, and the small corrections that make a cup better. Written on Wednesdays, when the roaster is cold and the kettle is on.',
            eyebrow: 'Journal',
            links: [
              { link: { appearance: 'default', label: 'Browse the coffees' } },
              { link: { appearance: 'outline', label: 'Ask us anything' } },
            ],
            proofItems: [{ label: 'One post a week' }, { label: 'Nothing sponsored' }],
            title: 'Notes from the bench, mostly about water.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Recent',
            paragraphs: [
              {
                text: 'One post a week, usually short. If a coffee changes how we brew, it ends up here first.',
              },
            ],
            rows: [
              {
                description:
                  'Ninety-eight percent of what you drink came out of a tap. We brewed the same Long Field on four different waters, and the gap between the best and the worst was wider than a twenty-second grind change.',
                title: 'Water is most of your cup',
              },
              {
                description:
                  'Three farms, two washing stations, and one very patient mule carrying eleven kilos of samples down a hillside no van will take. Notes, photographs, and what we bought.',
                title: 'A week in Huila, and the mule',
              },
              {
                description:
                  'Not by colour, and not really by time. What the drum sounds like in the last ninety seconds, what the tray smells like when it drops, and the three roasts we ruined learning the difference.',
                title: 'How we decide a roast is finished',
              },
            ],
            title: 'The last few things we wrote down.',
          },
          id: 'articles',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'Brew guides',
            features: [
              {
                description:
                  'Thirty grams to four-eighty, four pours, three minutes. Medium grind, ninety-four degrees.',
                title: 'Pour-over, 1:16',
              },
              {
                description:
                  'Coarse, stir at thirty seconds, skim the crust, plunge slowly. Far better than its reputation.',
                title: 'Plunger, four minutes',
              },
              {
                description:
                  'Fine but not espresso, warm water in the base, lowest flame. Take it off the heat the moment it gurgles.',
                title: 'Moka, low and slow',
              },
              {
                description:
                  'Coarse, one to eight, cupboard temperature overnight. Dilute to taste — Ironwood does this best.',
                title: 'Cold brew, sixteen hours',
              },
            ],
            paragraphs: [
              {
                text: 'Start here, then change one thing at a time. Every bag ships with the setting we used, so you are never guessing from zero.',
              },
            ],
            title: 'Four recipes we would actually use at home.',
          },
          id: 'guides',
          tone: 'muted',
        },
        {
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'Long read',
            paragraphs: [
              {
                text: 'A roast is twelve minutes long and decided in the last ninety seconds. This is what we listen for, why we stopped trusting colour, and the three batches we lost learning to tell the difference.',
              },
            ],
            title: 'Ten years at one bench, and the ninety seconds that matter.',
          },
          id: 'feature',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'The cupping table is open at eight, and we answer every note that comes back through the post.',
            links: [
              { link: { appearance: 'default', label: 'Find the roastery' } },
              { link: { appearance: 'outline', label: 'Browse the coffees' } },
            ],
            title: 'Brew it with us on Wednesday.',
          },
          id: 'cta',
          tone: 'muted',
        },
      ],
      title: 'Fieldnote — Journal',
    },
    {
      description:
        'Routes retail, wholesale, and visitor questions to three named desks at the reserved fieldnote.example domain, then answers the practical ones — without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'One inbox for orders, one for cafés, and a cupping table on Wednesdays. Whoever is nearest the kettle answers.',
            eyebrow: 'Contact',
            links: [
              { link: { appearance: 'default', label: 'Browse the coffees' } },
              { link: { appearance: 'outline', label: 'Read our story' } },
            ],
            proofItems: [
              { label: 'Answered within a day' },
              { label: 'Cupping Wednesdays' },
            ],
            title: 'Come by the mill, or write to the bench.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Grind questions, standing orders, and the occasional apology. Answered between roasts, usually inside a day.',
                label: 'Orders and everything else',
                value: 'hello@fieldnote.example',
              },
              {
                description:
                  'Weekly standing orders, route sheets, brew training, and a bench visit before you commit to anything.',
                label: 'Cafés and wholesale',
                value: 'wholesale@fieldnote.example',
              },
              {
                description:
                  'Counter open Tuesday to Saturday, eight till four. Public cupping every Wednesday at eight.',
                label: 'Visit the roastery',
                value: '14 Kestrel Street, the old ribbon mill',
              },
            ],
            description:
              'Nothing here goes to a call centre. Pick the closest desk and you will get whoever knows the answer.',
            eyebrow: 'Say hello',
            formConfigured: true,
            formDescription:
              'Tell us what you brew on and we will point you at the right shelf.',
            formLabels: [
              'Name',
              'Email',
              'Where you are',
              'What you brew on',
              'What can we help with?',
            ],
            formTitle: 'Write to the bench',
            submitLabel: 'Send it over',
            title: 'Three desks, and a kettle that is always on.',
          },
          id: 'contact',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description:
              'The questions the desks answer most. If yours is not here, write anyway — someone will know.',
            eyebrow: 'Practical',
            items: [
              {
                answer:
                  'Yes. The counter is open Tuesday to Saturday, eight till four, and the cupping table is open to anyone on Wednesday mornings at eight.',
                question: 'Can I just turn up?',
              },
              {
                answer:
                  'One roast day, one delivery, a route sheet, and brew training for your team. Most cafés start with two coffees and a weekly standing order.',
                question: 'How does wholesale work?',
              },
              {
                answer:
                  'Roasting is Tuesday, packing is Tuesday evening, and everything is in the post by Wednesday morning.',
                question: 'When does the post go out?',
              },
              {
                answer:
                  'To a handful of places, and only whole bean — the grind does not survive the extra days in transit.',
                question: 'Do you ship overseas?',
              },
              {
                answer:
                  'Please do. Bring it to the counter and we will fill it from the same batch, minus the bag.',
                question: 'Can I bring my own tin?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Write to the bench' } }],
            title: 'Visiting, wholesale, and the post.',
          },
          id: 'faq',
        },
      ],
      title: 'Fieldnote — Contact',
    },
  ],
  revision: 4,
  schemaVersion: 1,
  slug: 'commerce-brand',
  status: 'concept',
  summary: 'A warm, product-forward DTC marketing site for a fictional specialty-coffee roastery.',
  theme: {
    description:
      'Warm cream paper and deep espresso ink with a single burnt-orange ember accent, soft rounded geometry, token-derived product plates, and a relaxed editorial rhythm.',
    id: 'commerce-brand',
    swatches: ['#fcf2e7', '#2f1d15', '#a84100'],
  },
  title: 'Commerce Brand',
  visualTone: ['Warm', 'Tactile', 'Product-forward'],
}
