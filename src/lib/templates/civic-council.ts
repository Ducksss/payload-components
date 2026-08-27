import type { TemplateShowcase } from './types'

/* Civic — "Marleford District Council", a fictional local council for the
 * fictional district of Marleford.
 *
 * WAVE 0 SKELETON — the recipe (pages, sections, tones) is frozen; the copy
 * below is a coherent first draft the art-direction wave replaces. Do not ship
 * this file without that pass.
 *
 * Register this concept must own (uncovered by the other fourteen): the
 * plain-language public-service register. No marketing voice at all: short
 * sentences, verbs first, tasks before institutions, reading age kept low on
 * purpose. The information architecture is top-task design — the home page is
 * a front desk, not a brochure — and the design challenge is making that
 * plainness handsome rather than bare.
 *
 * Canonical facts, kept consistent across every page: the district is the
 * town of Marleford plus the villages of Netherfield, Combe Ash, Priors Halt,
 * and Whitmoor; just under forty thousand residents; 36 elected members
 * listed by ward, never by party; the council meets in public on the first
 * Tuesday of each month at the Guildhall on Bridge Street, and minutes are
 * published within five working days; one phone line, 01632 960 700, open
 * 8:30 to 5 on weekdays; the Guildhall has step-free access from Bridge
 * Street and a hearing loop at every desk; a reported pothole gets a fix date
 * within two working days and the median fix is nine days.
 *
 * Everything is fictional: the district, every village, street, councillor,
 * ward, meeting, and figure. No real statute, regulator, ombudsman, or
 * national scheme is named or invented — obligations are stated as "council
 * policy". Emergency guidance stays generic ("contact your local emergency
 * number"). The phone number sits inside the 01632 96xxxx fiction range;
 * email uses the reserved `.example` domain.
 *
 * There are NO currency amounts anywhere. A council solves this the way its
 * own letters do: council tax is discussed as bands set each March and looked
 * up by street, charges are "listed on the booking page", and help is "means
 * checked, ask us". All copy stays editor-shaped (demo-content types); layout
 * belongs to the twins and the Marleford shell and theme. */

export const civicCouncilTemplate: TemplateShowcase = {
  assets: [],
  category: 'civic',
  description:
    'Marleford District Council is a fictional local authority for a fictional district of just under forty thousand people: one phone line, a Guildhall on Bridge Street, and a website that is a front desk rather than a brochure. The concept owns the plain-language public-service register — short sentences, verbs first, top tasks before institutions — across five pages: Home, Services, Report a problem, The council, and Contact, with reporting a problem as the task everything else defers to. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Report a problem', path: 'report' },
    { label: 'The council', path: 'council' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description:
        'The front desk: the six tasks people come for, this month’s notices, and the year’s work counted honestly.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'This site is for doing things: report a problem, find your bin day, book the recycling centre, see what the council decided. If you get stuck, ring 01632 960 700 — a person answers, weekdays 8:30 to 5.',
            eyebrow: 'Marleford District Council',
            links: [
              { link: { appearance: 'default', label: 'Report a problem' } },
              { link: { appearance: 'outline', label: 'Find a service' } },
            ],
            proofItems: [
              { label: 'Phone answered 8:30–5' },
              { label: 'Fix dates within two working days' },
              { label: 'Minutes public in five days' },
            ],
            title: 'What do you need to do today?',
          },
          id: 'front-desk',
        },
        {
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'The six things most people come here to do. Each one states what you need before you start and how long it takes.',
            eyebrow: 'Do it now',
            items: [
              {
                description:
                  'Potholes, broken street lights, fly-tipping, and blocked drains. You get a reference and a fix date within two working days.',
                icon: 'zap',
                title: 'Report a problem',
              },
              {
                description:
                  'Collection days by street, what goes in which bin, and what to do when a collection is missed.',
                icon: 'database',
                title: 'Find your bin day',
              },
              {
                description:
                  'The recycling centre at Whitmoor Lane runs on booked slots. Booking takes two minutes and the next free slots are shown first.',
                icon: 'id-card',
                title: 'Book the recycling centre',
              },
              {
                description:
                  'Applications near you, listed by street and ward, with the date comments close on each one.',
                icon: 'chart',
                title: 'See planning notices',
              },
              {
                description:
                  'Bands are set each March. Look up your band by street, and ask us about help — support is means checked and the form is short.',
                icon: 'shield',
                title: 'Council tax and help',
              },
              {
                description:
                  'Every meeting is public. See what is on the agenda before it happens and what was decided within five working days after.',
                icon: 'fingerprint',
                title: 'See what was decided',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'All services' } }],
            title: 'Six tasks, stated plainly.',
          },
          id: 'top-tasks',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'This month',
            paragraphs: [
              {
                text: 'Notices are listed newest first and written in plain words. If a notice affects your street, the dates are in the first line, not the last.',
              },
            ],
            rows: [
              {
                description:
                  'Bridge Street closes to through traffic for resurfacing from the 4th to the 8th. Buses divert via Rope Walk; the Guildhall stays open on foot.',
                title: 'Bridge Street roadworks, 4th–8th',
              },
              {
                description:
                  'The draft plan for the old maltings site is open for comments until the 26th. Read it online or on paper at the Guildhall and the Netherfield library.',
                title: 'Maltings site: comments open until the 26th',
              },
              {
                description:
                  'From the 1st, the recycling centre moves to winter hours: 8 to 4, last entry half past 3. Booked slots are unaffected.',
                title: 'Recycling centre winter hours from the 1st',
              },
            ],
            title: 'Notices, newest first.',
          },
          id: 'this-month',
          tone: 'muted',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'From the residents’ panel',
            body: 'The panel is sixty residents drawn by lot each year. Their job is to tell us where the words are unclear and the numbers are hiding — this page exists because they asked for it.',
            description:
              'The year’s work, counted the way residents asked us to count it: fixed things, honest medians, and the one number we are still not happy with.',
            eyebrow: 'The year, counted',
            metrics: [
              { label: 'problems reported and given a fix date', value: '4,180' },
              { label: 'days, the median pothole fix', value: '9' },
              { label: 'bin collections made', value: '1.9m' },
              { label: 'missed collections per thousand', value: '4' },
            ],
            quote:
              'What changed my mind was the fix date. You report the pothole, you get a date, and the date is usually kept. It stopped feeling like posting into a void, and that is worth more than any leaflet.',
            role: 'Panel member, Combe Ash',
            title: 'The year, counted honestly.',
          },
          id: 'the-report',
          tone: 'contrast',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description:
              'The questions the phone line answers most, saved here so you do not have to queue for them.',
            eyebrow: 'Asked most',
            items: [
              {
                answer:
                  'Put your street into the bin day lookup, or ring us. If a collection was missed, report it by the end of the next working day and the crew comes back within two.',
                question: 'When is my bin day?',
              },
              {
                answer:
                  'Report it online with a photo if you can. You get a reference at once and a fix date within two working days — the date is a promise, not an estimate.',
                question: 'How do I report a pothole?',
              },
              {
                answer:
                  'Bands are set each March. Look yours up by street on the council tax page, and if paying is hard, ask about help — support is means checked and the form takes ten minutes.',
                question: 'What is my council tax band?',
              },
              {
                answer:
                  'Yes. Every meeting is public, the agenda is published a week before, and you can ask a question by writing to the clerk three working days ahead.',
                question: 'Can I attend a council meeting?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Contact us' } }],
            title: 'Asked most, answered plainly',
          },
          id: 'asked-most',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Ring 01632 960 700, weekdays 8:30 to 5. A person answers, and if it is not our job they will tell you whose job it is.',
            links: [
              { link: { appearance: 'default', label: 'Report a problem' } },
              { link: { appearance: 'outline', label: 'Contact us' } },
            ],
            title: 'Stuck? Ring us.',
          },
          id: 'cant-find',
        },
      ],
      title: 'Marleford District Council — What do you need to do?',
    },
    {
      description:
        'Every service in plain words: the big six in detail, what goes in which bin, collection days by area, and the questions grouped by service.',
      label: 'Services',
      path: 'services',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Every service, written so you can act on it: what it is, what you need before you start, and how long it takes. No service needs an account to read about.',
            eyebrow: 'Services',
            links: [
              { link: { appearance: 'default', label: 'Report a problem' } },
              { link: { appearance: 'outline', label: 'Contact us' } },
            ],
            proofItems: [
              { label: 'Plain words, checked yearly' },
              { label: 'Paper versions at the Guildhall' },
              { label: 'Interpreters on request' },
            ],
            title: 'Every service, in plain words.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The big six',
            features: [
              {
                description:
                  'Household collections weekly and fortnightly by bin, missed collections put right within two working days, and assisted collections if you cannot move the bin — ask once, it is noted for good.',
                title: 'Bins and recycling',
              },
              {
                description:
                  'Roads, pavements, street lights, and drains. Report a fault and you get a reference and a fix date; gritting runs on the published routes when frost is forecast.',
                title: 'Streets and lights',
              },
              {
                description:
                  'Six parks, the riverside path, and the Whitmoor woods. Book pitches and the bandstand online; report damage the same way you report a pothole.',
                title: 'Parks and open spaces',
              },
              {
                description:
                  'Applications listed by street with plain-language summaries. Comment windows are stated on every notice, and comments can be made online, on paper, or in person.',
                title: 'Planning',
              },
              {
                description:
                  'Bands set each March, looked up by street. Help with paying is means checked; the form is short and the answer comes within ten working days.',
                title: 'Council tax',
              },
              {
                description:
                  'The register office at the Guildhall handles births, deaths, and ceremonies, by appointment. Certificates are posted within five working days.',
                title: 'The register office',
              },
            ],
            paragraphs: [
              {
                text: 'The six services nearly every household uses, described in full on their own pages. The numbers below hold across all of them.',
              },
            ],
            stats: [
              { label: 'working days to a fix date, any report', value: '2' },
              { label: 'working days to published minutes', value: '5' },
              { label: 'weekday hours the phone is answered', value: '8:30–5' },
              { label: 'cost to read, comment, or attend', value: 'None' },
            ],
            title: 'The big six.',
          },
          id: 'the-big-six',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'The bins, exactly',
            paragraphs: [
              {
                text: 'The question the phone line hears most, answered exactly. When in doubt, leave it out — a wrong item in the green bin spoils the load for the street.',
              },
            ],
            rows: [
              {
                description:
                  'Food scraps, garden cuttings, and nothing in a bag. Collected weekly, all year, including the weeks after public holidays — one day late those weeks, never skipped.',
                title: 'The green bin — food and garden',
              },
              {
                description:
                  'Paper, card, tins, and rinsed glass, loose. No film, no polystyrene, no soft plastics — those go to the carrier-bag point at any supermarket in the district.',
                title: 'The blue bin — recycling',
              },
              {
                description:
                  'Everything else, bagged. Collected fortnightly, opposite weeks to the blue bin. If the lid does not close, book a bulky collection instead of stacking beside it.',
                title: 'The grey bin — everything else',
              },
            ],
            title: 'What goes in which bin.',
          },
          id: 'the-bins',
          tone: 'muted',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'Collection days by area. Weeks alternate blue and grey; the lookup on this page tells your street its week.',
            features: [
              {
                feature: 'Green bin (weekly)',
                values: [{ label: 'Tuesday' }, { label: 'Wednesday' }, { label: 'Thursday' }],
              },
              {
                feature: 'Blue bin (alternate weeks)',
                values: [{ label: 'Friday' }, { label: 'Monday' }, { label: 'Tuesday' }],
              },
              {
                feature: 'Grey bin (alternate weeks)',
                values: [{ label: 'Friday' }, { label: 'Monday' }, { label: 'Tuesday' }],
              },
              {
                feature: 'Assisted collections',
                values: [{ included: true }, { included: true }, { included: true }],
              },
            ],
            plans: [
              { name: 'Marleford town' },
              { name: 'Netherfield & Combe Ash' },
              { name: 'Priors Halt & Whitmoor' },
            ],
            title: 'Collection days by area.',
          },
          id: 'bin-days',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description: 'Grouped by service, worded the way people actually ask.',
            eyebrow: 'Service questions',
            groups: [
              {
                icon: 'truck',
                items: [
                  {
                    answer:
                      'Report it by the end of the next working day and the crew returns within two. No need to leave the bin out — the report tells them where it is.',
                    question: 'My bin was missed. What now?',
                  },
                  {
                    answer:
                      'Book a bulky collection online — dates are shown before you commit, and charges are listed plainly on the booking page before you confirm anything.',
                    question: 'How do I get rid of a sofa?',
                  },
                ],
                title: 'Bins and recycling',
              },
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'Two working days to a fix date for anything reported, and the median pothole is fixed in nine. Dangerous faults are made safe first, usually the same day.',
                    question: 'How fast are street faults fixed?',
                  },
                  {
                    answer:
                      'The published routes are gritted when frost is forecast by the county weather service. Your street’s route is on the gritting map, updated each autumn.',
                    question: 'When is my road gritted?',
                  },
                ],
                title: 'Streets',
              },
              {
                icon: 'help-circle',
                items: [
                  {
                    answer:
                      'Comment online, on paper at the Guildhall or the Netherfield library, or in person at the planning desk on Thursday mornings. All three count equally.',
                    question: 'How do I comment on a planning application?',
                  },
                  {
                    answer:
                      'Ask us — support with council tax is means checked, the form takes about ten minutes, and the answer comes within ten working days. Asking changes nothing about your current bill.',
                    question: 'I am struggling to pay. What help is there?',
                  },
                ],
                title: 'Planning and council tax',
              },
            ],
            title: 'Asked by service.',
          },
          id: 'service-questions',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'If a page did not answer you, that is a fault in the page. Tell us and we will fix the words the way we fix the potholes.',
            links: [
              { link: { appearance: 'default', label: 'Report a problem' } },
              { link: { appearance: 'outline', label: 'Contact us' } },
            ],
            title: 'Did this page work?',
          },
          id: 'report',
        },
      ],
      title: 'Marleford District Council — Services',
    },
    {
      description:
        'The task the site is built around: report a fault, get a reference and a fix date, and see what was fixed near you last month.',
      label: 'Report a problem',
      path: 'report',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Potholes, street lights, fly-tipping, blocked drains, missed bins, park damage. Reporting takes about three minutes and you get a reference at once and a fix date within two working days.',
            eyebrow: 'Report a problem',
            links: [
              { link: { appearance: 'default', label: 'Start a report' } },
              { link: { appearance: 'outline', label: 'What happens next' } },
            ],
            proofItems: [
              { label: 'Reference at once' },
              { label: 'Fix date in two working days' },
              { label: 'A photo helps, not required' },
            ],
            title: 'Tell us what’s broken.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'The whole journey of a report, stated up front so the reference in your inbox means something.',
            eyebrow: 'What happens',
            items: [
              {
                description:
                  'Say what you found and where — a street name and a landmark is enough, a photo is better. You get a reference number on the spot.',
                title: 'You report it',
              },
              {
                description:
                  'An inspector grades it within two working days and you get a fix date by email. Dangerous faults are made safe first, usually the same day.',
                title: 'We grade it and give you a date',
              },
              {
                description:
                  'The crew fixes it, the reference closes, and you are told. If a date moves, you hear why before it moves, not after.',
                title: 'It gets fixed, and you hear',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Start a report' } }],
            title: 'Report. Date. Fixed.',
          },
          id: 'what-happens',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'For danger right now — a fallen tree across a road, a gas smell, flooding into homes — contact your local emergency number first, then tell us.',
                label: 'If it is dangerous now',
                value: 'Emergency services first',
              },
              {
                description:
                  'Weekdays 8:30 to 5. The same reporting form, filled in with you by a person — nothing online-only lives here.',
                label: 'Ring the line',
                value: '01632 960 700',
              },
              {
                description:
                  'Reports with photographs attached are graded fastest. One report per problem helps the crews more than one report per neighbour.',
                label: 'Email',
                value: 'report@marleford.example',
              },
            ],
            description:
              'The form is the fastest route — it goes straight to the grading queue. Ring if you would rather a person filled it in with you.',
            eyebrow: 'Start a report',
            formConfigured: true,
            formDescription:
              'Say what you found, where it is, and how to reach you for the fix date. A photo helps the inspector grade it right first time.',
            formLabels: [
              'What have you found?',
              'Where is it?',
              'Your name',
              'Email for the fix date',
              'Anything else we should know',
            ],
            formTitle: 'Report a problem',
            submitLabel: 'Send the report',
            title: 'Three minutes, one reference.',
          },
          id: 'report-form',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Fixed lately',
            features: [
              {
                description:
                  'Resurfaced end to end after the winter, eleven days from the first report to the roller leaving.',
                title: 'Rope Walk, Marleford',
              },
              {
                description:
                  'Four lights out on the school route, reported by three households, all four lit again inside a week.',
                title: 'Church Lane, Netherfield',
              },
              {
                description:
                  'Fly-tipping at the layby cleared within two days, and the camera the panel asked for is now up.',
                title: 'Whitmoor Lane layby',
              },
              {
                description:
                  'The blocked culvert that flooded the path every autumn was rebuilt, not rodded — the path stayed dry through the storms.',
                title: 'Riverside path, Combe Ash',
              },
            ],
            paragraphs: [
              {
                text: 'What reporting produced near you last month. References close only when the fix is real — a patched pothole that fails within a year reopens the original reference, not a new one.',
              },
            ],
            stats: [
              { label: 'reports closed last month', value: '341' },
              { label: 'days, the median fix', value: '9' },
              { label: 'fix dates kept', value: '9 in 10' },
              { label: 'reopened under the one-year rule', value: '12' },
            ],
            title: 'What reporting fixed near you.',
          },
          id: 'fixed-lately',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'About reporting itself.',
            eyebrow: 'Reporting questions',
            items: [
              {
                answer:
                  'No. A street name and a landmark is enough — the inspector finds it. An account is never needed to report; the email is only for sending you the fix date.',
                question: 'Do I need an exact address or an account?',
              },
              {
                answer:
                  'Look it up with your reference on this page, or ring and read the reference to us. Either route shows the same grading and the same date.',
                question: 'How do I check on a report?',
              },
              {
                answer:
                  'Report it again quoting the old reference. Under the one-year rule it reopens the original — the crew that did it comes back, and the fix is on them, not on the queue.',
                question: 'What if the fix does not hold?',
              },
              {
                answer:
                  'Private land is its owner’s job, but report it anyway — we will tell you who owns it and write to them ourselves if it affects the street.',
                question: 'What about problems on private land?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'All services' } }],
            title: 'About reporting',
          },
          id: 'reporting-questions',
        },
      ],
      title: 'Marleford District Council — Report a problem',
    },
    {
      description:
        'Who decides and how to watch them do it: the members by ward, the meetings, and the plain-words promise the whole site is written under.',
      label: 'The council',
      path: 'council',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Thirty-six elected members, listed by the ward that elected them. Every decision is made in a public meeting at the Guildhall, and the minutes are published within five working days.',
            eyebrow: 'The council',
            links: [
              { link: { appearance: 'default', label: 'Attend a meeting' } },
              { link: { appearance: 'outline', label: 'Contact the clerk' } },
            ],
            proofItems: [
              { label: '36 members, by ward' },
              { label: 'Meetings public, first Tuesday' },
              { label: 'Minutes in five working days' },
            ],
            title: 'Who decides, in public.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'How it works',
            links: [{ link: { appearance: 'outline', label: 'See the meetings' } }],
            paragraphs: [
              {
                text: 'The full council meets in public on the first Tuesday of every month at the Guildhall, at half past six so working people can come. The agenda is published a week ahead, in plain words, with the officer’s recommendation stated on every item.',
              },
              {
                text: 'Anyone who lives in the district can ask a question at a full council meeting: write to the clerk three working days ahead and you get five minutes and a written answer. Committees for planning and services meet in the weeks between, publicly, on the same terms.',
              },
            ],
            title: 'First Tuesday, half past six, in public.',
          },
          id: 'how-it-works',
        },
        {
          componentSlug: 'team-roster',
          content: {
            description:
              'Members are listed by ward, not by party — you are represented by where you live. Full lists and surgery times are on each ward’s page.',
            eyebrow: 'The members',
            groups: [
              {
                label: 'Marleford town wards',
                members: [
                  { name: 'Cllr Edie Stanhope', role: 'Bridge ward' },
                  { name: 'Cllr Rafiq Mansour', role: 'Market ward' },
                  { name: 'Cllr June Ockenden', role: 'Riverside ward' },
                  { name: 'Cllr Petra Ilić', role: 'Station ward' },
                ],
              },
              {
                label: 'Village wards',
                members: [
                  { name: 'Cllr Tom Harrap', role: 'Netherfield' },
                  { name: 'Cllr Vida Osei', role: 'Combe Ash' },
                  { name: 'Cllr Stan Prewitt', role: 'Priors Halt' },
                  { name: 'Cllr Meg Ainsworth', role: 'Whitmoor' },
                ],
              },
            ],
            title: 'Thirty-six members, eight wards.',
          },
          id: 'members',
          tone: 'muted',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Meetings',
            paragraphs: [
              {
                text: 'The next three public meetings. Agendas are published a week ahead; papers are online and on paper at the Guildhall desk.',
              },
            ],
            rows: [
              {
                description:
                  'The Guildhall, half past six. Includes the maltings site consultation results and the winter gritting routes.',
                title: 'Full council — first Tuesday',
              },
              {
                description:
                  'The Guildhall committee room, ten in the morning. Twelve applications, four with public speakers registered.',
                title: 'Planning committee — second Thursday',
              },
              {
                description:
                  'The Guildhall committee room, half past six. The bin round review and the parks winter programme.',
                title: 'Services committee — third Tuesday',
              },
            ],
            title: 'The next three meetings.',
          },
          id: 'meetings',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Cllr Edie Stanhope, leader of the council',
            eyebrow: 'The plain-words promise',
            paragraphs: [
              {
                text: 'Every page on this site is checked once a year by the residents’ panel for words that hide meaning. Where they find any, the page is rewritten. This is council policy, minuted, and it applies to the leader’s own column first.',
              },
            ],
            quote:
              'If a resident has to read a sentence twice, the sentence has failed, not the resident. We fix unclear pages the way we fix potholes: reported, dated, done.',
            title: 'Plain words are policy.',
          },
          id: 'the-promise',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'About the council itself.',
            eyebrow: 'Council questions',
            items: [
              {
                answer:
                  'Just turn up — the public gallery is step-free and no notice is needed to watch. To speak, write to the clerk three working days ahead.',
                question: 'Can I attend without asking first?',
              },
              {
                answer:
                  'Within five working days, in plain words, with every vote recorded by name. Older minutes are searchable back to the year the Guildhall opened.',
                question: 'When are minutes published?',
              },
              {
                answer:
                  'Every member holds a monthly surgery in their ward — times are on the ward pages — and all of them answer email. Write to the clerk if you are not sure whose ward you are in.',
                question: 'How do I meet my councillor?',
              },
              {
                answer:
                  'Members are listed by ward because that is who they answer to. How each member votes is in the minutes, by name, on every decision.',
                question: 'Why are no parties shown?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Contact the clerk' } }],
            title: 'About the council',
          },
          id: 'council-questions',
        },
      ],
      title: 'Marleford District Council — The council',
    },
    {
      description:
        'Every way to reach the council, what the Guildhall offers in person, and the access commitments stated plainly.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'One phone line, one email, one building. The phone is answered by a person weekdays 8:30 to 5, and the Guildhall desk is open the same hours plus Saturday morning.',
            eyebrow: 'Contact',
            links: [{ link: { appearance: 'outline', label: 'Report a problem' } }],
            proofItems: [
              { label: 'Weekdays 8:30–5' },
              { label: 'Saturday desk 9–12' },
              { label: 'Step-free from Bridge Street' },
            ],
            title: 'Reach the council.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'A person answers, weekdays 8:30 to 5. If your question belongs to the county or the water company, we say so and give you the right number.',
                label: 'Ring the council',
                value: '01632 960 700',
              },
              {
                description:
                  'For anything that suits writing. Answered within three working days, in plain words, by the service that owns the answer.',
                label: 'Email',
                value: 'hello@marleford.example',
              },
              {
                description:
                  'Questions for meetings, requests to speak, and anything for the members. Three working days’ notice gets you on the agenda.',
                label: 'The clerk',
                value: 'clerk@marleford.example',
              },
              {
                description:
                  'The desk handles everything the site does, on paper, with a person. Step-free from Bridge Street, hearing loop at every counter.',
                label: 'The Guildhall',
                value: 'Bridge Street, Marleford',
              },
            ],
            description:
              'Ring for anything urgent. The form suits everything else and goes to the service that owns the answer, not a general inbox.',
            eyebrow: 'Contact',
            formConfigured: true,
            formDescription:
              'Say what you need and how to reach you. If it is about a report you already made, include the reference and it joins that file.',
            formLabels: [
              'Your name',
              'How to reach you',
              'Which service is this about?',
              'Your reference, if you have one',
              'What do you need?',
            ],
            formTitle: 'Write to the council',
            submitLabel: 'Send it to the right desk',
            title: 'One line, one desk, one door.',
          },
          id: 'contact',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Access',
            links: [{ link: { appearance: 'outline', label: 'The council' } }],
            paragraphs: [
              {
                text: 'The Guildhall is step-free from Bridge Street, with a hearing loop at every desk and a quiet room you can ask for without explaining why. Blue badge spaces are directly outside, and the public gallery lift is signed from the door.',
              },
              {
                text: 'Everything on this site exists on paper at the desk, and in large print on request. If English is not your first language, ring and we will arrange an interpreter for any appointment — allow three working days.',
              },
            ],
            title: 'The Guildhall is built to be used.',
          },
          id: 'access',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'Before you get in touch.',
            eyebrow: 'Practical',
            items: [
              {
                answer:
                  'Phone and desk queues are shortest before ten. Tuesday mornings are busiest — that is bin day in town, and the two facts are not unrelated.',
                question: 'When is the quietest time to ring?',
              },
              {
                answer:
                  'Three working days for email and the form, with the reference number in the first reply. Anything with a legal clock on it states its own deadline on its page.',
                question: 'How fast are written answers?',
              },
              {
                answer:
                  'Yes — the desk does everything the site does, on paper, with a person, no appointment needed. Saturday mornings included.',
                question: 'Can I do all of this in person?',
              },
              {
                answer:
                  'Tell us the page and what confused you — the plain-words promise means unclear pages are faults, and they get references and fix dates like any other fault.',
                question: 'A page did not make sense. Who do I tell?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'All services' } }],
            title: 'Before you get in touch',
          },
          id: 'practical',
        },
      ],
      title: 'Marleford District Council — Contact',
    },
  ],
  revision: 1,
  schemaVersion: 1,
  slug: 'civic-council',
  status: 'concept',
  summary:
    'A fictional district council in the plain-language public-service register — top-task design, verbs first, and a front desk instead of a brochure.',
  theme: {
    description:
      'Paper white and near-black ink with one civic teal — thick task rules, heavy clear type, prominent focus states, and no decoration that does not help someone finish a task.',
    id: 'civic-council',
    swatches: ['#ffffff', '#0f1214', '#11705f'],
  },
  title: 'Civic Council',
  visualTone: ['Plain-language', 'Task-first', 'Institutional'],
}
