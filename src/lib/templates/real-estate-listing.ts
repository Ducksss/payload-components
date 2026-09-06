import type { TemplateShowcase } from './types'

/* Real estate — "Moorhouse & Kent", a fictional estate agency in the fictional
 * market town of Abbotsmoor.
 *
 * Art direction: THE LISTING REGISTER. An estate agency site is an inventory
 * with an argument attached — homes as cards, particulars as tables, "just
 * agreed" as proof — and two audiences share one nav: sellers being courted,
 * buyers being routed. No other concept in the gallery owns that register.
 * The voice is a firm that puts every guide in writing: warm stone paper,
 * slate ink, one brick-red accent, hairline rules everywhere, Instrument
 * Serif italic for the display voice (the letterhead, the ledger figures),
 * and every image surface drawn as a surveyor's artefact — floor-plan
 * hatching, window grids, plot lines, the ruled pages of the buyers' book —
 * so the missing photography reads as particulars, not as absence.
 *
 *   Home        the firm on one letterhead: this week's homes, the record,
 *               the method, and the two doors (valuation / homes for sale)
 *   Properties  the register proper: every home as a card, "just agreed" as
 *               the honest advertisement, three homes compared in a table
 *   Selling     the seller's argument: the method in full, what the fee
 *               covers, two levels of service, the questions grouped
 *   About       thirty-eight years of one office: the people, the window,
 *               and the wall of what clients have said
 *   Contact     one number, six people, and a form that routes to the right
 *               one of them
 *
 * Canonical facts, kept consistent across every page: founded 1987 by Iris
 * Moorhouse; Davey Kent joined in 1994; Iris's daughter Nell Moorhouse runs it
 * now; one office at 12 Sheep Street; six people; they cover Abbotsmoor and the
 * five villages of the Vale (Steeple Vale, Lower Cray, Fenny Cross, Marle
 * Hill, Bell End Green); roughly ninety homes a year; an average of nine
 * viewings to an agreed sale; 19 in 20 agreed sales complete; no sale, no fee.
 *
 * Everything is fictional: the firm, the people, the town and villages, every
 * street, every listed home, every buyer and seller, and the local paper (The
 * Vale Gazette). No ombudsman, redress scheme, professional body, regulator,
 * licence number, or insurer is named or invented — where the copy touches
 * conduct it stays generic ("in writing", "no sale, no fee"). Phone numbers
 * sit inside the 01632 96xxxx fiction range; email uses the reserved
 * `.example` domain.
 *
 * There are NO currency amounts anywhere. An estate agency solves this the way
 * agents actually talk on the doorstep: "guide on request", offers "over the
 * guide", fees as "a fixed percentage agreed in writing before the board goes
 * up" — never a number with a sign on it. All copy stays editor-shaped
 * (demo-content types); layout belongs to the twins and to the Moorhouse
 * shell and theme. */

export const realEstateListingTemplate: TemplateShowcase = {
  assets: [],
  category: 'real-estate',
  description:
    'Moorhouse & Kent is a fictional two-name estate agency in the fictional market town of Abbotsmoor: one office on Sheep Street, six people, and about ninety homes a year across the town and the five villages of the Vale. The concept owns the listing register — homes as cards, particulars as tables, "just agreed" as proof — set in warm stone, slate ink, and one brick-red accent, with every image surface drawn as a surveyor\'s artefact: floor-plan hatching, window grids, the ruled pages of the buyers\' book. Five pages — Home, Properties, Selling, About, and Contact — court sellers and route buyers through one nav, with a valuation booking as the single seller-facing action. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Properties', path: 'properties' },
    { label: 'Selling', path: 'selling' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'The firm in one screen: what is on the market this week, how they sell, and the record that makes a seller ring them first.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The letterhead — id'd apart from the interior 'hero' sections so
           * the theme can give the home page the full letterhead treatment
           * (deeper band, the surveyor's grid fading in from the right, serif
           * display at its largest) while interior heroes take the same
           * grammar dialled back. hero-basic rather than any kinetic variant:
           * the register is assured, surveyed calm — a firm this sure of its
           * guide does not animate at you. The headline is the whole pitch in
           * eight words and lands in Instrument Serif italic, the concept's
           * letterhead voice. Both CTAs are real routes and name the two
           * audiences: Book a valuation → selling's action, Homes for sale →
           * properties. The proof chips are restyled by the theme into
           * hairline-ruled stamps — the three facts a seller checks first. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'Moorhouse & Kent has sold homes in Abbotsmoor and the Vale since 1987 — one office, six people, and a list we know house by house. If you are selling, we will tell you the honest guide. If you are buying, we will tell you the honest house.',
            eyebrow: 'Moorhouse & Kent · Est. 1987',
            links: [
              { link: { appearance: 'default', label: 'Book a valuation' } },
              { link: { appearance: 'outline', label: 'Homes for sale' } },
            ],
            proofItems: [
              { label: 'No sale, no fee' },
              { label: 'Nine viewings to a sale, on average' },
              { label: 'One office since 1987' },
            ],
            title: 'The right buyer for a house like yours.',
          },
          id: 'letterhead',
        },
        {
          /* Homes as cards — the concept's signature object, first thing under
           * the letterhead. feature-cards-media because its media well is the
           * property-photography slot, and the theme repaints that well as
           * estate particulars: the well becomes a surveyor's drawing sheet
           * (fine plot grid on warm paper) and the twin's four inner panels
           * become the rooms of a floor plan — hairline walls, directional
           * hatching, the one brick-tinted cell reading as the garden. Each
           * card varies its hatch angle and pitch by position so three homes
           * read as three different plans, not one plan copied. Copy keeps
           * the no-currency rule in the agent's own idiom: "guide on
           * request", "offers invited over the guide". The theme also widens
           * this grid to three columns on desktop so the row reads as a
           * window display rather than two cards and an orphan. */
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'Three of the homes we brought to market this week. Guides on request — ring the office and ask for the particulars.',
            eyebrow: 'New this week',
            items: [
              {
                description:
                  'Four bedrooms, a walled garden, and the last unconverted hayloft on the lane. Chain free. Guide on request.',
                title: 'The Old Dairy, Lower Cray',
              },
              {
                description:
                  'Three-bedroom terrace a minute from the market square, re-roofed last spring, with the long east-facing garden the row is known for.',
                title: '14 Ropewalk, Abbotsmoor',
              },
              {
                description:
                  'A two-bedroom cottage on the green with a workshop that has planning history worth reading. Offers invited over the guide.',
                title: 'Wren Cottage, Steeple Vale',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See every home' } }],
            title: 'On the market this week.',
          },
          id: 'new-this-week',
        },
        {
          /* The one slate band on the home page. A ledger, not a brag — the
           * four numbers are the ones a seller would actually check,
           * including the honest denominator (19 in 20, not "all"), and the
           * quote comes from the local paper rather than the firm. The theme
           * sets the ledger figures in serif italic (the letterhead voice
           * doing arithmetic) and the logoLabel as a tracked-caps masthead in
           * clay, so THE VALE GAZETTE reads as a newspaper lockup, not a
           * heading. logoLabel is set deliberately: without it the quote
           * panel has no attribution anchor. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Hedda Brownlow',
            body: 'The record is the argument. We would rather bring nine serious viewings than forty curious ones, and the numbers below are last year’s, counted the boring way.',
            description:
              'Thirty-eight years on Sheep Street, measured in the only numbers that matter to a seller.',
            eyebrow: 'The record',
            logoLabel: 'THE VALE GAZETTE',
            metrics: [
              { label: 'homes sold last year, town and Vale', value: '92' },
              { label: 'viewings to an agreed sale, on average', value: '9' },
              { label: 'of agreed sales completed', value: '19 in 20' },
              { label: 'years of the same phone number', value: '38' },
            ],
            quote:
              'Half the boards in the Vale carry their name and the other half wish they did. Moorhouse & Kent still walk every house before they write a word about it, and it shows in what they refuse to list.',
            role: 'Property notes, The Vale Gazette',
            title: 'Ninety homes a year, properly.',
          },
          id: 'the-record',
          tone: 'contrast',
        },
        {
          /* The method in three numbered cards on the deeper stone band —
           * feature-steps because selling with an agent IS a sequence, and
           * numbered steps promise the seller a process rather than a
           * personality. The step numerals take the brick fill (ink-safe
           * white on brick), the one loud mark on the band. Copy plants the
           * Friday note — the firm's signature promise — which the Selling
           * page then pays off in full. */
          componentSlug: 'feature-steps',
          content: {
            description:
              'The same method since 1987, tightened yearly. You will know where your sale stands every Friday, in writing.',
            eyebrow: 'How we sell',
            items: [
              {
                description:
                  'Nell or Davey walks the house, tells you the honest guide and the honest work worth doing first — sometimes the second is worth more than the first.',
                title: 'The walk-through',
              },
              {
                description:
                  'Photography on a bright morning, a floor plan measured by us, and particulars written by someone who has stood in every room.',
                title: 'The particulars',
              },
              {
                description:
                  'Every viewing accompanied by someone who can answer the second question, not just the first. Offers come to you the day they are made, in writing.',
                title: 'The viewings',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Book a valuation' } }],
            title: 'Walked, written, accompanied.',
          },
          id: 'how-we-sell',
          tone: 'muted',
        },
        {
          /* Star-rated cards because portal-style reviews are the register
           * buyers and sellers already trust — and one deliberate four-star
           * review with the reason stated does more for believability than a
           * wall of fives. The stars take the brick fill; avatars become
           * monogram medallions with a serif italic initial (the wax-seal
           * detail, in place of portraits this concept never fabricates).
           * Roles name streets and months, the way real reviews sign
           * themselves. */
          componentSlug: 'testimonials-rating',
          content: {
            description: 'From sellers and buyers this year, unedited.',
            eyebrow: 'What people say',
            items: [
              {
                author: 'Tomos Frayne',
                quote:
                  'Two agents told us a fantasy guide to win the listing. Nell told us the real one, then beat it in eleven days with a buyer who did not blink at the survey.',
                rating: 5,
                role: 'Sold on Ropewalk, March',
              },
              {
                author: 'Sable Okafor',
                quote:
                  'As buyers we were nobody’s client, but Davey still rang us first when the right cottage came up, because he had actually listened to what we wanted. We were in by Christmas.',
                rating: 5,
                role: 'Bought in Steeple Vale',
              },
              {
                author: 'Gwen Applethwaite',
                quote:
                  'The sale nearly fell over twice and both times it was Moorhouse & Kent who put it back together, on the phone, on a Sunday. Four stars only because the second Sunday was my fault.',
                rating: 4,
                role: 'Sold at Lower Cray',
              },
            ],
            title: 'Sellers and buyers, this year.',
          },
          id: 'sellers-say',
        },
        {
          /* The four questions every valuation starts with, answered the way
           * the firm talks: the fee stated without a number ("a fixed
           * percentage agreed in writing"), the timeline in weeks, the guide
           * as something staked rather than hoped. faq-accordion's centred,
           * hairline-ruled column is already the shape of printed
           * particulars — the theme only firms the question weight. The
           * outline link routes deeper to Selling rather than repeating the
           * valuation CTA, which belongs to the closer below. */
          componentSlug: 'faq-accordion',
          content: {
            description: 'The four questions every valuation starts with.',
            eyebrow: 'Asked first',
            items: [
              {
                answer:
                  'No sale, no fee — a fixed percentage agreed in writing before the board goes up, and it never changes afterwards. The valuation itself costs nothing and obliges you to nothing.',
                question: 'What does selling with you cost?',
              },
              {
                answer:
                  'Homes like yours in the town and the Vale have been taking six to ten weeks to agree a sale this year. We will tell you where yours sits in that range and why, on the walk-through.',
                question: 'How long will it take?',
              },
              {
                answer:
                  'The guide is what we would stake our name on, and we put it in writing. If we think a house will do better at offers over the guide, we say so and explain the strategy before you commit.',
                question: 'How do you set the guide?',
              },
              {
                answer:
                  'Yes — every one, by one of the six of us, never by a key in a lockbox. Whoever shows your house can answer questions about the boiler, the boundary, and the neighbours’ extension.',
                question: 'Are viewings accompanied?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'More on selling' } }],
            title: 'Before the board goes up',
          },
          id: 'asked-first',
        },
        {
          /* The closer. call-to-action-boxed becomes the appointment card:
           * the theme rules its inner panel with a double hairline (border
           * plus inset outline), the way a printed valuation card is ruled.
           * Copy keeps the promise proportionate — an hour, in writing, no
           * obligation — because overselling a free valuation is exactly what
           * this firm would never do. */
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'A walk-through takes an hour, the guide comes in writing the next morning, and neither commits you to anything. Most people learn something about their house either way.',
            links: [
              { link: { appearance: 'default', label: 'Book a valuation' } },
              { link: { appearance: 'outline', label: 'Homes for sale' } },
            ],
            title: 'Find out what it is worth.',
          },
          id: 'valuation',
        },
      ],
      title: 'Moorhouse & Kent — Estate agents in Abbotsmoor',
    },
    {
      description:
        'The listing page proper: every home on the market as a card, the month’s agreed sales as proof, and three homes compared side by side.',
      label: 'Properties',
      path: 'properties',
      sections: [
        {
          /* Interior header — the letterhead grammar dialled back: same
           * surveyor's grid, tighter band, so the whole site keeps one header
           * treatment the way a real agency's print does. The CTAs split the
           * two audiences again, buyers first this time (Register your
           * search), and the proof chips state the register's promises:
           * current, walked, on request. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'Every home we are selling in Abbotsmoor and the Vale, kept current daily. Guides on request; particulars posted, emailed, or read to you down the phone, whichever you prefer.',
            eyebrow: 'Properties',
            links: [
              { link: { appearance: 'default', label: 'Register your search' } },
              { link: { appearance: 'outline', label: 'Book a valuation' } },
            ],
            proofItems: [
              { label: 'Updated daily' },
              { label: 'Every home walked by us' },
              { label: 'Particulars on request' },
            ],
            title: 'Homes on the market now.',
          },
          id: 'hero',
        },
        {
          /* The register in full: six cards, two columns — this page keeps
           * the twin's two-column grid (unlike the home page's three-up
           * window display) because six particulars stacked two abreast read
           * as a ledger to work down, not a shopfront. The same floor-plan
           * media wells as the home page, varied per card by nth-child so no
           * two plans hatch alike. The copy line "half our sales never reach
           * this page" plants the buyers' book the quote section below pays
           * off. */
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'The current list, newest first. If nothing here fits, register your search — half our sales never reach this page.',
            eyebrow: 'For sale',
            items: [
              {
                description:
                  'Four bedrooms, walled garden, hayloft with conversion potential. Chain free. Guide on request.',
                title: 'The Old Dairy, Lower Cray',
              },
              {
                description:
                  'Three-bedroom terrace by the market square, re-roofed, long east garden. Guide on request.',
                title: '14 Ropewalk, Abbotsmoor',
              },
              {
                description:
                  'Two-bedroom cottage on the green, workshop with planning history. Offers over the guide.',
                title: 'Wren Cottage, Steeple Vale',
              },
              {
                description:
                  'Five bedrooms behind the long brick wall on Priory Lane, with the orchard intact and the cellar dry. A house we have sold twice before.',
                title: 'The Priory House, Abbotsmoor',
              },
              {
                description:
                  'A two-bedroom quarryman’s cottage with the best view in the Vale and honest work needed under it. Priced for the work — ask us which jobs come first.',
                title: '3 Quarry Row, Marle Hill',
              },
              {
                description:
                  'Three bedrooms, single storey, level from the lane, in the paddock corner of a village that rarely sells. Chain free.',
                title: 'The Bield, Fenny Cross',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Ask for particulars' } }],
            title: 'The list, in full.',
          },
          id: 'for-sale',
        },
        {
          /* "Just agreed" — the honest advertisement, on the deeper stone
           * band. content-rows because each agreed sale wants a plate and a
           * story; the theme repaints the plates as house elevations — slate
           * roofline, window grid — each with a brick corner sash, the slip
           * an agent pastes across the particulars the morning a sale is
           * agreed. Rows vary their window pitch so three elevations read as
           * three houses. Copy states the why outright: what actually sells,
           * and how fast, matters more than what is merely listed. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Just agreed',
            paragraphs: [
              {
                text: 'Agreed this month. We publish these because they are the honest advertisement: what actually sells, and how fast, matters more than what is merely listed.',
              },
            ],
            rows: [
              {
                description:
                  'Agreed in eleven days to a chain-free buyer registered with us since spring. Nine viewings.',
                title: 'The Malthouse, Abbotsmoor',
              },
              {
                description:
                  'Agreed over the guide after two written offers on the same Friday. The under-bidder is now registered for the next one on the row.',
                title: '7 Weavers Bank, Steeple Vale',
              },
              {
                description:
                  'Agreed to the third viewer — a family trading up from Ropewalk, whose own sale we agreed the same week. Two boards, one chain, no gaps.',
                title: 'Applecroft, Fenny Cross',
              },
            ],
            title: 'Agreed this month.',
          },
          id: 'just-agreed',
          tone: 'muted',
        },
        {
          /* The signature move: three homes honestly compared, in a table —
           * particulars as particulars. No other concept in the gallery puts
           * a comparator to work on inventory rather than pricing tiers. The
           * theme sets it like a printed schedule: serif plan names, a double
           * rule under the header row, the highlighted column washed in the
           * palest brick. The honest register does the persuading — "Work
           * needed: the workshop" sits in the same grid as "Chain: none". */
          componentSlug: 'comparator-table',
          content: {
            description:
              'Three homes people keep asking us to choose between, compared the way we would on the phone. The right answer depends on which compromise you can live with.',
            features: [
              {
                feature: 'Bedrooms',
                values: [{ label: 'Four' }, { label: 'Three' }, { label: 'Two' }],
              },
              {
                feature: 'Garden',
                values: [
                  { label: 'Walled, south' },
                  { label: 'Long, east' },
                  { label: 'Green-front' },
                ],
              },
              {
                feature: 'Chain',
                values: [{ label: 'None' }, { label: 'Selling on' }, { label: 'None' }],
              },
              {
                feature: 'Work needed',
                values: [{ label: 'Cosmetic' }, {}, { label: 'The workshop' }],
              },
              {
                feature: 'Walk to the market square',
                values: [{}, { included: true }, {}],
              },
            ],
            plans: [
              { badge: 'Chain free', name: 'The Old Dairy' },
              { highlighted: true, name: '14 Ropewalk' },
              { name: 'Wren Cottage' },
            ],
            title: 'Three homes, honestly compared.',
          },
          id: 'at-a-glance',
        },
        {
          /* The buyers' book — content-quote because it pairs a plate with a
           * first-person voice, and the plate is the concept's most literal
           * artefact: the theme rules it as a ledger page, feint lines and a
           * brick margin rule, Davey's notebook drawn in CSS. The quote is
           * the firm's whole matching philosophy in two sentences, cited to
           * the partner who keeps the book. */
          componentSlug: 'content-quote',
          content: {
            citation: 'Davey Kent, partner',
            eyebrow: 'Buying through us',
            paragraphs: [
              {
                text: 'Buyers do not pay us and never will, but half of this job is matching, not marketing. Tell us what you actually want — not the specification, the life — and you go in the book Davey has kept since 1994.',
              },
            ],
            quote:
              'The book is just a notebook, and it has sold more houses than the window has. People tell me the three things they cannot compromise on, and when the right door comes up I ring them before the board goes in the van.',
            title: 'Get in the book.',
          },
          id: 'buying-through-us',
        },
        {
          /* The buyer's one action, on the deeper band so the page closes on
           * a tear-off card: register the search. call-to-action-signup's
           * email well is restyled as a ruled paper slip with a brick submit.
           * The copy promises restraint — Davey rings once, when it is
           * actually right — because a firm that hates portals would say
           * exactly that about mailing lists. */
          componentSlug: 'call-to-action-signup',
          content: {
            action: '/register-search',
            description:
              'Tell us what you are looking for and you will hear about the right homes before they reach this page. No lists you did not ask for — Davey rings, once, when it is actually right.',
            emailPlaceholder: 'you@yourhouse.example',
            submitLabel: 'Register',
            title: 'Register your search.',
          },
          id: 'register',
          tone: 'muted',
        },
      ],
      title: 'Moorhouse & Kent — Homes for sale',
    },
    {
      description:
        'The seller’s page: the method in full, what the fee covers, the two levels of service, and the questions every seller asks — grouped and answered.',
      label: 'Selling',
      path: 'selling',
      sections: [
        {
          /* The seller's header. The description names the real shape of a
           * sale — a six-to-ten-week argument between hope and evidence — and
           * plants the firm on evidence's side, which is the entire pitch of
           * the page below. Proof chips are the three written promises. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'Selling a home in the town or the Vale is a six-to-ten-week argument between hope and evidence. Our job is to win it for you with evidence — the walk-through, the guide in writing, and a buyer who completes.',
            eyebrow: 'Selling',
            links: [
              { link: { appearance: 'default', label: 'Book a valuation' } },
              { link: { appearance: 'outline', label: 'See the record' } },
            ],
            proofItems: [
              { label: 'No sale, no fee' },
              { label: 'Guide in writing' },
              { label: 'Every viewing accompanied' },
            ],
            title: 'Selling a home in Abbotsmoor.',
          },
          id: 'hero',
        },
        {
          /* The home page's three steps, paid off in full: same block, same
           * numbering, deeper copy — so a seller who arrived from "Walked,
           * written, accompanied" recognises the method instantly and reads
           * the detail here. The Friday note runs the length of it, stated in
           * the intro so all three cards inherit it. */
          componentSlug: 'feature-steps',
          content: {
            description:
              'From the first phone call to the day the van comes, this is the whole method. The Friday note — where your sale stands, in writing — runs the length of it.',
            eyebrow: 'The method',
            items: [
              {
                description:
                  'An hour in the house with Nell or Davey. You get the honest guide the next morning in writing, with the reasoning, and a list of any work that would repay itself.',
                title: 'Walk-through and guide',
              },
              {
                description:
                  'Bright-morning photography, a measured floor plan, and particulars written by the person who walked it. You approve every word before anyone else sees it.',
                title: 'To market, properly',
              },
              {
                description:
                  'Accompanied viewings, offers relayed the day they are made, and the chain managed by phone until the keys are in the new owner’s hand. Then the board comes down.',
                title: 'Offers to completion',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Book a valuation' } }],
            title: 'The whole method.',
          },
          id: 'the-method',
        },
        {
          /* The money section a no-currency concept has to earn: what the
           * fee covers, without a figure anywhere. content-stats carries the
           * argument in three registers at once — a paragraph stating the
           * shape of the fee, four feature cells itemising what it buys, and
           * a stats rail restating the record ("No fee" sits in the value
           * slot where another site would put a price). On the deeper stone
           * band so it reads as the schedule page of the particulars. */
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'What the fee covers',
            features: [
              {
                description:
                  'Taken on a bright morning by us, not a rushed afternoon by a subcontractor. We re-shoot the garden in June if it comes to market in February.',
                title: 'The photography',
              },
              {
                description:
                  'Measured by the person who walked the house. Buyers plan furniture on these; wrong plans unravel sales at survey.',
                title: 'The floor plan',
              },
              {
                description:
                  'Every viewing, accompanied by one of six people who can answer the second question. Feedback rung through to you the same evening.',
                title: 'The viewings',
              },
              {
                description:
                  'The unglamorous half of the job: solicitors chased, surveys attended, the chain rung every Friday until it completes.',
                title: 'The chain work',
              },
            ],
            paragraphs: [
              {
                text: 'One fixed percentage, agreed in writing before the board goes up, covering everything below. No sale, no fee — if we do not sell your house, our work costs you nothing.',
              },
            ],
            stats: [
              { label: 'weeks to an agreed sale, typical this year', value: '6–10' },
              { label: 'viewings to an agreed sale, on average', value: '9' },
              { label: 'agreed sales that completed last year', value: '19 in 20' },
              { label: 'if we do not sell it', value: 'No fee' },
            ],
            title: 'One fee, everything in it.',
          },
          id: 'the-numbers',
          tone: 'muted',
        },
        {
          /* The comparator's second outing, this time doing its native job —
           * two service levels — but still without a price row: the columns
           * are compared on what is done, not what it costs, because the fee
           * section above already settled the money in words. "The quiet
           * sale" is the estate-agent object other templates cannot offer:
           * shown only to the book, no board, no window. The standard listing
           * is the highlighted column because it is the honest default. */
          componentSlug: 'comparator-table',
          content: {
            description:
              'Two ways to instruct us. Most homes take the standard listing; the quiet sale exists for the houses that should never appear in a window.',
            features: [
              {
                feature: 'The walk-through and written guide',
                values: [{ included: true }, { included: true }],
              },
              {
                feature: 'Photography, floor plan, particulars',
                values: [{ included: true }, { label: 'Particulars only' }],
              },
              {
                feature: 'The window and the board',
                values: [{ included: true }, {}],
              },
              {
                feature: 'Shown only to the book',
                values: [{}, { included: true }],
              },
              {
                feature: 'Accompanied viewings and Friday notes',
                values: [{ included: true }, { included: true }],
              },
            ],
            plans: [
              { highlighted: true, name: 'The standard listing' },
              { badge: 'By arrangement', name: 'The quiet sale' },
            ],
            title: 'Two ways to sell.',
          },
          id: 'levels-of-service',
        },
        {
          /* One seller, at length, on the slate band — the emotional centre
           * of the page. testimonials-spotlight because a single accompanied
           * move told properly outweighs another grid of praise, and because
           * the slate band gives the page its one dark beat between the
           * schedule and the questions. Wilf's letter about the apple trees
           * is the detail the whole concept would keep if it could keep only
           * one. */
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Wilf Marchbank',
              quote:
                'Forty-one years in that house, and I dreaded the strangers most of all. Nell brought four viewings, all of them serious, sat with me through every one, and sold it to a family who wrote me a letter about the apple trees. It was done in a month and I never once felt processed.',
              role: 'Sold The Orchard House, Fenny Cross',
            },
          },
          id: 'a-move',
          tone: 'contrast',
        },
        {
          /* Sellers' questions, grouped the way sellers actually ask them —
           * timing, money, the day itself — because a seller's anxieties come
           * in clusters, not a flat list. faq-grouped's icon keys (clock,
           * credit-card, truck) are the block's own allowlist; the theme
           * inks them brick. The money group repeats the fee's shape in the
           * same words as everywhere else — consistency is the trust move. */
          componentSlug: 'faq-grouped',
          content: {
            description: 'Grouped the way sellers ask them: timing, money, and the day itself.',
            eyebrow: 'Selling questions',
            groups: [
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'Spring asks the most of the garden and autumn asks the least of everyone. Honestly: the right time is when you are ready, and the guide accounts for the season.',
                    question: 'When should we go to market?',
                  },
                  {
                    answer:
                      'Six to ten weeks to agree a sale has been typical this year, then the legal work behind it. The Friday note keeps you ahead of every step.',
                    question: 'How long does it all take?',
                  },
                ],
                title: 'Timing',
              },
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'One fixed percentage, agreed in writing before anything starts, payable only on completion. No sale, no fee, and no charges hiding underneath it.',
                    question: 'How does the fee work?',
                  },
                  {
                    answer:
                      'Nothing. The walk-through and the written guide are free and oblige you to nothing — some people use them simply to decide whether to extend instead.',
                    question: 'What does the valuation cost?',
                  },
                ],
                title: 'The money',
              },
              {
                icon: 'truck',
                items: [
                  {
                    answer:
                      'We attend the survey, answer the surveyor’s questions on the spot, and deal with what it raises the same week. Most renegotiations are just slow answers — ours are fast.',
                    question: 'What happens at survey?',
                  },
                  {
                    answer:
                      'We ring both solicitors every Friday, and the buyers every other one. On the day, the keys go from our hand to theirs, and the board is down by lunch.',
                    question: 'Who keeps the chain moving?',
                  },
                ],
                title: 'The day itself',
              },
            ],
            title: 'Every seller asks these.',
          },
          id: 'selling-questions',
        },
        {
          /* The seller's closer, same ruled appointment card as the home
           * page — one card design across the site, the way one firm prints
           * one card. The worst case is stated as a benefit ("you learn what
           * the extension would be worth") because that is this firm's brand
           * of honesty: Beatrix on the About wall was talked out of selling
           * entirely. */
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'An hour of Nell or Davey’s time, the honest guide in writing, and no obligation on the other side of it. The worst case is you learn what the extension would be worth.',
            links: [
              { link: { appearance: 'default', label: 'Book a valuation' } },
              { link: { appearance: 'outline', label: 'Talk to the office' } },
            ],
            title: 'Start with the walk-through.',
          },
          id: 'valuation',
        },
      ],
      title: 'Moorhouse & Kent — Selling',
    },
    {
      description:
        'Thirty-eight years of one office — who the six people are, the window on Sheep Street, and the wall of things clients have said.',
      label: 'About',
      path: 'about',
      sections: [
        {
          /* The firm's history in one breath: the kettle and the card index
           * carry thirty-eight years better than a paragraph of milestones
           * would, and "the kettle is the same kettle" is the whole brand.
           * Proof chips restate the canonical facts. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'Iris Moorhouse opened the office at 12 Sheep Street in 1987 with a kettle and a card index. Davey Kent joined in 1994. Iris’s daughter Nell runs it now, the card index is a spreadsheet, and the kettle is the same kettle.',
            eyebrow: 'About',
            links: [
              { link: { appearance: 'default', label: 'Book a valuation' } },
              { link: { appearance: 'outline', label: 'Homes for sale' } },
            ],
            proofItems: [
              { label: 'Founded 1987' },
              { label: 'Six people, one office' },
              { label: 'Town and the five villages' },
            ],
            title: 'Thirty-eight years on Sheep Street.',
          },
          id: 'hero',
        },
        {
          /* The manifesto, in the two-column register: headline left, the
           * argument right. Staying small is framed as the discipline the
           * reputation stands on — growth would mean listing houses they have
           * not walked — and the coverage paragraph names all five villages
           * once, canonically, so every other page can gesture at "the Vale"
           * without re-listing them. */
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Who we are',
            links: [{ link: { appearance: 'outline', label: 'Talk to the office' } }],
            paragraphs: [
              {
                text: 'We are a two-name firm in a one-square town, and we intend to stay both. Growth, for us, would mean listing houses we have not walked and sending strangers to viewings — the two things the whole reputation stands on not doing.',
              },
              {
                text: 'What we cover is the town and the five villages of the Vale: Steeple Vale, Lower Cray, Fenny Cross, Marle Hill, and Bell End Green. Beyond that we will name you the right firm rather than do a far-away job badly.',
              },
            ],
            title: 'A two-name firm, on purpose.',
          },
          id: 'who-we-are',
        },
        {
          /* The six people, on the deeper band. team-grid's tall portrait
           * plates are repainted by the theme as the six sash windows of 12
           * Sheep Street — pane grids with evening light, each lit a little
           * differently — because this concept fabricates no likenesses, and
           * six windows of one office says "six people, one address" better
           * than six grey rectangles. The twin hides roles behind a hover
           * translate; the theme pins them visible (zeroed --tw-translate-y,
           * opacity restored) so the static frame — what posters and
           * reduced-motion visitors get — is finished, and retires the
           * hover-only "Profile" affordance that would gesture at pages this
           * concept does not have. Iris's role, "Founder · Tuesdays", is the
           * fiction's best line — it must stay visible. */
          componentSlug: 'team-grid',
          content: {
            description:
              'The six of us. Whoever answers the phone can actually help — nobody here is a receptionist for somebody else.',
            eyebrow: 'The office',
            members: [
              { name: 'Nell Moorhouse', role: 'Partner · valuations' },
              { name: 'Davey Kent', role: 'Partner · the buyers’ book' },
              { name: 'Priya Ramanathan', role: 'Sales progression' },
              { name: 'Coll Fenwick', role: 'Viewings, town' },
              { name: 'Ash Beddow', role: 'Viewings, the Vale' },
              { name: 'Iris Moorhouse', role: 'Founder · Tuesdays' },
            ],
            title: 'Six people, one phone number.',
          },
          id: 'the-office',
          tone: 'muted',
        },
        {
          /* SWAPPED from content-community. Two reasons: the avatar strip
           * renders five empty circles this no-likeness concept cannot fill
           * with faces, and the town section deserved the concept's best
           * object instead — the window. content-image-frame's nested plates
           * become the shopfront at 12 Sheep Street: the outer plate painted
           * as the blue-framed window the Contact page already describes, the
           * inner plate as the card display itself — a grid of window cards,
           * each with its brick header band, spaced the way an assistant
           * lines them up on a Saturday morning. The copy folds the old
           * town paragraph into the window's discipline: the display changes
           * the morning a sale is agreed, so walking past it is reading the
           * market, not an advertisement. */
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'The window',
            paragraphs: [
              {
                text: 'The window between the bakery and the bank has carried the list since 1987, and it changes the morning a sale is agreed — walk past on a Saturday and you are reading the market, not an advertisement.',
              },
              {
                text: 'Most of our instructions still arrive on foot, from people we sold to a decade ago. That only happens in a town where the agent has to stand behind every card in that window at the market stall — which is exactly the discipline we would choose.',
              },
            ],
            title: 'Abbotsmoor keeps us honest.',
          },
          id: 'the-window',
        },
        {
          /* The wall — nine voices in a masonry of ruled cards, the proof
           * engine at full width. The mix is deliberate: sellers, buyers, a
           * first-time buyer walked through what a survey is, a quiet-sale
           * client, and Beatrix — the person the firm talked OUT of selling —
           * because an agent who argues against her own fee is the review
           * money cannot write. Roles pin each voice to a named street or
           * village so the wall reads as the town talking. */
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Nine, from the last few years — sellers, buyers, and the occasional person we talked out of selling at all.',
            eyebrow: 'The wall',
            items: [
              {
                author: 'Tomos Frayne',
                quote:
                  'Told us the real guide, not the flattering one, then beat it in eleven days. I have recommended them four times since and I am not done.',
                role: 'Sold on Ropewalk',
              },
              {
                author: 'Sable Okafor',
                quote:
                  'Rang us about the cottage before the board went up because Davey remembered three things we said in October. That notebook of his is worth more than every portal put together.',
                role: 'Bought in Steeple Vale',
              },
              {
                author: 'Gwen Applethwaite',
                quote:
                  'The chain broke twice and Priya rebuilt it twice, once on a Sunday. I never had to chase anyone — the Friday note always got there first.',
                role: 'Sold at Lower Cray',
              },
              {
                author: 'Wilf Marchbank',
                quote:
                  'They sold my house to the right people rather than the first people. There is a difference, and after forty-one years in a place you feel it.',
                role: 'Sold at Fenny Cross',
              },
              {
                author: 'Beatrix Hollander',
                quote:
                  'Nell told me not to sell — that the extension would suit us better than a move. An agent who argues against her own fee is an agent you use forever.',
                role: 'Still at Marle Hill, happily',
              },
              {
                author: 'Osian Pryce',
                quote:
                  'Every viewing was accompanied by someone who knew the house cold. The one question Coll could not answer, he rang me with by five the same day.',
                role: 'Bought on Priory Lane',
              },
              {
                author: 'Marnie Castellow',
                quote:
                  'First-time buyer, no chain, no clue. Ash walked me through what a survey actually is on the doorstep for twenty minutes. Nobody was earning anything from me that day.',
                role: 'Bought at Bell End Green',
              },
              {
                author: 'Reggie Dunmore',
                quote:
                  'The quiet sale did exactly what it promised: four viewings from the book, no board, no window, and the neighbours found out from me, not from a portal.',
                role: 'Sold on Priory Lane',
              },
              {
                author: 'Fern Ackerley',
                quote:
                  'We bought through them, sold through them nine years later, and the same person answered the phone both times. That is the whole review.',
                role: 'Twice over, Abbotsmoor',
              },
            ],
            title: 'What clients have said.',
          },
          id: 'what-clients-say',
        },
        {
          /* A conversational closer rather than the ruled appointment card —
           * this page courts nothing; it asks you to ring and name a house.
           * call-to-action-centered keeps it unboxed so the page ends on the
           * firm's voice, not on chrome. */
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Ring the office, ask for Nell or Davey, and tell us which house and which question. If the answer takes a walk-through, we will bring the tape measure.',
            links: [
              { link: { appearance: 'default', label: 'Talk to the office' } },
              { link: { appearance: 'outline', label: 'Homes for sale' } },
            ],
            title: 'Start with a conversation.',
          },
          id: 'cta',
        },
      ],
      title: 'Moorhouse & Kent — About the firm',
    },
    {
      description:
        'Every way to reach the office — the sales line, the book, the door on Sheep Street — and a form that routes to the right one of six people.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          /* The contact header keeps only one CTA (Homes for sale, outline)
           * because the page itself is the action — repeating "Book a
           * valuation" above a form that books valuations would be noise.
           * Proof chips carry the practical facts: hours and the address. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'One office, one number, six people who can all actually help. Weekdays nine to half five, Saturday mornings nine to one, and viewings whenever the light suits the house.',
            eyebrow: 'Contact',
            links: [{ link: { appearance: 'outline', label: 'Homes for sale' } }],
            proofItems: [
              { label: 'Weekdays 9–5:30' },
              { label: 'Saturdays 9–1' },
              { label: '12 Sheep Street' },
            ],
            title: 'Talk to the office.',
          },
          id: 'hero',
        },
        {
          /* The routing form — four channels ordered by urgency (the phone
           * first: the theme sets its number heavy and brick), each channel
           * card explaining who actually answers, because "whoever is nearest
           * the kettle" is worth more than a departments list. The form's
           * fields are the agent's real triage questions — which house,
           * selling or buying, what should happen next — and the submit
           * label posts it to the address rather than to a void. The theme
           * squares the panels, rules the field wells like a printed form,
           * and top-aligns the two columns so neither stretches into blank
           * paper. Phone and email stay inside the fiction ranges
           * (01632 96xxxx, .example). */
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'The main line, answered by whoever is nearest the kettle. Valuations, viewings, offers, and where-is-my-sale — all of it starts here.',
                label: 'Ring the office',
                value: '01632 960 233',
              },
              {
                description:
                  'For buyers: tell Davey the three things you cannot compromise on and go in the book. He rings, once, when it is actually right.',
                label: 'The buyers’ book',
                value: 'book@moorhouseandkent.example',
              },
              {
                description:
                  'Particulars, paperwork, and anything best put in writing. Read every morning before the phones go on.',
                label: 'Email',
                value: 'office@moorhouseandkent.example',
              },
              {
                description:
                  'The blue-framed window between the bakery and the bank. The window list is current — we change it the morning a sale is agreed.',
                label: 'The office',
                value: '12 Sheep Street, Abbotsmoor',
              },
            ],
            description:
              'Ring if it is about a viewing today or an offer — minutes matter for both. The form suits everything else, and it goes to a person, not a queue.',
            eyebrow: 'Contact',
            formConfigured: true,
            formDescription:
              'Tell us which house — yours or one of ours — and what you want to happen next. The right one of six people replies before the end of the next working day.',
            formLabels: [
              'Your name',
              'Phone',
              'The property',
              'Selling or buying?',
              'What should happen next',
            ],
            formTitle: 'Or put it in writing',
            submitLabel: 'Send it to Sheep Street',
            title: 'One number, six people.',
          },
          id: 'contact',
        },
        {
          /* The practical questions, split layout so the page ends compact:
           * headline and link left, answers right. These four are the
           * before-you-ring set — valuation lead time, viewing one of the
           * listed homes, how to make an offer (in writing, relayed the same
           * day, never answered with silence), and the coverage boundary
           * restated as a virtue. On the deeper band to close the page the
           * way the others close. */
          componentSlug: 'faq-split',
          content: {
            description: 'The practical ones, before you ring.',
            eyebrow: 'Practical',
            items: [
              {
                answer:
                  'Ring the office and we will usually have you walked through within the week — sooner if the house is empty. Evenings and Saturdays are fine; houses show best when you are not rushing out of them.',
                question: 'How soon can you value the house?',
              },
              {
                answer:
                  'Yes — ring or use the form and name the house. Viewings are accompanied and usually within two days; the light decides the hour more than the diary does.',
                question: 'Can I view one of the listed homes?',
              },
              {
                answer:
                  'In writing, always — email or the form — and we relay it to the seller the same day, with our honest read of where it stands. You will never learn your offer’s fate from silence.',
                question: 'How do I make an offer?',
              },
              {
                answer:
                  'We sell homes in Abbotsmoor and the five villages of the Vale, and nothing beyond it. Further out, we will name you the right local firm — being recommendable matters more than being everywhere.',
                question: 'Do you cover my village?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'More on selling' } }],
            title: 'Before you ring',
          },
          id: 'practical',
          tone: 'muted',
        },
      ],
      title: 'Moorhouse & Kent — Contact the office',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'real-estate-listing',
  status: 'concept',
  summary:
    'A fictional market-town estate agency built around the listing register — homes as cards, particulars as tables, and "just agreed" as the proof engine.',
  theme: {
    description:
      'Warm stone and slate ink with a brick-red accent — hairline rules, serif-italic ledger headings, and every image surface drawn as a surveyor’s artefact: floor plans, window grids, the ruled buyers’ book.',
    id: 'real-estate-listing',
    swatches: ['#f5f1ea', '#252a30', '#9c4a2f'],
  },
  title: 'Real Estate Listing',
  visualTone: ['Assured', 'Surveyed', 'Editorial'],
}
