import type { TemplateShowcase } from './types'

/* Northfield School (education-course) — a fictional school of practical
 * typography, invented for this concept.
 *
 * The distinguishing feature of this concept is its INFORMATION ARCHITECTURE.
 * Nothing else in the gallery has a syllabus shape, so the recipe is read as one:
 *
 *   feature-steps    → the MODULE LADDER. Six modules, numbered, in the order
 *                      they must be taken. Restyled by theme.css from a card
 *                      grid into a single hairline-ruled column with the numeral
 *                      in the gutter, so it reads as a syllabus rather than a
 *                      feature grid. It appears twice on purpose: terse on the
 *                      home page, fully written out on the curriculum page, with
 *                      identical module titles both times.
 *   content-rows     → the LESSONS inside a module, counter-numbered by
 *                      theme.css into a handout list.
 *   content-columns  → the PREREQUISITES, marked up as a checklist.
 *   comparator-table → the three COHORT OPTIONS (schedule, pace, feedback
 *                      depth), never feature tiers.
 *
 * Tone is the third structural device: `base` is plain chalk paper, `muted` is
 * ruled worksheet paper (every structured, sequential section sits on it), and
 * `contrast` is the chalkboard the figures are written up on.
 *
 * Copy constraints that are load-bearing, not stylistic:
 *   · No literal currency amounts anywhere — a preview-surface guard scans for
 *     price strings. Commitment is expressed as scope and cadence instead: the
 *     large figure slot on a pricing card carries "One module" / "Six modules" /
 *     "Two terms", and fees are described by how they are paid, never how much.
 *   · The school awards nothing but its own certificate of completion, and says
 *     so plainly. No accreditation body, no university affiliation, no named
 *     awarding institution is invented.
 *   · Every person, employer, figure, and term date below is fictional. */

const modulePassFeaturesHome = [
  'Any single module, taken in sequence',
  'Two tutor critiques on your own work',
  'The full handout set for that module',
  'Carry on to the next module when you are ready',
]

const fullCohortFeaturesHome = [
  'All six modules in order, across one term',
  'A fixed critique group of nine',
  'Two tutor critiques in every module',
  'Saturday studio access for the whole term',
  'The school’s own certificate of completion',
]

const studioYearFeaturesHome = [
  'The full cohort, then a second term of studio work',
  'A named mentor for the whole year',
  'A portfolio review at the end of each term',
  'A standing place in the graduate critique',
]

export const educationCourseTemplate: TemplateShowcase = {
  assets: [],
  category: 'education',
  description:
    'Northfield School is a fictional school of practical typography — ink on chalk with one highlighter accent, and an information architecture nothing else in the gallery has. A numbered module ladder carries the syllabus, content rows carry the lessons inside a module, a marked-up checklist carries the prerequisites, and the comparator matrix compares cohort schedules rather than feature tiers. Five pages, composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Curriculum', path: 'curriculum' },
    { label: 'Instructors', path: 'instructors' },
    { label: 'Outcomes', path: 'outcomes' },
    { label: 'Enroll', path: 'enroll' },
  ],
  pages: [
    {
      description:
        'Opens on the prospectus, shows the six-module ladder at a glance, puts the school’s record up on the board, and closes on enrolment.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-product-tilt',
          content: {
            description:
              'Northfield is a small school for people who already set type at work and suspect they are guessing. Six modules, taken in sequence across one term: drawing letters by hand, spacing them, and setting them on a page — each module critiqued twice by people who do this for a living.',
            eyebrow: 'Practical typography · since 2012',
            imageCaption:
              'The Northfield prospectus — module ladder, term timetable, and the first week of sheets.',
            links: [
              { link: { appearance: 'default', label: 'Read the curriculum' } },
              { link: { appearance: 'outline', label: 'Enroll' } },
            ],
            proofItems: [
              { label: 'Six modules, in order' },
              { label: 'Groups of nine' },
              { label: 'Evenings or Saturdays' },
              { label: 'Michaelmas opens 5 October' },
            ],
            title: 'Typography, taught in the order it has to be learned.',
          },
          id: 'prospectus',
        },
        {
          componentSlug: 'logo-cloud-inline-wrap',
          content: { heading: 'Graduates now set type at' },
          id: 'where-grads-work',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'Each module assumes the one before it. You cannot space letters you have not drawn, and you cannot set a page you cannot space — so they are taught in that order, and nobody is waved past a module they have not done.',
            eyebrow: 'The syllabus · six modules',
            items: [
              {
                description:
                  'Weeks 1–3 · Draw the Latin lowercase by hand until the stem weight stops wandering.',
                title: 'Letterforms and the hand',
              },
              {
                description:
                  'Weeks 4–7 · Fit letters into words, and words into a line that reads at a glance.',
                title: 'Spacing, fitting, and the word',
              },
              {
                description:
                  'Weeks 8–11 · Measure, leading, and the grey of a paragraph judged from across the room.',
                title: 'The text block',
              },
              {
                description:
                  'Weeks 12–14 · Decide what is read first, then prove it with size, weight, and space.',
                title: 'Hierarchy and reading order',
              },
              {
                description:
                  'Weeks 15–18 · Build a structure that survives sixty pages and three other people.',
                title: 'The grid, across many pages',
              },
              {
                description:
                  'Weeks 19–22 · Set type for a measure you do not control, and test it on real devices.',
                title: 'Type on screens',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Read the curriculum' } }],
            title: 'Six modules, and the order is the point.',
          },
          id: 'module-ladder',
          tone: 'muted',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'Coursework',
            features: [
              {
                description: 'Broad-nib and pencil exercises from Module one, kept in your folder.',
                title: 'Drawn sheets',
              },
              {
                description: 'One line, reworked until the spacing stops arguing with itself.',
                title: 'A specimen line',
              },
              {
                description: 'The same four hundred words, set seven ways, defended once.',
                title: 'A typeset spread',
              },
              {
                description: 'Short, printed and sewn in the workshop downstairs.',
                title: 'A bound book',
              },
            ],
            paragraphs: [
              {
                text: 'Every module ends in something physical: drawn letters, a specimen line, a typeset spread, a bound book. It goes on the wall, gets read by eight other people, and comes back to you with notes in the margin.',
              },
              {
                text: 'The archive downstairs holds every final sheet the school has taken in since 2012. Students are welcome to work through it, and most of them do.',
              },
            ],
            title: 'You leave with sheets, not slides.',
          },
          id: 'what-you-make',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Rosalind Ekwueme',
            body: 'We do not publish placement rates as a promise. A school can teach you to space a line; it cannot make anyone hire you.',
            description:
              'Figures the school keeps because prospective students ask for them, written up at the end of each term.',
            eyebrow: 'The record',
            metrics: [
              { label: 'weeks from the first letter to the final critique', value: '22' },
              { label: 'people in a critique group, at most', value: '9' },
              { label: 'years teaching the same six modules', value: '14' },
              { label: 'student sheets in the school archive', value: '1,180' },
            ],
            quote:
              'I arrived able to pick a typeface and unable to say why. I left able to set a book — and, far more useful, able to explain every decision to a client who disagreed with me.',
            role: 'Full cohort, 2024 · now type director at Meridian Press',
            title: 'Twenty-two weeks, and what comes out of them.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Peter Aylward',
              quote:
                'The critique is the course. Everything else is preparation for standing next to your own work while eight people read it slowly.',
              role: 'Evening cohort, 2023 · in-house design lead',
            },
          },
          id: 'student-voice',
        },
        {
          componentSlug: 'pricing-cards-muted',
          content: {
            description:
              'The syllabus and its order are identical in all three. What changes is how much of it you commit to at once.',
            eyebrow: 'Enrolment',
            plans: [
              {
                description: 'Paid per module, in sequence.',
                features: modulePassFeaturesHome,
                link: { appearance: 'outline', label: 'Enroll' },
                name: 'Module pass',
                period: '· four weeks',
                price: 'One module',
              },
              {
                description: 'The whole course, one cohort, start to finish.',
                featured: true,
                features: fullCohortFeaturesHome,
                link: { appearance: 'default', label: 'Enroll' },
                name: 'Full cohort',
                period: '· one term',
                price: 'Six modules',
              },
              {
                description: 'For people rebuilding a practice.',
                features: studioYearFeaturesHome,
                link: { appearance: 'outline', label: 'Enroll' },
                name: 'Studio year',
                period: '· plus mentoring',
                price: 'Two terms',
              },
            ],
            title: 'Three ways to take the six modules.',
          },
          id: 'tuition',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'Short answers. The longer ones are on the enrolment page.',
            eyebrow: 'Before you ask',
            items: [
              {
                answer:
                  'No, but you should already be setting type as part of your work — documents, decks, web pages, anything. The course assumes you have made typographic decisions and been unsure about them.',
                question: 'Do I need to be a designer?',
              },
              {
                answer:
                  'No. We use whatever you already use, and several exercises are on paper. Software changes; the reasons do not.',
                question: 'Is there a software module?',
              },
              {
                answer:
                  'Only after a conversation. Module three assumes Module two in a way that is not negotiable, and people who skip usually come back.',
                question: 'Can I start at a later module?',
              },
              {
                answer:
                  'Every session is recorded and every handout is posted to you. A critique cannot be caught up, so you take the next one instead.',
                question: 'What if I miss a session?',
              },
              {
                answer:
                  'Fees are identical across the three cohorts and are set out in full on the enrolment form we send you. You can settle module by module or for the whole term.',
                question: 'How are fees handled?',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Enroll' } }],
            title: 'The questions we get every term.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Nine places to a critique group, and the evening cohort usually fills first. The curriculum is worth reading before you commit — it is the whole course, in order, with nothing held back.',
            links: [
              { link: { appearance: 'default', label: 'Enroll' } },
              { link: { appearance: 'outline', label: 'Read the curriculum' } },
            ],
            title: 'The Michaelmas cohort opens on 5 October.',
          },
          id: 'cta',
        },
      ],
      title: 'Northfield School — Typography, taught in order',
    },
    {
      description:
        'The full syllabus: the six modules in order, the shape of a single lesson inside one of them, and what you need before Module one.',
      label: 'Curriculum',
      path: 'curriculum',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Six modules across twenty-two weeks. Each one assumes the one before it, each one ends in something you made, and each one is critiqued twice before it closes.',
            eyebrow: 'Curriculum · Michaelmas term',
            links: [{ link: { appearance: 'default', label: 'Enroll' } }],
            proofItems: [
              { label: '22 weeks' },
              { label: 'Six modules' },
              { label: 'Two critiques each' },
              { label: 'Groups of nine' },
            ],
            title: 'The whole syllabus, in the order you take it.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'The same six modules as the home page, written out. Titles and order never change between cohorts or terms — only the timetable does.',
            eyebrow: 'The ladder · module one to six',
            items: [
              {
                description:
                  'Weeks 1–3 · Two sessions a week at the bench. Anatomy, stroke order, and the broad-nib exercises that make the Latin lowercase make sense. You leave with a sheet of your own letters, critiqued twice, and a vocabulary for talking about shape.',
                title: 'Letterforms and the hand',
              },
              {
                description:
                  'Weeks 4–7 · The module people call the hard one. Fitting, sidebearings, kerning by eye, and the difference between spacing a word and spacing a line. Assessed on one specimen line, reworked until it stops arguing with itself.',
                title: 'Spacing, fitting, and the word',
              },
              {
                description:
                  'Weeks 8–11 · Measure, leading, alignment, and the grey value of a paragraph judged from across the room. You typeset the same four hundred words seven times and defend the version you keep.',
                title: 'The text block',
              },
              {
                description:
                  'Weeks 12–14 · Establishing what is read first, second, and never — with size, weight, position, and space rather than colour. The brief is one dense page of information, set twice, for two different readers.',
                title: 'Hierarchy and reading order',
              },
              {
                description:
                  'Weeks 15–18 · Baseline grids, columns, modules, and the discipline of holding a structure across sixty pages and three collaborators. The brief is a short book, printed and sewn in the workshop.',
                title: 'The grid, across many pages',
              },
              {
                description:
                  'Weeks 19–22 · Setting for a measure you do not control: fluid type scales, real device testing, and the small mercies of good defaults. The final critique is the whole term on the wall at once.',
                title: 'Type on screens',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Enroll' } }],
            title: 'The six modules, written out in full.',
          },
          id: 'modules',
          tone: 'muted',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Inside a module · one lesson',
            paragraphs: [
              {
                text: 'Every module runs the same four movements, twice a week for the evening cohort and once for the weekend one. The shape matters more than the topic: you watch someone competent make a decision, you make the same decision badly, and then the room tells you why.',
              },
              {
                text: 'Nothing here is a lecture. If a session has slides at all, it has fewer than five.',
              },
            ],
            rows: [
              {
                description:
                  'Ten minutes, by hand, before anything else — the same letter fifty times until the stem weight stops wandering. Nobody enjoys the first fortnight of this.',
                title: 'Warm-up: fifty n’s',
              },
              {
                description:
                  'A tutor sets the same problem in front of you and talks through every decision, including the ones they reject. You keep the sheet they made while they were talking.',
                title: 'Demonstration at the bench',
              },
              {
                description:
                  'Ninety minutes on your own brief with two tutors moving between desks. Questions get answered at your desk rather than from the front of the room.',
                title: 'Your turn, on paper',
              },
              {
                description:
                  'Work goes on the wall unsigned. The group reads it before anyone is allowed to defend it, and you leave with written notes for your folder.',
                title: 'Critique, out loud',
              },
            ],
            title: 'What one lesson actually looks like.',
          },
          id: 'lessons',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Prerequisites',
            links: [{ link: { appearance: 'outline', label: 'Enroll' } }],
            paragraphs: [
              {
                text: 'A pencil, a steel ruler, and a scalpel. The school supplies paper, nibs, ink, and a flat surface; you bring the three things that should be yours.',
              },
              {
                text: 'Some experience setting type at work. A year of laying out documents, decks, or web pages is plenty. We do not teach software, and there is no software module.',
              },
              {
                text: 'Two clear evenings a week, or one clear Saturday, for twenty-two weeks. People who try to fit this around a deadline-heavy term usually defer, and we would much rather they defer early.',
              },
              {
                text: 'A tolerance for being told your work is not finished. Everything here is critiqued in a room with other people in it. That is the school, not a feature of it.',
              },
            ],
            title: 'What you need before Module one.',
          },
          id: 'prerequisites',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description: 'The order, the workload, and what happens when life intervenes.',
            eyebrow: 'About the syllabus',
            items: [
              {
                answer:
                  'Because each module is the vocabulary for the next one. Spacing makes no sense until you have drawn the letters, and a grid makes no sense until you have set a paragraph you are willing to defend.',
                question: 'Why is the order fixed?',
              },
              {
                answer:
                  'Two to four hours a week, most of it drawing or setting rather than reading. Module five, the book, is heavier for about a fortnight.',
                question: 'How much work is there outside sessions?',
              },
              {
                answer:
                  'Six books, and we do not pretend anyone reads all six. Two of them sit in the studio in multiple copies for exactly that reason.',
                question: 'Is the reading list long?',
              },
              {
                answer:
                  'Work goes up unsigned. The group reads it, then the maker speaks, then a tutor. Nobody is graded and everybody is written up.',
                question: 'What happens in a critique?',
              },
              {
                answer:
                  'Yes. Plenty of people take Module one and come back a year later for two and three. The sequence waits for you.',
                question: 'Can I take one module and stop?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Enroll' } }],
            title: 'Questions about the six modules.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'The syllabus does not change between cohorts. All you are choosing is when you meet and how the critique reaches you.',
            links: [
              { link: { appearance: 'default', label: 'Enroll' } },
              { link: { appearance: 'outline', label: 'Meet the instructors' } },
            ],
            title: 'Read it, then come and draw fifty n’s.',
          },
          id: 'cta',
        },
      ],
      title: 'Northfield School — Curriculum',
    },
    {
      description:
        'Introduces the module leads and critique tutors, states plainly how the school teaches, and hands the rest of the page to students.',
      label: 'Instructors',
      path: 'instructors',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Every module is led by somebody who still practises, and every critique has two tutors in the room. Nobody here teaches a module they do not work in.',
            eyebrow: 'Instructors',
            links: [{ link: { appearance: 'outline', label: 'Read the curriculum' } }],
            proofItems: [
              { label: 'Eight tutors' },
              { label: 'Two in every critique' },
              { label: 'All still practising' },
            ],
            title: 'Eight people who set type for a living.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'team-roster',
          content: {
            eyebrow: 'The faculty',
            groups: [
              {
                label: 'Module leads',
                members: [
                  { name: 'Marianne Oduya', role: 'Modules one and two · letterforms' },
                  { name: 'Piet Vandermolen', role: 'Module three · the text block' },
                  { name: 'Sunita Rao', role: 'Modules four and five · hierarchy and grids' },
                  { name: 'Hana Ishikawa', role: 'Module six · type on screens' },
                ],
              },
              {
                label: 'Critique tutors',
                members: [
                  { name: 'Alma Berenguer', role: 'Critique · book and editorial' },
                  { name: 'Douglas Fairhead', role: 'Critique · signage and wayfinding' },
                  { name: 'Nkechi Balogun', role: 'Critique · identity and lettering' },
                  { name: 'Émile Rocard', role: 'Critique · interface and screen' },
                ],
              },
            ],
            title: 'Who leads each module, and who reads your work.',
          },
          id: 'faculty',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Marianne Oduya · principal, and lead of Modules one and two',
            eyebrow: 'How we teach',
            paragraphs: [
              {
                text: 'The school has taught the same six modules since 2012, and the method has not moved either: demonstrate, attempt, critique, write it down. Tutors are hired for how they explain a decision, not for the size of their studio.',
              },
              {
                text: 'There are no grades. Every piece of work leaves a critique with written notes attached, and those notes stay in your folder for the whole term so you can watch the same mistake stop recurring.',
              },
            ],
            quote:
              'A student who can say why the line is too long has learned something. A student who can only say it feels wrong has learned to guess more confidently.',
            title: 'We are not here to give you taste. We are here to give you reasons.',
          },
          id: 'teaching-philosophy',
          tone: 'muted',
        },
        {
          componentSlug: 'testimonials-wall',
          content: {
            description:
              'Collected at the end of each term, printed unedited, and pinned by the studio door.',
            eyebrow: 'Written up by students',
            items: [
              {
                author: 'Ines Abril',
                quote:
                  'Piet spent forty minutes on one word space with me. I have thought about that word space in every job since.',
                role: 'Weekend cohort, 2025',
              },
              {
                author: 'Callum Reith',
                quote:
                  'I expected to be taught software and was mildly offended when I was handed a pencil. By week three I understood the pencil.',
                role: 'Evening cohort, 2024',
              },
              {
                author: 'Yuki Tanabe',
                quote:
                  'The self-paced cohort still gets two written critiques a module. Mine came back longer than the brief.',
                role: 'Self-paced, 2025',
              },
              {
                author: 'Beatriz Sandoval',
                quote:
                  'Nobody told me my work was good. Somebody told me exactly which two decisions were making it worse, which was better.',
                role: 'Full cohort, 2023',
              },
              {
                author: 'Aidan Cormack',
                quote:
                  'Module five nearly finished me and the book is on my shelf. Both things are true.',
                role: 'Weekend cohort, 2024',
              },
              {
                author: 'Fenna de Wit',
                quote:
                  'Hana made us test type on an actual cracked phone from her bag. It was the most honest QA of my career.',
                role: 'Evening cohort, 2025',
              },
              {
                author: 'Grigor Nazaryan',
                quote:
                  'The order of the modules annoyed me until Module three, when it stopped annoying me permanently.',
                role: 'Full cohort, 2025',
              },
              {
                author: 'Sylvie Mbeki',
                quote:
                  'I run my own critique group now, badly, using Northfield’s format. It still works better than what we had.',
                role: 'Full cohort, 2022',
              },
              {
                author: 'Tobias Lindqvist',
                quote:
                  'Twenty-two weeks is a long time to be told you are nearly there. It is also how long it took.',
                role: 'Evening cohort, 2023',
              },
            ],
            title: 'What students say when the term ends.',
          },
          id: 'student-voice',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'The tutors who wrote the syllabus are the tutors in the room. Read the curriculum, then take a place in the next critique group.',
            links: [
              { link: { appearance: 'default', label: 'Enroll' } },
              { link: { appearance: 'outline', label: 'Read the curriculum' } },
            ],
            title: 'Be taught by the people who set this.',
          },
          id: 'cta',
        },
      ],
      title: 'Northfield School — Instructors',
    },
    {
      description:
        'States exactly what the school does and does not award, reports what graduates go on to do, and shows final sheets from recent cohorts.',
      label: 'Outcomes',
      path: 'outcomes',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'The school issues its own certificate of completion. It is not a degree, and no outside body awards it. What it records is that you finished six modules in order and stood by your work in front of a room.',
            eyebrow: 'Outcomes',
            links: [{ link: { appearance: 'default', label: 'Enroll' } }],
            proofItems: [
              { label: '412 graduates' },
              { label: '18 countries' },
              { label: 'Teaching since 2012' },
            ],
            title: 'What the six modules are actually worth.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'The register',
            features: [
              {
                description:
                  'About half go into or back into studios, usually into a role with type somewhere in the title.',
                title: 'Into studios',
              },
              {
                description:
                  'A third stay where they are and become the person their team asks about type.',
                title: 'Inside their own team',
              },
              {
                description:
                  'The rest freelance, teach, or start something small. Several now run critique groups of their own.',
                title: 'On their own terms',
              },
            ],
            paragraphs: [
              {
                text: 'Every graduate is asked the same three questions a year after they finish, and the answers go on the register. The register is the only outcome claim the school makes.',
              },
              {
                text: 'It is a small school. Read the figures as a description of forty-two cohorts, not as a forecast for yours.',
              },
            ],
            stats: [
              { label: 'finish all six modules in the term they started', value: '4 in 5' },
              { label: 'taught since the school opened in 2012', value: '42 cohorts' },
              { label: 'on the register, across 18 countries', value: '412 graduates' },
            ],
            title: 'What graduates do next.',
          },
          id: 'numbers',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Ivo Sandström',
            body: 'Nothing here is a placement rate. It is a record of what people told us after the fact, kept because the alternative is a brochure.',
            description:
              'Figures from the alumni register, updated each term and published whether or not they improve.',
            eyebrow: 'Alumni register',
            metrics: [
              { label: 'graduates on the register', value: '412' },
              { label: 'countries the register spans', value: '18' },
              { label: 'say the critique was the most useful part', value: '87%' },
              { label: 'changed role or scope within a year', value: '2 in 3' },
            ],
            quote:
              'We have hired four Northfield graduates. They arrive able to take a critique without flinching, which is rarer and more useful than knowing what a sidebearing is.',
            role: 'Studio director, Lowell & Fenn',
            title: 'Where the work goes after the wall comes down.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-showcase',
          content: {
            eyebrow: 'From the archive',
            features: [
              {
                description: 'A bilingual timetable, set for a station concourse.',
                title: 'Michaelmas 2025',
              },
              {
                description: 'A botanical index, reset from scratch and rebound.',
                title: 'Hilary 2025',
              },
              {
                description: 'A canteen menu, held to one size and one weight.',
                title: 'Trinity 2025',
              },
              {
                description: 'Wayfinding for a fictional set of swimming baths.',
                title: 'Michaelmas 2024',
              },
            ],
            paragraphs: [
              {
                text: 'Final sheets from the last four cohorts, hung in the order they were made. Every brief is fictional and every piece was set, printed, and defended inside the twenty-two weeks.',
              },
              {
                text: 'The archive is open to anyone enrolled, and to graduates for as long as they want it.',
              },
            ],
            title: 'Final sheets from recent cohorts.',
          },
          id: 'student-work',
          tone: 'muted',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            description:
              'Every graduate rates the term a year later. These are the most recent six, unedited.',
            eyebrow: 'A year on',
            items: [
              {
                author: 'Rosalind Ekwueme',
                quote:
                  'The certificate has never once come up. The folder of critique notes has come up in every interview.',
                rating: 5,
                role: 'Type director, Meridian Press',
              },
              {
                author: 'Peter Aylward',
                quote:
                  'I now argue about leading with confidence and evidence. My team finds this only slightly worse than before.',
                rating: 5,
                role: 'In-house design lead',
              },
              {
                author: 'Yuki Tanabe',
                quote:
                  'Self-paced took me eleven months instead of one term, and the written critiques were worth the wait.',
                rating: 4,
                role: 'Freelance, Osaka',
              },
              {
                author: 'Beatriz Sandoval',
                quote:
                  'Module two changed how I look at every sign in the street. That is not marketing; it is mildly inconvenient.',
                rating: 5,
                role: 'Designer, Halyard Foundry',
              },
              {
                author: 'Aidan Cormack',
                quote:
                  'I wanted more on lettering and less on grids. I was wrong about that, but I did want it.',
                rating: 4,
                role: 'Brand designer',
              },
              {
                author: 'Sylvie Mbeki',
                quote:
                  'Four years later I still set a text block the way Module three taught me to. Nothing has beaten it yet.',
                rating: 5,
                role: 'Art director, Ashgrove Museum',
              },
            ],
            title: 'How graduates rate the term, a year later.',
          },
          id: 'ratings',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'The archive, the graduate critique, and the register stay open to you after the term ends. That is what finishing the six modules buys.',
            links: [
              { link: { appearance: 'default', label: 'Enroll' } },
              { link: { appearance: 'outline', label: 'Read the curriculum' } },
            ],
            title: 'The register stays open to graduates.',
          },
          id: 'cta',
        },
      ],
      title: 'Northfield School — Outcomes',
    },
    {
      description:
        'Sets out the three cohort formats, compares their schedule, pace, and feedback depth side by side, and answers what the office is asked.',
      label: 'Enroll',
      path: 'enroll',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Choose when you meet, not what you learn. Evenings, Saturdays, or self-paced with written critique — the syllabus and its order are identical in all three.',
            eyebrow: 'Enrolment · Michaelmas',
            links: [{ link: { appearance: 'default', label: 'Enroll' } }],
            proofItems: [
              { label: 'Opens 5 October' },
              { label: 'Nine to a critique group' },
              { label: 'Pay per module or per term' },
            ],
            title: 'Three cohorts. The same six modules.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'pricing-cards',
          content: {
            description:
              'What you commit to, and when. Fees are identical across the three cohorts and are set out in full on the enrolment form.',
            eyebrow: 'What you are committing to',
            plans: [
              {
                description: 'No commitment past the module you booked.',
                features: [
                  'Choose your start module — nearly everyone starts at one',
                  'Two critiques, both written up for your folder',
                  'Handouts posted to you before each session',
                  'Roll into the next module in any later term',
                ],
                link: { appearance: 'outline', label: 'Enroll' },
                name: 'Module pass',
                period: '· paid as you go',
                price: 'One module',
              },
              {
                description: 'A place held in one critique group for the whole term.',
                featured: true,
                features: [
                  'A seat kept for you in a fixed group of nine',
                  'Payable module by module, or for the term at once',
                  'A fixed evening or Saturday timetable',
                  'One deferral to the next term, without penalty',
                  'The school’s own certificate of completion',
                ],
                link: { appearance: 'default', label: 'Enroll' },
                name: 'Full cohort',
                period: '· one term',
                price: 'Six modules',
              },
              {
                description: 'Offered after a conversation, not a form.',
                features: [
                  'A short interview before a place is offered',
                  'A mentor matched to the work you want to make',
                  'A studio desk for the whole second term',
                  'A standing place in the graduate critique',
                ],
                link: { appearance: 'outline', label: 'Enroll' },
                name: 'Studio year',
                period: '· by conversation',
                price: 'Two terms',
              },
            ],
            title: 'Enrolment for the Michaelmas cohort.',
          },
          id: 'options',
        },
        {
          componentSlug: 'comparator-table',
          content: {
            description:
              'The six modules and their order never change. What changes is when you meet, how fast you are allowed to go, and how the critique reaches you.',
            features: [
              {
                feature: 'Teaching sessions',
                groupLabel: 'Schedule',
                values: [
                  { label: 'Tue + Thu evenings' },
                  { label: 'Saturdays' },
                  { label: 'Recorded' },
                ],
              },
              {
                feature: 'Session length',
                values: [{ label: '2 hours' }, { label: '5 hours' }, { label: 'Your own blocks' }],
              },
              {
                feature: 'Time to finish',
                values: [
                  { label: '22 weeks' },
                  { label: '22 weeks' },
                  { label: 'Up to 12 months' },
                ],
              },
              {
                feature: 'Modules per term',
                groupLabel: 'Pace',
                values: [
                  { label: '6, in order' },
                  { label: '6, in order' },
                  { label: '6, in order' },
                ],
              },
              {
                feature: 'Deadlines',
                values: [
                  { label: 'Weekly, fixed' },
                  { label: 'Weekly, fixed' },
                  { label: 'Set with your tutor' },
                ],
              },
              {
                feature: 'One deferral, no penalty',
                values: [{ included: true }, { included: true }, {}],
              },
              {
                feature: 'Tutor critiques per module',
                groupLabel: 'Feedback',
                values: [{ label: '2, live' }, { label: '2, live' }, { label: '2, written' }],
              },
              {
                feature: 'Critique group',
                values: [
                  { label: 'Fixed group of 9' },
                  { label: 'Fixed group of 9' },
                  { label: 'Monthly open critique' },
                ],
              },
              {
                feature: 'Written notes in your folder',
                values: [{ included: true }, { included: true }, { included: true }],
              },
              {
                feature: 'Saturday studio access',
                values: [{}, { included: true }, {}],
              },
              {
                feature: 'Graduate critique after the term',
                values: [{ included: true }, { included: true }, { included: true }],
              },
            ],
            plans: [
              {
                links: [{ link: { appearance: 'outline', label: 'Enroll' } }],
                name: 'Evening cohort',
              },
              {
                badge: 'Most chosen',
                highlighted: true,
                links: [{ link: { appearance: 'default', label: 'Enroll' } }],
                name: 'Weekend cohort',
              },
              {
                links: [{ link: { appearance: 'outline', label: 'Enroll' } }],
                name: 'Self-paced',
              },
            ],
            title: 'Compare the three cohorts.',
          },
          id: 'compare-cohorts',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description: 'If something is not here, the enrolment form carries the long version.',
            eyebrow: 'Enrolment',
            groups: [
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'The Michaelmas cohort starts on 5 October and closes with the whole-term critique in March. Hilary and Trinity cohorts follow in January and April.',
                    question: 'When does the next cohort start?',
                  },
                  {
                    answer:
                      'The evening cohort meets Tuesday and Thursday, 18:30 to 20:30. The weekend cohort meets Saturday, 10:00 to 15:00, with an hour for lunch that most people spend at the bench anyway.',
                    question: 'What are the session times?',
                  },
                  {
                    answer:
                      'Once, between modules, if there is a free seat. Ask your module lead rather than the office — they know who is where.',
                    question: 'Can I switch cohorts mid-term?',
                  },
                ],
                title: 'The timetable',
              },
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'One fee per module, identical across the three cohorts, listed in full on the enrolment form. You can settle module by module or pay for the whole term at once.',
                    question: 'How are fees set out?',
                  },
                  {
                    answer:
                      'No deposit. Your place is held once the first module is settled, and the form explains exactly what happens if you withdraw before it starts.',
                    question: 'Is there a deposit?',
                  },
                  {
                    answer:
                      'Once, to the next term, without penalty — as long as you tell us before your third session. After that we ask you to finish the module you are in.',
                    question: 'Can I defer?',
                  },
                ],
                title: 'Fees and commitment',
              },
              {
                icon: 'globe',
                items: [
                  {
                    answer:
                      'Not for the module pass or the full cohort — enrolment is first come, first served. The studio year begins with a short conversation about the work you want to make.',
                    question: 'Is there an application?',
                  },
                  {
                    answer:
                      'No. Bring something you have set and are unhappy with; that is far more useful to us than a polished piece.',
                    question: 'Do I need a portfolio?',
                  },
                  {
                    answer:
                      'The old Marley Street print works, second floor. Recorded sessions and written critique cover the self-paced cohort for anyone who cannot get there.',
                    question: 'Where is the school?',
                  },
                ],
                title: 'Getting in, and getting here',
              },
            ],
            title: 'Everything the office gets asked.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            action: '/enrolment',
            description:
              'One email back with the term dates, the timetable for all three cohorts, and the fee schedule in full. Nothing else follows unless you reply.',
            emailPlaceholder: 'you@yourstudio.example',
            links: [],
            submitLabel: 'Enroll',
            title: 'Ask for the enrolment form.',
          },
          id: 'cta',
        },
      ],
      title: 'Northfield School — Enroll',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'education-course',
  status: 'concept',
  summary:
    'A patient, structured site for a fictional school of practical typography, built around a numbered module ladder.',
  theme: {
    description:
      'Ink on chalk with one highlighter accent: pale ruled paper for the prose, ruled worksheet bands for everything sequential, a chalkboard band for the figures, and a yellow marker reserved for washes, numerals, and rules — never for text.',
    id: 'education-course',
    swatches: ['#f0f4f2', '#182520', '#f5d83d'],
  },
  title: 'Education Course',
  visualTone: ['Patient', 'Structured', 'Studious'],
}
