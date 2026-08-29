import type { TemplateShowcase } from './types'

/* Music — "Pale Meridian", a fictional four-piece band on tour behind their
 * fourth record, "Sodium Lights".
 *
 * Art direction: the gig poster — the gallery's flyposted dark. Sodium-lamp
 * amber on near-black indigo, bone-white type, heavy tight-set headlines,
 * ticket-perforation rules, and every image surface token-derived (wet walls,
 * blind-slat light, painted record sleeves — no raster assets, no likenesses).
 * Deliberately NOT the gallery's other dark: Frameworks '26 (event-conference)
 * is institutional and lanyarded — electric violet, monospace track labels, a
 * printed programme. Pale Meridian is flyposted and personality-led — amber
 * sticker eyebrows, a tour-date table, one zine pull quote, and a band who
 * write their own letters.
 *
 * The register this concept owns: nocturnal, loud, human. The information
 * architecture is a date table and a discography; the one recurring action is
 * joining the mailing list ("the letters") — the band's own channel, warm and
 * plain-spoken, never funnel-shaped.
 *
 *   Home     the poster wall: the record, the next four nights, one clipping,
 *            a letter excerpt, and the list
 *   Tour     the working heart: every night of the autumn run as a date
 *            table, the road ledger, and the before-doors questions
 *   Music    the discography as four token-drawn sleeves, the liner-note
 *            story, where to listen, and the clippings wall
 *   About    the room above the laundrette: the story, the six faces, the
 *            wall, and the scene
 *   Contact  four channels that all reach a person, and the form that goes up
 *            the stairs
 *
 * Canonical facts, kept consistent across every page: four members — Vesper
 * Lindqvist (voice, guitar), Row Okafor (bass), Juno Marsh (drums), Kit
 * Aldercott (keys, tape loops); formed nine years ago above a laundrette on
 * Meridian Street in Fennworth, which named the band; four records — Meridian
 * Street, Passing Places, The Slow Hours, Sodium Lights — all on their own
 * label, Laundrette Tapes; the autumn tour runs eighteen nights, Old Casino
 * open most of them, strings on the seated nights; Mabel Finch manages them;
 * Dot Szabó does front of house.
 *
 * Everything is fictional: the band, the members, the label, the support act,
 * the venues, the cities, the zines and radio shows quoted, and every figure.
 * No charting body, awards show, streaming platform, performing-rights
 * society, or real publication is named or invented as an authority — press
 * quotes come from explicitly invented zines and the copy says so on the
 * surface. Tickets are always "from each venue's own box office" — this site
 * sells nothing. Email uses the reserved `.example` domain. There are NO
 * currency amounts anywhere; records are "at the shows", "on the shelf at the
 * label", or "wherever you listen". All copy stays editor-shaped
 * (demo-content types); layout belongs to the twins and to the Pale Meridian
 * shell and theme. */

export const musicArtistTemplate: TemplateShowcase = {
  assets: [],
  category: 'music',
  description:
    'Pale Meridian is a fictional four-piece touring behind their fourth record, Sodium Lights, on their own label out of the laundrette that named them. The concept owns the gig-poster register — sodium-lamp amber on near-black indigo, bone-white type, flyposted and personality-led — across five pages: Home, Tour, Music, About, and Contact, with the tour-date table as the working heart of the site and the mailing list as the band’s own channel. Every image surface is token-derived, from the blind-slat light on the record sleeve to the lamp-lit stage doors in the date table. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Tour', path: 'tour' },
    { label: 'Music', path: 'music' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'The poster wall: the new record, the next four nights, one zine clipping, a letter from the band, and the list — everything they would staple to a lamppost.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The flypost. hero-kinetic's letterbox still and marquee diamonds
           * mix from --brand, tuned in theme.css to sodium amber — the plate
           * is repainted as the lit stage door of a small venue and the
           * marquee reads as the tour route chalked along the poster's foot.
           * All eleven cities of the run ride the marquee, so the home page
           * carries the whole tour before the fold. The word cascade lands on
           * "autumn." in the accent slot — kept serif italic and painted
           * amber-bright, the one scrawled word on a heavy-set poster. CTAs
           * map to real routes: tour and music. */
          componentSlug: 'hero-kinetic',
          content: {
            description:
              'The fourth Pale Meridian record, out now on Laundrette Tapes — eleven songs about streetlights, night buses, and staying. On tour with it all autumn: eighteen nights, no two setlists the same.',
            eyebrow: 'Pale Meridian · Sodium Lights',
            imageCaption:
              'The stage door at the Trades Hall, half past ten. Someone’s coat still on stage.',
            links: [
              { link: { appearance: 'default', label: 'See the tour dates' } },
              { link: { appearance: 'outline', label: 'Hear the record' } },
            ],
            marqueeItems: [
              { label: 'Harbourfield' },
              { label: 'Millbrook' },
              { label: 'Doverline' },
              { label: 'Cranner’s Cross' },
              { label: 'Ostergate' },
              { label: 'Fennworth' },
              { label: 'Bellcaster' },
              { label: 'Marrowgate' },
              { label: 'Thurnbridge' },
              { label: 'Aldenholt' },
              { label: 'Grayswick' },
            ],
            proofItems: [
              { label: 'Sodium Lights, out now' },
              { label: 'Eighteen nights this autumn' },
              { label: 'On Laundrette Tapes' },
            ],
            title: 'Sodium Lights. On tour all autumn.',
          },
          id: 'marquee-hero',
        },
        {
          /* The record, on the deepest band. The 16/7 plate is repainted in
           * theme.css as the Sodium Lights sleeve itself — sodium light
           * through a venetian blind, the exact scene the liner notes
           * describe — and the same recipe paints the fourth sleeve in the
           * Music page's discography, so the record keeps one face
           * everywhere it appears. */
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'The record',
            links: [{ link: { appearance: 'default', label: 'Hear the record' } }],
            paragraphs: [
              {
                text: 'Sodium Lights was recorded in eleven nights in the room above the laundrette, mostly live, with the tumble driers going under everything — listen for them under the third song, because they are there.',
              },
              {
                text: 'It is the first one Kit produced, the first with strings, and the last, Vesper says, about the street. Eleven songs. The vinyl is at the shows and on the shelf at the label.',
              },
            ],
            title: 'Eleven songs, eleven nights.',
          },
          id: 'the-record',
          tone: 'contrast',
        },
        {
          /* The signature move: content-rows restyled from a media list into
           * a tour poster's date block — small venue-stamp plates, uppercase
           * city names, hairline rules, tight tabular rhythm (see the
           * date-table rules in theme.css). Four nights only; the full run
           * lives on the tour page this section points to. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Next up',
            paragraphs: [
              {
                text: 'The next four nights of the autumn tour. Tickets come from each venue’s own box office — the full run is on the tour page.',
              },
            ],
            rows: [
              {
                description: 'Friday 3 October — The Corn Store, with Old Casino opening.',
                title: 'Harbourfield',
              },
              {
                description: 'Saturday 4 October — Yardhouse. The one with the pipe organ.',
                title: 'Millbrook',
              },
              {
                description:
                  'Tuesday 7 October — The Lantern Rooms, seated night, strings with us.',
                title: 'Doverline',
              },
              {
                description:
                  'Thursday 9 October — Kessler’s Yard, under the arches, outdoors if it holds.',
                title: 'Cranner’s Cross',
              },
            ],
            title: 'The next four nights.',
          },
          id: 'dates-soon',
        },
        {
          /* One zine clipping, set as a serif pull quote on a raised band —
           * a poster quotes one review, not a wall of them (the wall lives on
           * the Music page). The quote credits an explicitly invented zine,
           * named as fictional in its own role line. */
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'The Night Bus',
              quote:
                'Somewhere in the second half of Sodium Lights the band stop performing the songs and start living in them, driers and all. The best thing they have done, and the first one that sounds like the room it was made in.',
              role: 'Issue 44, a fictional zine',
            },
          },
          id: 'press',
          tone: 'muted',
        },
        {
          /* SWAPPED from logo-cloud-inline-wrap. The strip's marks are fixed,
           * shared demo lockups that read as invented tech companies — the
           * wrong register for a band — and a "played this year at" wall
           * skirts inventing festival authorities, which the fiction rules
           * ban. What a band actually posts between the dates and the list is
           * its own voice, so this is a letter excerpt instead: content-quote
           * with the plate painted as the lit window above the laundrette,
           * teeing up the signup band directly below. logoLabel is
           * deliberately omitted — a letter is signed by a person, not a
           * lockup. */
          componentSlug: 'content-quote',
          content: {
            citation: 'Vesper Lindqvist, from letter eighty-four',
            eyebrow: 'The letters',
            paragraphs: [
              {
                text: 'The letters are the band’s own channel — where we are playing, what we are listening to, and the early versions before anyone else hears them. Written at the same table the label is run from, and answered, slowly, by Vesper.',
              },
            ],
            quote:
              'The van has a new door and Juno has a new snare, and only one of those was planned. Doverline — we are bringing the strings, so wear whatever you can sit still in.',
            title: 'Typed above the laundrette, once a month.',
          },
          id: 'the-letters',
        },
        {
          /* The recurring action. Every signup band in this concept sits on
           * the same stage-door tone (contrast), so "the letters" keep one
           * recognisable face across the site. Warm and human, never
           * funnel-shaped: what you get, how often, and nothing else. */
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'One letter a month from Vesper, typed above the laundrette: where we are playing, what we are listening to, and the songs before anyone else hears them. No noise in between.',
            emailPlaceholder: 'you@thenightbus.example',
            submitLabel: 'Join the list',
            title: 'Get the letters.',
          },
          id: 'mailing-list',
          tone: 'contrast',
        },
      ],
      title: 'Pale Meridian — Sodium Lights, out now',
    },
    {
      description:
        'The working heart of the site: every night of the autumn run as a date table, the road ledger, and the questions people ask before doors.',
      label: 'Tour',
      path: 'tour',
      sections: [
        {
          /* Interior pages open on hero-basic styled as a poster header: one
           * sodium wash from the top corner, an amber sticker eyebrow, and
           * proof chips restyled as perforated ticket stubs. The description
           * carries the concept's ticket rule — the venue's own box office,
           * never us — stated the way a band would actually word the
           * warning. */
          componentSlug: 'hero-basic',
          content: {
            description:
              'Eighteen nights behind Sodium Lights, small rooms on purpose. Tickets come from each venue’s own box office, never from us — if a page asks you for more than the venue does, it is not ours.',
            eyebrow: 'Autumn tour',
            links: [
              { link: { appearance: 'default', label: 'Join the mailing list' } },
              { link: { appearance: 'outline', label: 'Hear the record' } },
            ],
            proofItems: [
              { label: 'Eighteen nights' },
              { label: 'Old Casino opens most of them' },
              { label: 'Strings on the seated nights' },
            ],
            title: 'On the road this autumn.',
          },
          id: 'hero',
        },
        {
          /* The date table proper — the concept's signature IA move. Each row
           * is one night: uppercase city, one line of venue detail, and a
           * small stamp plate lit from a different angle per row so the
           * column reads as six different doors rather than one repeated
           * tile (per-row lamp variables in theme.css). */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'October',
            paragraphs: [
              {
                text: 'The first leg. Doors at eight except where the venue says otherwise; Old Casino open every night this month.',
              },
            ],
            rows: [
              { description: 'Fri 3 — The Corn Store. With Old Casino.', title: 'Harbourfield' },
              { description: 'Sat 4 — Yardhouse. The pipe-organ room.', title: 'Millbrook' },
              {
                description: 'Tue 7 — The Lantern Rooms. Seated, with strings.',
                title: 'Doverline',
              },
              {
                description: 'Thu 9 — Kessler’s Yard. Under the arches.',
                title: 'Cranner’s Cross',
              },
              {
                description: 'Fri 10 — The Bathing House. Sold out, returns only.',
                title: 'Ostergate',
              },
              { description: 'Sat 11 — Trades Hall. The hometown one.', title: 'Fennworth' },
            ],
            title: 'The October leg.',
          },
          id: 'october-leg',
        },
        {
          /* The second leg on a raised band, so the two months read as two
           * sheets pasted one over the other rather than one twelve-row
           * table. Same date-block styling as October. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'November',
            paragraphs: [
              {
                text: 'The second leg, colder and further north. Two seated nights with the string quartet; bring whoever you bring to the quiet ones.',
              },
            ],
            rows: [
              { description: 'Thu 6 — The Old Meal Market.', title: 'Bellcaster' },
              { description: 'Fri 7 — Wintergarden. Seated, with strings.', title: 'Marrowgate' },
              { description: 'Sat 8 — The Glassworks. With Old Casino.', title: 'Thurnbridge' },
              { description: 'Wed 12 — Cooper’s Hall. Seated, with strings.', title: 'Aldenholt' },
              {
                description: 'Fri 14 — The Boiler Yard. Last night, long setlist.',
                title: 'Grayswick',
              },
            ],
            title: 'The November leg.',
          },
          id: 'november-leg',
          tone: 'muted',
        },
        {
          /* The one metrics band a band can honestly have: counted from the
           * van, and the copy says so. The numerals get poster weight in
           * theme.css; the quote panel carries the label's lockup (logoLabel)
           * restyled as a small tracked stamp — the only place the "brand"
           * speaks on the whole site; everywhere else, people do. */
          componentSlug: 'stats-proof',
          content: {
            author: 'Mabel Finch',
            body: 'The van is the same van. The rooms stay small because the songs are small, and the setlist changes because Juno gets bored. None of this is strategy; it is just how the band works.',
            description:
              'Nine years of touring, counted from the van. The numbers are illustrative, like everything else here, but the shape of them is true.',
            eyebrow: 'The road ledger',
            logoLabel: 'LAUNDRETTE TAPES',
            metrics: [
              { label: 'nights this autumn', value: '18' },
              { label: 'different songs played last tour', value: '41' },
              { label: 'years in the same van', value: '9' },
              { label: 'setlists repeated, ever', value: '0' },
            ],
            quote:
              'I have managed them nine years and I still cannot tell you what they will open with. What I can tell you is the van leaves on time, the support gets a proper soundcheck, and nobody has ever been turned away for a coat.',
            role: 'Manager, Pale Meridian',
            title: 'Small rooms, long nights.',
          },
          id: 'road-ledger',
          tone: 'contrast',
        },
        {
          /* Before-doors practicalities, answered in the band's own voice —
           * including the earplugs answer, because a loud band that cares is
           * exactly the register this concept sells. */
          componentSlug: 'faq-card',
          content: {
            description: 'Asked before doors, most nights.',
            eyebrow: 'Show questions',
            items: [
              {
                answer:
                  'From each venue’s own box office, in person or on their page. We list the venue, you take it from there — we never sell tickets ourselves.',
                question: 'Where do tickets come from?',
              },
              {
                answer:
                  'Doors at eight, Old Casino at half past, us around half nine, done by eleven except the last night of a leg, which historically gets away from us.',
                question: 'What time does everything happen?',
              },
              {
                answer:
                  'The seated nights — Doverline, Marrowgate, Aldenholt — are the quiet ones with the string quartet. Everything else is standing and loud. Both are the real band.',
                question: 'What are the seated nights?',
              },
              {
                answer:
                  'Yes — earplugs free at the merch table every night, and the seated shows are the gentler pick. Kids are welcome wherever the venue says they are.',
                question: 'Anything for quieter ears?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Ask us anything' } }],
            title: 'Before doors',
          },
          id: 'show-questions',
        },
        {
          /* The list, argued from the tour page's own angle: dates change,
           * and the letters hear first. Centered CTA rather than the signup
           * band so the page closes on a pointer, not a second form. */
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Dates change the way weather changes. The list hears first — venue swaps, added nights, and the returns line for the sold-out rooms.',
            links: [
              { link: { appearance: 'default', label: 'Join the mailing list' } },
              { link: { appearance: 'outline', label: 'Hear the record' } },
            ],
            title: 'The list hears first.',
          },
          id: 'list-cta',
        },
      ],
      title: 'Pale Meridian — Tour dates',
    },
    {
      description:
        'The discography: four records in order as painted sleeves, the liner-note story of the new one, and where each of them lives.',
      label: 'Music',
      path: 'music',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Four records in nine years, all on Laundrette Tapes, all recorded within a mile of the laundrette. The songs got quieter as the amps got better, which nobody predicted.',
            eyebrow: 'The records',
            links: [
              { link: { appearance: 'default', label: 'Join the mailing list' } },
              { link: { appearance: 'outline', label: 'See the tour dates' } },
            ],
            proofItems: [
              { label: 'Four records' },
              { label: 'One label, our own' },
              { label: 'All recorded off Meridian Street' },
            ],
            title: 'The records, in order.',
          },
          id: 'hero',
        },
        {
          /* The discography as objects: content-rows' 4/3 plates squared into
           * record sleeves, each painted a different token-derived cover in
           * theme.css — a diagonal amber slash for the loud debut, road
           * dashes for the van record, a near-dark plate with one pale disc
           * for The Slow Hours, and the venetian-blind light for Sodium
           * Lights (the same recipe as the home page's billboard, so the new
           * record keeps its face). Oldest first, because that is the order
           * the street heard them. */
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Discography',
            paragraphs: [
              {
                text: 'Oldest first, because that is the order the street heard them. The vinyl for all four is at the shows and on the shelf at the label.',
              },
            ],
            rows: [
              {
                description:
                  'The first one: nine songs recorded in six days, drums in the stairwell. Rough, hopeful, and still the loudest thing we have made.',
                title: 'Meridian Street (their first)',
              },
              {
                description:
                  'The one written in the van. Ten songs about other people’s towns, with the first of Kit’s tape loops holding the seams together.',
                title: 'Passing Places',
              },
              {
                description:
                  'The quiet one. Made in a winter when nobody was sure the band would keep going; it is why the band kept going.',
                title: 'The Slow Hours',
              },
              {
                description:
                  'The new one: eleven songs, strings, the driers underneath. The first record that sounds like the room it was made in.',
                title: 'Sodium Lights (the new one)',
              },
            ],
            title: 'Four records, nine years.',
          },
          id: 'the-records',
        },
        {
          /* The liner notes, on the stage-door band. The 4/3 plate takes the
           * default wet-wall recipe with the lamp pulled low — the room above
           * the laundrette at four in the morning, which is where the quote
           * says the title track was cut. */
          componentSlug: 'content-quote',
          content: {
            citation: 'Vesper Lindqvist, from the liner notes',
            eyebrow: 'Liner notes',
            paragraphs: [
              {
                text: 'The title track was cut once, live, at four in the morning, with the streetlight doing through the blind exactly what it does on the cover. Nobody would let anybody fix the bass note in the second verse. It is the band’s favourite mistake to date.',
              },
            ],
            quote:
              'We kept trying to record the songs somewhere better, and the songs kept sounding worse. So we carried everything back up the stairs, put the microphones where the damp had been, and got it in one take with the driers going. Home won.',
            title: 'The room won.',
          },
          id: 'liner-notes',
          tone: 'contrast',
        },
        {
          /* Where to listen, without naming a platform: integration-cluster
           * renders anonymous icon tiles (no service names), which is exactly
           * as specific as the fiction rules allow — and honestly as specific
           * as a band's "everywhere" claim ever is. The centre tile glows
           * amber in theme.css: the record, surrounded by places it lives. */
          componentSlug: 'integration-cluster',
          content: {
            heading: 'Wherever you listen, we are there.',
            links: [{ link: { appearance: 'outline', label: 'Join the mailing list' } }],
            subtext:
              'All four records live on the listening services you already use, and the vinyl lives at the shows. The letters carry the early versions nothing else gets.',
          },
          id: 'listen',
          tone: 'muted',
        },
        {
          /* The clippings wall — the masonry testimonial wall as a corkboard
           * of cut-out reviews. Every publication is invented and the intro
           * line says so out loud, which is both the safety rule and a joke
           * the register can afford. */
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'What the zines and the late shows said — every publication here is as invented as the band.',
            eyebrow: 'Clippings',
            items: [
              {
                author: 'The Night Bus',
                quote:
                  'The best thing they have done, and the first one that sounds like the room it was made in. The driers deserve a credit.',
                role: 'Issue 44',
              },
              {
                author: 'Corrugated',
                quote:
                  'Four records in and Pale Meridian still write like the last bus is coming. Sodium Lights is the sound of deciding not to run for it.',
                role: 'Autumn print edition',
              },
              {
                author: 'The Small Hours, community radio',
                quote:
                  'We played the title track three nights running and the phone lines did the rest. A record for everyone who has ever loved a street.',
                role: 'Presenter’s pick',
              },
              {
                author: 'Margin Notes',
                quote:
                  'The Slow Hours was the sound of a band saving itself. Sodium Lights is what it saved. The strings on the seated nights will take your knees.',
                role: 'Live review, The Lantern Rooms',
              },
              {
                author: 'Flyover',
                quote:
                  'Juno Marsh remains the most interesting drummer in this scene — playing the songs, not the kit, and grinning about it.',
                role: 'Scene report',
              },
              {
                author: 'The Kettle Pages',
                quote:
                  'Passing Places turned five this year and still smells of the van. That is a compliment. It has always been a compliment.',
                role: 'Anniversary piece',
              },
            ],
            title: 'What got written.',
          },
          id: 'clippings',
        },
        {
          /* The letters again, argued from the music page's angle: demos and
           * early versions. Same stage-door band as every signup. */
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'Demos, early versions, and the songs that never make the records go to the list first — usually with a note from whoever wrote them explaining what went wrong.',
            emailPlaceholder: 'you@thenightbus.example',
            submitLabel: 'Join the list',
            title: 'Hear the early versions.',
          },
          id: 'mailing-list',
          tone: 'contrast',
        },
      ],
      title: 'Pale Meridian — The records',
    },
    {
      description:
        'The band above the laundrette: who the four of them are, how nine years happened, and the street the whole thing is named after.',
      label: 'About',
      path: 'about',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Pale Meridian formed nine years ago in the practice room above the laundrette on Meridian Street, and never really left it. Four people, four records, one van, and a label run off the same kitchen table.',
            eyebrow: 'About',
            links: [
              { link: { appearance: 'default', label: 'See the tour dates' } },
              { link: { appearance: 'outline', label: 'Hear the records' } },
            ],
            proofItems: [
              { label: 'Formed nine years ago' },
              { label: 'Above the laundrette' },
              { label: 'Label of our own' },
            ],
            title: 'The band above the laundrette.',
          },
          id: 'hero',
        },
        {
          /* The origin story in two paragraphs, with the one detail that does
           * the work of a whole biography: Mrs Okonkwo, the only critic the
           * band is afraid of. Personality-led is the register — the copy
           * carries it, the layout stays plain. */
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'The story',
            links: [{ link: { appearance: 'outline', label: 'Ask us anything' } }],
            paragraphs: [
              {
                text: 'The room came first. Row found it — above the laundrette, cheap because of the noise, perfect because of the noise — and the band assembled around it the way bands do: a flatmate, a flatmate’s cousin, and the drummer from the pub quiz team.',
              },
              {
                text: 'Nine years later the rent has tripled and nobody will move. The driers are on every record. The laundrette’s owner, Mrs Okonkwo, has heard every song first for nine years and remains the only critic the band is afraid of.',
              },
            ],
            title: 'The room came first.',
          },
          id: 'the-story',
        },
        {
          /* team-grid pins its hover-revealed roles visible in theme.css (the
           * roles ARE the content on a band page — and in every static
           * capture), keeps the "Profile" affordance hidden because no member
           * routes exist, and shortens the portrait plates into six lamp-lit
           * doorway portraits, no two lit alike. Six on the grid: the four of
           * them plus the two the title says matter. */
          componentSlug: 'team-grid',
          content: {
            description:
              'The four of us, plus the two people without whom the four of us would still be arguing in a stairwell.',
            eyebrow: 'The band',
            members: [
              { name: 'Vesper Lindqvist', role: 'Voice, guitar, the letters' },
              { name: 'Row Okafor', role: 'Bass, the van' },
              { name: 'Juno Marsh', role: 'Drums, the setlist' },
              { name: 'Kit Aldercott', role: 'Keys, tape loops, production' },
              { name: 'Mabel Finch', role: 'Manager, Laundrette Tapes' },
              { name: 'Dot Szabó', role: 'Front of house, every night' },
            ],
            title: 'Four, plus the two that matter.',
          },
          id: 'the-band',
          tone: 'muted',
        },
        {
          /* content-image-frame's nested plates become the flyposted wall
           * itself in theme.css: the outer mount is the wet wall with two
           * older posters ghosting through the paste, and the inner print is
           * the practice-room wall under its lamp — nine years of laminates
           * and setlists as one warm rectangle of light. */
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'The wall',
            paragraphs: [
              {
                text: 'The practice-room wall is nine years of tour laminates, water-damaged setlists, and photographs nobody remembers taking. When a record is finished, one object from the sessions goes on the wall and never comes down.',
              },
              {
                text: 'For Sodium Lights it was the blind from the window on the cover. The room is darker now, which everybody agrees is somehow correct.',
              },
            ],
            title: 'Nine years on one wall.',
          },
          id: 'the-wall',
        },
        {
          /* The scene, credited by name: the support act, the zines, the
           * list. The avatar row is repainted in theme.css as a string of
           * warm lamps rather than portrait discs — no likenesses, and a
           * better metaphor anyway. */
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Vesper Lindqvist' },
              { name: 'Row Okafor' },
              { name: 'Juno Marsh' },
              { name: 'Kit Aldercott' },
              { name: 'Mabel Finch' },
            ],
            eyebrow: 'The scene',
            paragraphs: [
              {
                text: 'Nobody does this alone. Old Casino open most of our nights because they should be headlining their own; the zines wrote about us when nobody else would; and the list — the letters — is the nearest thing the band has to a hometown that travels.',
              },
            ],
            title: 'The scene is the point.',
          },
          id: 'the-scene',
        },
        {
          /* Booking, on the stage-door band, boxed like a notice pinned to
           * the door — the panel gets an amber tape-edge in theme.css. One
           * route: everything goes through Mabel. */
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Booking, press, and the label all go through Mabel — one email, read every morning, answered in the order it deserves rather than the order it arrived.',
            links: [
              { link: { appearance: 'default', label: 'Booking & press' } },
              { link: { appearance: 'outline', label: 'See the tour dates' } },
            ],
            title: 'Want the band for something?',
          },
          id: 'booking-cta',
          tone: 'contrast',
        },
      ],
      title: 'Pale Meridian — About the band',
    },
    {
      description:
        'Booking, press, the label, and the letters — four channels, each read by an actual person, and a form for whatever does not fit.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Everything reaches a person. Mabel reads booking and press over breakfast, the label post gets opened on Fridays, and Vesper answers the letters — slowly, but always.',
            eyebrow: 'Contact',
            links: [{ link: { appearance: 'outline', label: 'See the tour dates' } }],
            proofItems: [
              { label: 'Read by people, not queues' },
              { label: 'Booking via Mabel' },
              { label: 'Letters answered, slowly' },
            ],
            title: 'Write to the band.',
          },
          id: 'hero',
        },
        {
          /* Four channels, four humans, each with the detail that proves a
           * person reads it (demos get listened to in the van on Fridays).
           * The lead channel's amber address is the one place amber appears
           * as body-adjacent text — amber-bright in theme.css, measured AA on
           * the night base. The submit label is the best line on the page and
           * earns the filled button. */
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Shows, festivals, and the seated-night string configuration. Tell Mabel the room, the date, and what the night is — she answers within the week.',
                label: 'Booking',
                value: 'mabel@laundrettetapes.example',
              },
              {
                description:
                  'Interviews, photographs, and the press notes for Sodium Lights. Zines get answered first; that is policy, not accident.',
                label: 'Press',
                value: 'press@laundrettetapes.example',
              },
              {
                description:
                  'The label: vinyl for shops, trades with other small labels, and demos — yes, we listen to all of them, on Fridays, in the van.',
                label: 'Laundrette Tapes',
                value: 'shelf@laundrettetapes.example',
              },
              {
                description:
                  'Anything else — song questions, the driers, whether the coat on stage at Harbourfield was yours. It goes to the whole band.',
                label: 'The band',
                value: 'hello@palemeridian.example',
              },
            ],
            description:
              'Pick the channel and it reaches the right person first try. If none of them fit, the form below goes to Mabel, who has seen everything and is surprised by nothing.',
            eyebrow: 'Contact',
            formConfigured: true,
            formDescription:
              'Say who you are, what it is about, and — if it is a show — the room and the date. Mabel replies within the week; the band replies when the van has wifi.',
            formLabels: [
              'Your name',
              'Email',
              'What is this about?',
              'If it is a show: the room',
              'The details',
            ],
            formTitle: 'Or use the form',
            submitLabel: 'Send it up the stairs',
            title: 'Four channels, all human.',
          },
          id: 'booking',
        },
        {
          /* The pre-writing questions, split layout so the answers read as a
           * notice pinned beside the form. The licensing answer ("we have
           * said yes to strange things and no to sensible ones") carries the
           * band's whole decision process in one line. */
          componentSlug: 'faq-split',
          content: {
            description: 'Asked often enough to write down.',
            eyebrow: 'Practical',
            items: [
              {
                answer:
                  'Yes, if the room is right — we still love the tiny ones, and the strings travel lighter than you would think. Tell Mabel the capacity and the neighbours’ tolerance and she will be straight with you.',
                question: 'Will you play our venue or festival?',
              },
              {
                answer:
                  'Send them to the label address. Everything gets listened to in the van on Fridays, and if we love it we say so out loud — two of the bands on Laundrette Tapes arrived exactly this way.',
                question: 'Can I send you our demos?',
              },
              {
                answer:
                  'For films and suchlike, ask Mabel with the scene attached — the answer depends entirely on what the song would be doing in it. We have said yes to strange things and no to sensible ones.',
                question: 'Can we use a song in something?',
              },
              {
                answer:
                  'The letters. One a month, typed above the laundrette, with the early versions attached. It is the only place the band talks first — everything else, including this page, hears it second.',
                question: 'What is the best way to follow the band?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Hear the records' } }],
            title: 'Before you write',
          },
          id: 'practical',
          tone: 'muted',
        },
        {
          /* The letters close the contact page too — with the exit stated up
           * front, because a channel you can leave without hard feelings is
           * the whole difference between a letter and a funnel. */
          componentSlug: 'call-to-action-signup',
          content: {
            description:
              'One letter a month, no noise in between, and the early versions before anyone else. Leaving takes one click and no hard feelings — Vesper has said so in print.',
            emailPlaceholder: 'you@thenightbus.example',
            submitLabel: 'Join the list',
            title: 'Or just get the letters.',
          },
          id: 'mailing-list',
          tone: 'contrast',
        },
      ],
      title: 'Pale Meridian — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'music-artist',
  status: 'concept',
  summary:
    'A fictional four-piece on tour behind their fourth record — the gig-poster register, built around a tour-date table, a discography of painted sleeves, and a mailing list called the letters.',
  theme: {
    description:
      'Sodium-lamp amber on near-black indigo with bone-white type — flyposted, nocturnal, and analog, like a poster wheat-pasted to a wet wall outside the venue.',
    id: 'music-artist',
    swatches: ['#14121d', '#f0ece0', '#e8a13a'],
  },
  title: 'Music Artist',
  visualTone: ['Nocturnal', 'Flyposted', 'Analog'],
}
