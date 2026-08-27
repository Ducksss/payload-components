import type { TemplateShowcase } from './types'

/* Marketplace — "Trestle", a fictional wholesale marketplace connecting
 * independent makers with independent shops.
 *
 * WAVE 0 SKELETON — the recipe (pages, sections, tones) is frozen; the copy
 * below is a coherent first draft the art-direction wave replaces. Do not ship
 * this file without that pass.
 *
 * Register this concept must own (uncovered by the other fourteen): the
 * TWO-SIDED pitch. A marketplace site serves two audiences with different
 * economics through one nav — shops being courted with terms, makers being
 * courted with reach — and the trust page in the middle has to convince both
 * at once. No other concept splits its reader in half on the home page.
 *
 * Canonical facts, kept consistent across every page: founded by Ro Beckett
 * (who kept a homeware shop, Gather, for twelve years) and Sam Odedra (who
 * built the order ledger); 388 makers, 1,145 shops; shops get sixty days to
 * pay, always; makers set their own wholesale price and are paid on dispatch,
 * not when the shop pays; one flat commission, shown before you list and
 * unchanged since the first year; first orders are returnable within sixty
 * days with freight paid both ways; minimums start at twelve pieces; the
 * office is in the fictional city of Ellsworth; Dolly Okonkwo answers support
 * and is a person, not a queue.
 *
 * Everything is fictional: the marketplace, the founders, the makers, the
 * shops, the city, the trade paper (The Shopkeeper's Almanac), and every
 * figure. No payments regulator, insurer, or trade body is named or invented.
 * Email uses the reserved `.example` domain; the one phone number sits inside
 * the 01632 96xxxx fiction range.
 *
 * There are NO currency amounts anywhere. A wholesale marketplace talks terms,
 * not prices: "sixty days to pay", "one flat commission", "your wholesale
 * price is yours", minimums counted in pieces. All copy stays editor-shaped
 * (demo-content types); layout belongs to the twins and the Trestle shell and
 * theme. */

export const marketplaceWholesaleTemplate: TemplateShowcase = {
  assets: [],
  category: 'marketplace',
  description:
    'Trestle is a fictional wholesale marketplace between people who make things and people who keep shops: 388 makers, 1,145 shops, sixty days to pay on every order, and one flat commission that has never changed. The concept owns the two-sided register — the home page splits its reader in half, the buyers and suppliers pages mirror each other, and the trust page must convince both sides at once — across five pages: Home, For shops, For makers, How it works, and Contact. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'For shops', path: 'buyers' },
    { label: 'For makers', path: 'suppliers' },
    { label: 'How it works', path: 'how-it-works' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'Splits the reader in half on arrival — the shopkeeper’s pitch and the maker’s pitch side by side, with the ledger of terms both sides share.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Trestle is the wholesale market between independent makers and independent shops: 388 studios, 1,145 shelves, one order ledger, and terms that treat both sides like adults. Say which one you are and we will take you to your half.',
            eyebrow: 'Trestle · The wholesale market',
            links: [
              { link: { appearance: 'default', label: 'I keep a shop' } },
              { link: { appearance: 'outline', label: 'I make things' } },
            ],
            proofItems: [
              { label: 'Sixty days to pay, always' },
              { label: 'Makers paid on dispatch' },
              { label: 'One flat commission' },
            ],
            title: 'Wholesale between people, not catalogues.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'logo-cloud-inline-wrap',
          content: { heading: 'Stocked this season from' },
          id: 'makers-strip',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-split',
          content: {
            description:
              'The pitch to the shopkeeper, in the order a shopkeeper asks: what will sell, what it costs to find out, and what happens if it does not.',
            eyebrow: 'For shops',
            items: [
              {
                description:
                  'Work you cannot get from the big catalogues, from studios that cap their stockists — so the shop two streets over is not selling the same shelf.',
                title: 'Stock nobody else has',
              },
              {
                description:
                  'Sixty days to pay on every order, not just your first. Sell it before you owe for it.',
                title: 'Terms that respect your cashflow',
              },
              {
                description:
                  'A first order that does not sell goes back within sixty days, freight on us both ways. Trying a new maker costs you shelf space, not money.',
                title: 'Returns on first orders',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'How buying works' } }],
            title: 'Stock your shop like you mean it.',
          },
          id: 'for-shops',
        },
        {
          componentSlug: 'feature-split',
          content: {
            description:
              'The pitch to the maker, in the order a maker asks: who sets the price, when the money arrives, and who does the chasing.',
            eyebrow: 'For makers',
            items: [
              {
                description:
                  'Your wholesale price is yours. We add one flat commission on top, shown before you list, unchanged since the first year.',
                title: 'You set the price',
              },
              {
                description:
                  'We pay you when the order ships, not when the shop settles. The sixty-day terms are our risk, not yours.',
                title: 'Paid on dispatch',
              },
              {
                description:
                  'Freight booked from your door, invoices chased by us, and a stockist list you can see and cap — your work goes where you say it goes.',
                title: 'The boring parts, done',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'How selling works' } }],
            title: 'Your work in a thousand shops. Your name on it.',
          },
          id: 'for-makers',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Marnie Okafor',
            body: 'The ledger is the whole company: every order, both sides’ terms, and who owes what to whom, kept plainly enough that nobody has to trust us on faith. These are last year’s numbers.',
            description:
              'A marketplace is only as honest as its ledger. Here is ours, counted the boring way.',
            eyebrow: 'The ledger',
            logoLabel: 'THE SHOPKEEPER’S ALMANAC',
            metrics: [
              { label: 'independent makers listing', value: '388' },
              { label: 'shops ordering on terms', value: '1,145' },
              { label: 'of first orders lead to a reorder', value: '7 in 10' },
              { label: 'days to pay, on every order', value: '60' },
            ],
            quote:
              'Trestle is the first wholesale platform we have covered that both sides recommend to us unprompted. The shops talk about the terms; the makers talk about being paid on dispatch. Nobody talks about the software, which is the highest compliment there is.',
            role: 'Trade notes, The Shopkeeper’s Almanac',
            title: 'Both sides of the ledger.',
          },
          id: 'the-ledger',
          tone: 'contrast',
        },
        {
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'Ines Fabbri',
              quote:
                'I threw pots for nine years and spent a third of every week invoicing, chasing, and boxing. Trestle took the third back. My work is in eighty shops I chose, the money arrives when the van does, and I have not written a chasing email in two years.',
              role: 'Fabbri Studio — stoneware, 80 stockists',
            },
          },
          id: 'both-sides',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description: 'The four questions Dolly answers most, from both sides of the counter.',
            eyebrow: 'Asked first',
            items: [
              {
                answer:
                  'On a first order from a new maker, nothing beyond the shelf space — sixty days to pay, and returns with freight on us if it does not sell. After that, orders are firm, which keeps the makers’ side honest too.',
                question: 'What does trying a new maker cost a shop?',
              },
              {
                answer:
                  'One flat commission on the wholesale price, shown before you list. There is no listing fee, no monthly fee, and no charge for photography you did yourself.',
                question: 'What does Trestle take?',
              },
              {
                answer:
                  'When your order ships. The shop’s sixty days run against us, not against you — that gap is the service, and the commission is what pays for it.',
                question: 'When does a maker get paid?',
              },
              {
                answer:
                  'Minimums start at twelve pieces and every maker sets their own. The listing states it plainly before you build a cart, not at the end.',
                question: 'What are the minimums?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'How it works' } }],
            title: 'From both sides of the counter',
          },
          id: 'asked-first',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Shops open an account in an afternoon. Makers show us their work and hear back within the week — from a person who has stood behind a counter.',
            links: [
              { link: { appearance: 'default', label: 'Open a shop account' } },
              { link: { appearance: 'outline', label: 'Apply to sell' } },
            ],
            title: 'Pick your side of the trestle.',
          },
          id: 'join',
        },
      ],
      title: 'Trestle — Wholesale between makers and shops',
    },
    {
      description:
        'The shopkeeper’s half: what stocking through Trestle looks like from the first browse to the first reorder, and the terms in full.',
      label: 'For shops',
      path: 'buyers',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'A shop lives or dies on what is on the shelf and when the invoice lands. Trestle exists to make both easier: work nobody else stocks, and sixty days to sell it before you pay for it.',
            eyebrow: 'For shops',
            links: [
              { link: { appearance: 'default', label: 'Open a shop account' } },
              { link: { appearance: 'outline', label: 'See how it works' } },
            ],
            proofItems: [
              { label: 'Sixty days to pay' },
              { label: 'Returns on first orders' },
              { label: 'Minimums from twelve pieces' },
            ],
            title: 'Stock your shop from studios, not catalogues.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'From first browse to first reorder, the whole thing. The only paperwork is the account application, once.',
            eyebrow: 'A first order',
            items: [
              {
                description:
                  'Browse by shelf, not by keyword — tableware, textiles, pantry, print. Every listing states the maker’s minimum and lead time before you build a cart.',
                title: 'Find the work',
              },
              {
                description:
                  'One cart across any number of makers, one invoice at the end of it, sixty days to settle. Freight is booked by us and lands on the invoice as its own plain line.',
                title: 'Order on terms',
              },
              {
                description:
                  'Sell it, reorder in two clicks, and the maker knows your shop by name. If a first order does not sell in sixty days, send it back — freight on us, both ways.',
                title: 'Sell it, or send it back',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Open a shop account' } }],
            title: 'Browse. Order. Sell or send back.',
          },
          id: 'first-order',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'Four shelves shops are building from this season. Each is a dozen studios curated to sit together, so a small shop can stock a coherent shelf in one order.',
            eyebrow: 'This season',
            items: [
              {
                description:
                  'Stoneware, oak boards, and linen from eleven studios that fire, cut, and weave to sit together on one table.',
                title: 'The long table shelf',
              },
              {
                description:
                  'Small-batch preserves, teas, and dry goods with labels worth facing outward. Pantry minimums start at twelve.',
                title: 'The pantry shelf',
              },
              {
                description:
                  'Prints, cards, and bound notebooks from nine presses. The reorder rate on this shelf is the highest on the market.',
                title: 'The paper shelf',
              },
              {
                description:
                  'Throws, cushions, and dyed lengths from six weavers. Lead times are honest — these are made when you order them.',
                title: 'The textile shelf',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Ask for the full list' } }],
            title: 'Shelves, not searches.',
          },
          id: 'this-season',
          tone: 'muted',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The terms',
            features: [
              {
                description:
                  'Sixty days on every order, not a teaser rate for the first one. The terms are the product; they do not expire.',
                title: 'Sixty days, always',
              },
              {
                description:
                  'A first order from any maker can go back within sixty days if it has not sold, freight paid both ways. After the first, orders are firm.',
                title: 'Returns on firsts',
              },
              {
                description:
                  'One invoice per cart, however many makers are in it. Your bookkeeper gets one line of freight, not eleven.',
                title: 'One invoice',
              },
              {
                description:
                  'Every listing shows the maker’s stockist map. If the shop across the road already carries it, you will know before you order.',
                title: 'No doubled shelves',
              },
            ],
            paragraphs: [
              {
                text: 'The terms exist so that trying something new is a merchandising decision, not a financial one. Here is the whole deal, and the numbers it produces.',
              },
            ],
            stats: [
              { label: 'days to pay, every order', value: '60' },
              { label: 'of first orders reorder', value: '7 in 10' },
              { label: 'pieces, the smallest minimum', value: '12' },
              { label: 'invoice per cart, any number of makers', value: '1' },
            ],
            title: 'The whole deal, stated plainly.',
          },
          id: 'the-terms',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            description: 'From shopkeepers this year, unedited.',
            eyebrow: 'Shops say',
            items: [
              {
                author: 'Bea Tanaka',
                quote:
                  'I stocked my opening shelf entirely through Trestle because the sixty days meant I could open the doors before I owed anyone. Two years on, half that shelf is still reordered monthly.',
                rating: 5,
                role: 'Keeper, The Corner Ledger, Ellsworth',
              },
              {
                author: 'Piotr Nowicki',
                quote:
                  'The returns policy made me braver. I tried a ceramicist I would never have risked wholesale-blind, she outsold everything that quarter, and now her shelf has her name on it.',
                rating: 5,
                role: 'Owner, Nowicki & Daughters',
              },
              {
                author: 'Fern Adeyemi',
                quote:
                  'Four stars because the textile lead times test my patience — but they are stated honestly on the listing, and what arrives is worth the wait every time.',
                rating: 4,
                role: 'Buyer, The Weir Shop',
              },
            ],
            title: 'Shelves that worked.',
          },
          id: 'shops-say',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'The practical ones, before you apply.',
            eyebrow: 'Shop questions',
            items: [
              {
                answer:
                  'Any independent shop with a till and a shelf — bricks, market stall, or a serious online shop. We ask what you sell and where; Dolly reads every application herself.',
                question: 'Who can open an account?',
              },
              {
                answer:
                  'Most applications are approved inside two working days. Your first cart ships on the same terms as your hundredth.',
                question: 'How long does approval take?',
              },
              {
                answer:
                  'Each listing states the maker’s lead time — stocked work ships within the week; made-to-order textiles say so plainly and mean it.',
                question: 'How fast do orders arrive?',
              },
              {
                answer:
                  'Sixty days from dispatch, by transfer or card, and the ledger reminds you before it is due rather than after it is late.',
                question: 'How do we settle the invoice?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'How it works' } }],
            title: 'Before you apply',
          },
          id: 'shop-questions',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'Tell us the shop’s name and where it stands. Dolly reads every application and answers inside two working days.',
            emailPlaceholder: 'you@yourshop.example',
            submitLabel: 'Apply for an account',
            title: 'Open a shop account.',
          },
          id: 'open-account',
        },
      ],
      title: 'Trestle — For shops',
    },
    {
      description:
        'The maker’s half: what you control, when the money arrives, and the honest table of what changes when the ledger does your paperwork.',
      label: 'For makers',
      path: 'suppliers',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'You made the work; the terms should not make you a creditor. On Trestle your wholesale price is yours, the money arrives when the order ships, and the chasing is our job.',
            eyebrow: 'For makers',
            links: [
              { link: { appearance: 'default', label: 'Apply to sell' } },
              { link: { appearance: 'outline', label: 'See how it works' } },
            ],
            proofItems: [
              { label: 'Your price, your minimums' },
              { label: 'Paid on dispatch' },
              { label: 'One flat commission' },
            ],
            title: 'Make the work. We’ll mind the ledger.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'From studio to shelf in three steps. The application is the only gate — the market stays curated because a shelf full of everything sells nothing.',
            eyebrow: 'From studio to shelf',
            items: [
              {
                description:
                  'Show us the work and name your wholesale price, your minimum, and your honest lead time. We say yes or no within the week, with a reason either way.',
                title: 'List once, plainly',
              },
              {
                description:
                  'Orders arrive batched on the days you choose. Freight is booked from your door with labels that print, not puzzles.',
                title: 'Orders come to you',
              },
              {
                description:
                  'The moment the courier scans it, the payment is queued to you. The shop’s sixty days are our wait, not yours.',
                title: 'Paid when it ships',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Apply to sell' } }],
            title: 'List. Ship. Get paid.',
          },
          id: 'from-studio-to-shelf',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'What you control',
            paragraphs: [
              {
                text: 'A marketplace can quietly become your boss. This one is built not to: the three levers that matter stay in your hands, in writing.',
              },
            ],
            rows: [
              {
                description:
                  'Your wholesale price is yours to set and change. The commission is added on top and shown to you before anything lists — we never discount your work to move it.',
                title: 'The price',
              },
              {
                description:
                  'Twelve pieces or two hundred — your minimum, stated on the listing. Made-to-order lead times are printed plainly, and a shop that orders accepts them.',
                title: 'The minimums and the lead time',
              },
              {
                description:
                  'Your stockist list is visible to you and cappable by you: by number, by street, or by name. Exclusivity is yours to grant, not ours to sell.',
                title: 'Who stocks you',
              },
            ],
            title: 'Three levers that stay yours.',
          },
          id: 'what-you-control',
          tone: 'muted',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'Wholesale on your own against wholesale through the ledger, compared honestly — including the row where nothing changes.',
            features: [
              {
                feature: 'Who sets the wholesale price',
                values: [{ label: 'You' }, { label: 'You' }],
              },
              {
                feature: 'When you are paid',
                values: [{ label: 'When the shop settles' }, { label: 'On dispatch' }],
              },
              {
                feature: 'Who chases late invoices',
                values: [{ label: 'You, evenings' }, { label: 'The ledger' }],
              },
              {
                feature: 'Who books and prices freight',
                values: [{ label: 'You' }, { included: true }],
              },
              {
                feature: 'Who carries first-order returns',
                values: [{ label: 'Negotiated each time' }, { included: true }],
              },
              {
                feature: 'Who owns the shop relationship',
                values: [{ label: 'You' }, { label: 'Still you' }],
              },
            ],
            plans: [
              { name: 'On your own' },
              { badge: 'One flat commission', highlighted: true, name: 'Through Trestle' },
            ],
            title: 'What changes, and what never will.',
          },
          id: 'with-and-without',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Ines Fabbri',
              quote:
                'The week my kiln element went, three invoices were overdue from shops I liked too much to chase. I listed on Trestle that month. Now the money lands when the box leaves, the chasing is not my name in the inbox, and I have fired more work in two years than in the five before them.',
              role: 'Fabbri Studio — stoneware, listing since the first year',
            },
          },
          id: 'a-maker',
          tone: 'contrast',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'The questions makers ask before showing us the work.',
            eyebrow: 'Maker questions',
            items: [
              {
                answer:
                  'Work made by you or your studio, in batches you control. We say no to resellers and to anything pretending to be handmade — that protection is most of what the commission buys.',
                question: 'What do you accept?',
              },
              {
                answer:
                  'One flat commission on the wholesale price, shown before you list. No listing fee, no monthly fee, no photography fee, and it has not changed since the first year.',
                question: 'What does it cost?',
              },
              {
                answer:
                  'Within the week, from a person, with a reason either way. A no is usually about batch reliability, and we say what would change it.',
                question: 'How fast do you answer applications?',
              },
              {
                answer:
                  'Yes — cap stockists by number, street, or name, and grant exclusivity yourself if a shop earns it. The map is yours to read and rule.',
                question: 'Can I control who stocks me?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'How it works' } }],
            title: 'Before you show us the work',
          },
          id: 'maker-questions',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'Send the address of your work — a site, a feed, a folder of honest photographs. A person answers within the week.',
            emailPlaceholder: 'you@yourstudio.example',
            submitLabel: 'Apply to sell',
            title: 'Show us the work.',
          },
          id: 'apply',
        },
      ],
      title: 'Trestle — For makers',
    },
    {
      description:
        'The trust page both sides read: one order traced end to end, who does what at every step, and the founders’ reason the ledger exists.',
      label: 'How it works',
      path: 'how-it-works',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'One order, traced honestly from a shop’s cart to a maker’s bank, with every hand it passes through named. This page exists because a marketplace asking for trust owes both sides the mechanics.',
            eyebrow: 'How it works',
            links: [
              { link: { appearance: 'default', label: 'Open a shop account' } },
              { link: { appearance: 'outline', label: 'Apply to sell' } },
            ],
            proofItems: [
              { label: 'One ledger, both sides' },
              { label: 'Terms in writing' },
              { label: 'A person named Dolly' },
            ],
            title: 'One order, both sides looked after.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'The life of one order. Nothing in it is clever; all of it is written down.',
            eyebrow: 'The flow',
            items: [
              {
                description:
                  'A shop builds one cart across any number of studios. Each maker’s minimum, lead time, and stockist map is on the listing before the order exists.',
                title: 'The cart',
              },
              {
                description:
                  'Each maker confirms, packs, and hands the boxes to freight we booked. At the courier’s first scan, the maker’s payment is queued — that is the moment the risk becomes ours.',
                title: 'The dispatch',
              },
              {
                description:
                  'The shop shelves it with sixty days to settle one invoice. Firsts that do not sell go back on our freight; everything else becomes the reorder that pays for the whole machine.',
                title: 'The shelf',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'The questions, grouped' } }],
            title: 'Cart. Dispatch. Shelf.',
          },
          id: 'the-flow',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'Who does what, stated as a table because prose lets a marketplace mumble. The last row is the point.',
            features: [
              {
                feature: 'Sets the wholesale price',
                values: [{}, { label: 'The maker' }, {}],
              },
              {
                feature: 'Books and pays first-order freight',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Carries the sixty-day wait',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Chases the invoice',
                values: [{}, {}, { included: true }],
              },
              {
                feature: 'Chooses what goes on the shelf',
                values: [{ included: true }, {}, {}],
              },
              {
                feature: 'Owns the relationship',
                values: [{ label: 'Both' }, { label: 'Both' }, {}],
              },
            ],
            plans: [
              { name: 'The shop' },
              { name: 'The maker' },
              { badge: 'The service', highlighted: true, name: 'Trestle' },
            ],
            title: 'Who does what.',
          },
          id: 'who-does-what',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Ro Beckett, co-founder — kept Gather for twelve years',
            eyebrow: 'Why the ledger exists',
            paragraphs: [
              {
                text: 'Trestle started as a spreadsheet Ro kept behind the till at Gather, tracking which studios shipped on time and which invoices she was ashamed to chase. Sam turned the spreadsheet into a ledger, and the ledger into the company. The shop is gone; the till is in the office.',
              },
            ],
            quote:
              'Wholesale ran on two kinds of fear: the shop’s fear of dead stock and the maker’s fear of dead invoices. Every term we wrote exists to delete one of those fears, and we have never written one that did not.',
            title: 'Built behind a till.',
          },
          id: 'the-ledger-story',
        },
        {
          componentSlug: 'integration-cluster',
          content: {
            heading: 'One connection, both sides of the trade.',
            links: [{ link: { appearance: 'outline', label: 'Talk to Dolly' } }],
            subtext:
              'Shops and studios keep their own tills, stock books, and couriers — the ledger sits in the middle and keeps everyone’s numbers agreeing.',
          },
          id: 'the-network',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description: 'Grouped the way the two sides ask them, plus the money in the middle.',
            eyebrow: 'The detail',
            groups: [
              {
                icon: 'package',
                items: [
                  {
                    answer:
                      'Each listing states it: stocked work ships within the week; made-to-order says its lead time plainly and the shop accepts it at the cart.',
                    question: 'How long does an order take?',
                  },
                  {
                    answer:
                      'Batched to the days the maker chooses — a studio that fires on Fridays is not asked to ship on Tuesday.',
                    question: 'How do orders reach a studio?',
                  },
                ],
                title: 'Ordering',
              },
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'The maker is paid on dispatch; the shop settles one invoice within sixty days. The gap between those two dates is Trestle’s risk, and the flat commission is what pays for carrying it.',
                    question: 'Where does the money actually sit?',
                  },
                  {
                    answer:
                      'One flat commission on the wholesale price, both sides shown it up front. No listing, monthly, or photography fees on either side.',
                    question: 'What does Trestle charge?',
                  },
                ],
                title: 'The money',
              },
              {
                icon: 'truck',
                items: [
                  {
                    answer:
                      'Booked by us from the studio’s door, priced as one plain line on the shop’s invoice. On first-order returns we pay it both ways.',
                    question: 'Who handles freight?',
                  },
                  {
                    answer:
                      'Photograph it, tell the ledger, and the replacement or credit is agreed within two working days — the maker is never out of pocket for a courier’s bad day.',
                    question: 'What if something arrives broken?',
                  },
                ],
                title: 'Freight and returns',
              },
            ],
            title: 'Everything else, grouped.',
          },
          id: 'the-detail',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Both applications are read by a person and answered inside the week. The terms you have just read are the terms you get.',
            links: [
              { link: { appearance: 'default', label: 'Open a shop account' } },
              { link: { appearance: 'outline', label: 'Apply to sell' } },
            ],
            title: 'Take a side.',
          },
          id: 'start',
        },
      ],
      title: 'Trestle — How it works',
    },
    {
      description:
        'The two desks, the office in Ellsworth, and a form that asks which side of the trestle you stand on.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Support is a person named Dolly and the people she has trained, weekdays nine to six. Say which side you are on and the right desk answers.',
            eyebrow: 'Contact',
            links: [{ link: { appearance: 'outline', label: 'How it works' } }],
            proofItems: [
              { label: 'Weekdays 9–6' },
              { label: 'Answers inside a working day' },
              { label: 'The old till is in the office' },
            ],
            title: 'Talk to a person.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Orders, terms, returns, and applications from anyone with a shelf. Answered inside a working day.',
                label: 'The shops desk',
                value: 'shops@trestle.example',
              },
              {
                description:
                  'Listings, dispatch, payments, and applications from anyone with a studio. Also read by people who have packed a kiln.',
                label: 'The makers desk',
                value: 'makers@trestle.example',
              },
              {
                description:
                  'For anything urgent enough to need a voice — a broken crate, a missed van, a wrong invoice.',
                label: 'Ring the office',
                value: '01632 960 512',
              },
              {
                description:
                  'The Trestle office, with Gather’s old till by the door. Visitors welcome by arrangement.',
                label: 'The office',
                value: 'Unit 9, Rope Court, Ellsworth',
              },
            ],
            description:
              'Email the right desk and a person answers inside a working day. The form does the routing if you would rather write once.',
            eyebrow: 'Contact',
            formConfigured: true,
            formDescription:
              'Say which side you stand on — shop or studio — and what you need. It lands on the right desk, not in a queue.',
            formLabels: [
              'Your name',
              'Shop or studio',
              'Which side are you on?',
              'Email',
              'What do you need?',
            ],
            formTitle: 'Or write it once',
            submitLabel: 'Send it to the right desk',
            title: 'Two desks, one door.',
          },
          id: 'contact',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'The practical ones, before you write.',
            eyebrow: 'Practical',
            items: [
              {
                answer:
                  'Inside one working day, from a person. If it needs the ledger team it says so, with a date — nothing disappears into “we have received your message”.',
                question: 'How fast do you answer?',
              },
              {
                answer:
                  'Yes — ring the office and Dolly will walk you through your first cart or your first listing on a shared screen. Most people need it once.',
                question: 'Can someone walk me through it?',
              },
              {
                answer:
                  'By arrangement, gladly — the office keeps a shelf of every maker who has ever listed, and visitors leave with strong opinions about stoneware.',
                question: 'Can we visit the office?',
              },
              {
                answer:
                  'Write to the makers desk with the listing in question. Disputes are read against the ledger and the terms, and the terms win — that cuts both ways, which is the point.',
                question: 'Who settles a disagreement?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'How it works' } }],
            title: 'Before you write',
          },
          id: 'practical',
        },
      ],
      title: 'Trestle — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'marketplace-wholesale',
  status: 'concept',
  summary:
    'A fictional two-sided wholesale marketplace between independent makers and independent shops — the split-audience register, with the trust page that must convince both sides at once.',
  theme: {
    description:
      'Kraft paper and spruce-green ink with a stamped, mercantile hand — ledger rules, twin-column symmetry for the two audiences, and terms set like they are printed on the crate.',
    id: 'marketplace-wholesale',
    swatches: ['#f6f3ea', '#22301f', '#2f6b4f'],
  },
  title: 'Marketplace Wholesale',
  visualTone: ['Two-sided', 'Mercantile', 'Stamped'],
}
