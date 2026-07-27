import type { TemplateShowcase } from './types'

/* Alder Practice (healthcare-clinic) — a fictional family clinic.
 *
 * Register — the point of the concept. This is the calmest and most
 * plainspoken site in the gallery. It is written for someone who is unwell,
 * worried, or in a hurry: the useful thing goes first (when we are open, how to
 * be seen, what happens next), sentences are short, and there is no
 * growth-marketing voice, no superlative, and no urgency device anywhere.
 *
 * Accessibility is the design constraint, not a pass at the end — see
 * src/components/site/templates/healthcare-clinic/theme.css, which raises body
 * copy to 17px, muted text to AAA-level contrast, and every action to a 48px
 * target.
 *
 * Safety rules honoured in this file, and they are not negotiable:
 * - Nothing reads as medical advice or as a health claim a patient could act on.
 *   The copy describes how the practice runs (hours, booking, rooms, rotas), not
 *   what to do about a symptom.
 * - No practitioner registration number, named regulator, insurer, or
 *   health-service affiliation is invented, and there are no clinical outcome
 *   statistics. Clinician entries carry a name and a plain role, nothing more.
 * - Emergency guidance appears three times and is always generic — "contact
 *   your local emergency number", never a specific real number.
 * - The one telephone number uses the site's fictional 555 convention; the email
 *   sits on the reserved .example TLD.
 * - The fiction is signposted: the shell footer states that the practice is
 *   invented for this preview and that nothing here is medical advice.
 *
 * Two swaps against the frozen skeleton, both preserving the page's job:
 * - Home "proof": stats-proof → feature-steps. stats-proof would have printed
 *   clinic metrics beside a hardcoded third-party wordmark, which reads as an
 *   insurer or health-service affiliation and as authoritative outcome data —
 *   both banned. feature-steps proves the same thing the way a clinic actually
 *   can: by saying what happens after you get in touch.
 * - Services: the pathways rows now precede the care grid, so the human-scale
 *   "which kind of appointment" answer lands before the list of services. */

const bookingLink = { link: { appearance: 'default' as const, label: 'Book an appointment' } }
const visitingLink = { link: { appearance: 'outline' as const, label: 'Visiting us' } }

export const healthcareClinicTemplate: TemplateShowcase = {
  assets: [],
  category: 'healthcare',
  description:
    'Alder Practice is a fictional family clinic on Alder Road: the calmest, plainest concept in the gallery, written for someone who is unwell or in a hurry. Five pages — Home, Services, Our Team, Visiting Us and Book — composed entirely from blocks in the open registry, on soft alder green and sky over warm white, with body copy and muted text held well above the AA floor.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Services', path: 'services' },
    { label: 'Our Team', path: 'team' },
    { label: 'Visiting Us', path: 'visiting' },
    { label: 'Book', path: 'book' },
  ],
  pages: [
    {
      description:
        'Says the useful thing first: when the practice is open, how to be seen today, and what happens after you get in touch.',
      label: 'Home',
      path: '',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Alder Practice looks after families on and around Alder Road. Ring reception when the lines open at 8:00 if you need to be seen today, or ask for an appointment online and we will ring you back. If this is an emergency, contact your local emergency number.',
            eyebrow: 'A family clinic in Fern Hollow',
            links: [bookingLink, visitingLink],
            proofItems: [
              { label: 'Weekdays 8:00 – 18:00' },
              { label: 'Saturday mornings 9:00 – 12:00' },
              { label: 'Step-free from the street' },
            ],
            title: 'Open six days a week. Same-day slots held back every morning.',
          },
          id: 'welcome',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Where to start',
            links: [bookingLink],
            paragraphs: [
              {
                text: 'Reception can tell you who to see and when. You do not need to work out which clinician you need first, and nobody will ask you to explain yourself at length on the phone.',
              },
              {
                text: 'Appointments run to twelve minutes. If you think you will need longer, say so when you book and we will hold two together.',
              },
            ],
            title: 'If you are not sure what to do, ring us and ask.',
          },
          id: 'reassurance',
        },
        {
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'The three things people come to us for most. There is a fuller list on the Services page.',
            eyebrow: 'Everyday care',
            items: [
              {
                description:
                  'A cough that will not settle, a rash, a pain you have not had before. Ring at 8:00 and ask for a same-day slot.',
                icon: 'zap',
                title: 'Something new or urgent',
              },
              {
                description:
                  'Reviews for asthma, blood pressure, diabetes and thyroid conditions, booked to a rhythm that suits you rather than the calendar.',
                icon: 'chart',
                title: 'Long-term conditions',
              },
              {
                description:
                  'Childhood and seasonal vaccinations, contraception, new-patient checks, and travel appointments booked well ahead.',
                icon: 'shield',
                title: 'Checks and vaccinations',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See all services' } }],
            title: 'What we look after.',
          },
          id: 'services',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'No triage maze, and no waiting on hold to find out whether you have been heard.',
            eyebrow: 'What happens next',
            items: [
              {
                description:
                  'Reception takes your name and a short note. If you send the form instead, we read it the same working day.',
                title: 'You ring, or send the form',
              },
              {
                description:
                  'Usually within the hour on weekday mornings. We agree a time with you rather than offering you one slot and hoping.',
                title: 'We ring you back',
              },
              {
                description:
                  'A doctor, a nurse practitioner or a practice nurse — whoever is right for the thing you rang about.',
                title: 'You see a clinician',
              },
            ],
            links: [],
            title: 'What happens after you get in touch.',
          },
          id: 'visit',
          tone: 'contrast',
        },
        {
          componentSlug: 'team-grid',
          content: {
            description:
              'Three of the six people you might be booked with. The whole team is on the Our Team page.',
            eyebrow: 'The clinical team',
            members: [
              { name: 'Dr Ines Halloway', role: 'GP · Practice partner' },
              { name: 'Dr Samuel Oyelaran', role: 'GP' },
              { name: 'Tomás Rey', role: 'Nurse practitioner' },
            ],
            title: 'Who you will see.',
          },
          id: 'clinicians',
        },
        {
          componentSlug: 'content-community',
          content: {
            avatars: [
              { name: 'Ines' },
              { name: 'Samuel' },
              { name: 'Priya' },
              { name: 'Tomás' },
              { name: 'Wren' },
              { name: 'Ada' },
              { name: 'Marta' },
              { name: 'Joe' },
            ],
            eyebrow: 'Since 1979',
            paragraphs: [
              {
                text: 'Two rooms above the chemist, then. Four consulting rooms and a dispensary now. Some of the families we look after are on their fourth generation with us — the building changed, the idea did not.',
              },
            ],
            title: 'The practice has been on this corner since 1979.',
          },
          id: 'community',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-accordion',
          content: {
            description: 'If yours is not here, reception will know.',
            eyebrow: 'Questions people ask',
            items: [
              {
                answer:
                  'Ring reception when the lines open at 8:00. We hold slots back every morning for problems that cannot wait, and reception will tell you honestly if the day is already full.',
                question: 'How do I get a same-day appointment?',
              },
              {
                answer:
                  'Yes, and please do. We will book you with them on a day they are in. If it is urgent we will offer whoever can see you soonest instead, and say so.',
                question: 'Can I ask for a particular clinician?',
              },
              {
                answer:
                  'Yes, if you live in Fern Hollow or the three streets north of the park. Bring something with your address on it to reception and we will do the rest at the desk.',
                question: 'Are you taking new patients?',
              },
              {
                answer:
                  'Ring, or reply to the reminder message. There is nothing to explain and no penalty. Telling us early just means someone else can have the slot.',
                question: 'What if I need to cancel?',
              },
              {
                answer:
                  'The Alder Road entrance is step-free, there is a lift to the first floor, and the two ground-floor rooms have wider doorways. Tell reception when you book if you would rather not use the lift.',
                question: 'Is the building accessible?',
              },
              {
                answer:
                  'Always. Bring whoever you like, and tell us if you would rather they did the talking.',
                question: 'Can someone come in with me?',
              },
            ],
            links: [bookingLink],
            title: 'Questions people ask.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Lines open at 8:00 on weekdays and 9:00 on Saturday mornings. If this is an emergency, contact your local emergency number.',
            links: [bookingLink, visitingLink],
            title: 'Not sure who to see? Ring reception and ask.',
          },
          id: 'cta',
        },
      ],
      title: 'Alder Practice — A family clinic on Alder Road',
    },
    {
      description:
        'Describes the care available here in plain language: which kind of appointment fits, what it covers, and how long it takes.',
      label: 'Services',
      path: 'services',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Most of what we do is ordinary and unhurried. This page says what we can help with, who you would see, and roughly how long it takes.',
            eyebrow: 'Services',
            links: [bookingLink],
            proofItems: [
              { label: 'Twelve-minute appointments' },
              { label: 'Longer slots on request' },
              { label: 'Interpreters can be booked' },
            ],
            title: 'Care available at Alder Practice.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-rows',
          content: {
            eyebrow: 'Who you would see',
            paragraphs: [
              {
                text: 'Three kinds of appointment cover nearly everything. Reception will put you in the right one — you do not have to choose correctly on the phone.',
              },
            ],
            rows: [
              {
                description:
                  'For something new, something that is not settling, or a look at medication you are already taking. Twelve minutes, and you can ask for two together.',
                title: 'Seeing a doctor',
              },
              {
                description:
                  'Dressings, blood tests, vaccinations, blood-pressure checks and contraception. Usually bookable inside the week, often the next day.',
                title: 'Seeing a nurse',
              },
              {
                description:
                  'Half an hour for a long-term condition, with any test results already in front of us before you sit down.',
                title: 'A longer review',
              },
            ],
            title: 'Three kinds of appointment.',
          },
          id: 'pathways',
        },
        {
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'If what you need is not here, ring and ask. We would rather tell you where to go than leave you guessing.',
            eyebrow: 'What we can help with',
            items: [
              {
                description:
                  'Slots held back every morning for problems that cannot wait until next week.',
                icon: 'zap',
                title: 'Same-day appointments',
              },
              {
                description:
                  'Asthma, blood pressure, diabetes and thyroid reviews, on a rhythm we agree with you.',
                icon: 'chart',
                title: 'Long-term condition reviews',
              },
              {
                description:
                  'Childhood and seasonal vaccinations, contraception, new-patient checks, and travel appointments.',
                icon: 'shield',
                title: 'Vaccinations and health checks',
              },
              {
                description:
                  'Ask for the clinician you saw last time. We will book you with them whenever the rota allows.',
                icon: 'fingerprint',
                title: 'Seeing the same clinician',
              },
              {
                description:
                  'Order repeats at the desk, by phone, or through the practice app. The dispensary is on the ground floor.',
                icon: 'database',
                title: 'Repeat prescriptions',
              },
              {
                description:
                  'Bring something with your address on it. Registration takes about ten minutes at reception.',
                icon: 'id-card',
                title: 'Joining the practice',
              },
            ],
            links: [],
            title: 'What we can help with.',
          },
          id: 'care',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Before you come in',
            links: [visitingLink],
            paragraphs: [
              {
                text: 'Bring a list of anything you are taking, including things off a pharmacy shelf. If you have been measuring something at home, bring the numbers with you.',
              },
              {
                text: 'You will be asked what you hope to get out of the appointment. It is a fair question and there is no wrong answer — sometimes it is a plan, sometimes it is just to be looked over by someone who knows you.',
              },
            ],
            title: 'What to bring, and what happens in the room.',
          },
          id: 'what-to-expect',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description: 'The three things reception is asked most often, grouped so you can skim.',
            eyebrow: 'Practical questions',
            groups: [
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'Same-day slots open at 8:00 and are usually gone by half past nine. Routine appointments run about a week ahead, longer for a half-hour review.',
                    question: 'How far ahead can I book?',
                  },
                  {
                    answer:
                      'Twelve minutes for a doctor or nurse practitioner, twenty for most nurse appointments, thirty for a long-term condition review.',
                    question: 'How long is an appointment?',
                  },
                ],
                title: 'Timing',
              },
              {
                icon: 'help-circle',
                items: [
                  {
                    answer:
                      'Yes. Say so when you book and reception will note it, or ask at the desk on the day. Nobody will ask you why.',
                    question: 'Can I ask for a chaperone?',
                  },
                  {
                    answer:
                      'Yes, for most things. Tell reception you would prefer a phone appointment and they will book one. Some visits do need you in the room, and we will say so.',
                    question: 'Can I be seen over the phone?',
                  },
                ],
                title: 'Asking for something',
              },
              {
                icon: 'globe',
                items: [
                  {
                    answer:
                      'Give reception a few days if you can. We book interpreters for the whole appointment, not part of it.',
                    question: 'Can you book an interpreter?',
                  },
                  {
                    answer:
                      'Ring or ask at the desk and we will register you for one visit. Bring something with your address on it if you have it — if you do not, we will still see you.',
                    question: 'What if I am only here temporarily?',
                  },
                ],
                title: 'If you need us in another language',
              },
            ],
            title: 'Practical questions.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Fill in the form and we will ring you back. For something that cannot wait, ring reception at 8:00.',
            links: [bookingLink, visitingLink],
            title: 'Ask for an appointment.',
          },
          id: 'cta',
        },
      ],
      title: 'Alder Practice — Services',
    },
    {
      description:
        'Introduces the people who work here and how the practice tries to keep you with the same clinician.',
      label: 'Our Team',
      path: 'team',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Ten of us, in a building meant for eight. Reception knows who is in on which days, and will tell you on the phone if you would rather see a particular person.',
            eyebrow: 'Our team',
            links: [bookingLink],
            proofItems: [
              { label: 'The same clinician where we can' },
              { label: 'Chaperones always available' },
              { label: 'Interpreters can be booked' },
            ],
            title: 'The people who work here.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'team-roster',
          content: {
            eyebrow: 'Who is here',
            groups: [
              {
                label: 'Doctors',
                members: [
                  { name: 'Dr Ines Halloway', role: 'GP · Practice partner' },
                  { name: 'Dr Samuel Oyelaran', role: 'GP' },
                  { name: 'Dr Priya Anand', role: 'GP · Children and families' },
                ],
              },
              {
                label: 'Nursing team',
                members: [
                  { name: 'Tomás Rey', role: 'Nurse practitioner' },
                  { name: 'Wren Kelleher', role: 'Practice nurse' },
                  { name: 'Ada Fontaine', role: 'Health visitor' },
                ],
              },
              {
                label: 'Reception and practice team',
                members: [
                  { name: 'Marta Ilves', role: 'Practice manager' },
                  { name: 'Joe Bramley', role: 'Reception lead' },
                  { name: 'Neve Okonkwo', role: 'Reception' },
                  { name: 'Hal Byrne', role: 'Dispensary' },
                ],
              },
            ],
            title: 'Who is here.',
          },
          id: 'clinicians',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Dr Ines Halloway, practice partner',
            eyebrow: 'How we work',
            paragraphs: [
              {
                text: 'We keep the list smaller than we could, and we would rather see you twice than rush you once. That is the whole method, and it is not complicated.',
              },
            ],
            quote:
              'Most of what walks through the door is not a puzzle. It is somebody who has been quietly worrying for a fortnight and needs ten unhurried minutes to say it out loud.',
            title: 'We would rather see you twice than rush you once.',
          },
          id: 'philosophy',
          tone: 'muted',
        },
        {
          componentSlug: 'content-image-lead',
          content: {
            eyebrow: 'Continuity',
            links: [bookingLink],
            paragraphs: [
              {
                text: 'Seeing the same person matters more than seeing anyone quickly, most of the time. So reception tries to route you back to whoever you saw last, and the notes are read before you come in, not while you are sitting there.',
              },
              {
                text: 'It does not always work. Rotas, leave and the odd urgent morning get in the way. When it cannot happen we will tell you at the point of booking rather than at the door.',
              },
            ],
            title: 'The same face, where the rota allows.',
          },
          id: 'practice',
        },
        {
          componentSlug: 'testimonials-quote',
          content: {
            testimonial: {
              author: 'Rosa Mbeki',
              quote:
                'They rang back when they said they would, and the doctor had already read my notes before I sat down. That is the whole difference, really.',
              role: 'Registered with the practice since 2011',
            },
          },
          id: 'patient-voice',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Reception will tell you who is in and put you with the right person. If this is an emergency, contact your local emergency number.',
            links: [bookingLink, visitingLink],
            title: 'Ask for someone by name.',
          },
          id: 'cta',
        },
      ],
      title: 'Alder Practice — Our Team',
    },
    {
      description:
        'The practical page: where the practice is, when it is open, how to get in, and what to expect at the door.',
      label: 'Visiting Us',
      path: 'visiting',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Where we are, when we are open, and what happens at the door. If you would rather ring than read, reception will walk you through any of it.',
            eyebrow: 'Visiting us',
            links: [bookingLink],
            proofItems: [
              { label: 'Step-free entrance' },
              { label: 'Lift to the first floor' },
              { label: 'Hearing loop at reception' },
              { label: 'Assistance dogs welcome' },
            ],
            title: 'Alder Road, Fern Hollow. Step-free from the street.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'content-image-frame',
          content: {
            eyebrow: 'The building',
            paragraphs: [
              {
                text: 'Look for the green door between the chemist and the launderette. The bell is on the left at waist height, and reception can see the doorway from the desk.',
              },
            ],
            title: 'A red-brick corner, with the green door.',
          },
          id: 'building',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Getting here',
            links: [bookingLink],
            paragraphs: [
              {
                text: 'The 14 and the 31 stop on Alder Road outside the chemist. From Fern Hollow station it is about nine minutes on foot, mostly flat, with a dropped kerb at every crossing.',
              },
              {
                text: 'There are six spaces behind the building, two of them wider bays. If they are full, the street is unrestricted after 9:30.',
              },
            ],
            title: 'Getting here.',
          },
          id: 'practical',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Opening hours',
            features: [
              {
                description:
                  'When we are closed the recorded message gives the out-of-hours service. If this is an emergency, contact your local emergency number.',
                icon: 'shield',
                title: 'Out of hours',
              },
              {
                description:
                  'Monday mornings, and the first hour after 8:00 on any weekday. Thursday afternoons are usually the quietest.',
                icon: 'gauge',
                title: 'Busiest times',
              },
              {
                description:
                  'If you would rather not speak at the desk, ask for the side room. Nobody will ask you why.',
                icon: 'lock',
                title: 'A private room',
              },
            ],
            paragraphs: [
              {
                text: 'Reception is staffed from 8:00. The doors open at 8:15, and the last appointment of the day starts at 17:40.',
              },
            ],
            stats: [
              { label: 'Monday to Friday', value: '8:00 – 18:00' },
              { label: 'Saturday mornings', value: '9:00 – 12:00' },
              { label: 'Sundays and public holidays', value: 'Closed' },
              { label: 'Phone lines open, every day we are open', value: '8:00' },
            ],
            title: 'When we are open.',
          },
          id: 'hours-access',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'The small practical things, in case they are on your mind.',
            eyebrow: 'At the door',
            items: [
              {
                answer:
                  'Give your name at the desk, or use the screen to the right of it if you would rather not speak. Either way you will be told roughly how long the wait is.',
                question: 'How do I check in?',
              },
              {
                answer:
                  'Yes. Prams fit in the waiting room and there are two low chairs and a box of books in the corner by the window.',
                question: 'Can I bring children?',
              },
              {
                answer:
                  'There is a toilet off the waiting room, on the flat, with a wider door and a rail. Ask at the desk for the key to the baby-change room.',
                question: 'Is there a toilet?',
              },
              {
                answer:
                  'Usually inside twenty minutes of your slot. If a morning has run badly reception will tell you at the desk and give you a straight answer, not a guess.',
                question: 'How long will I wait?',
              },
              {
                answer:
                  'Ring, or reply to the reminder message. There is no penalty and nothing to explain — it just frees the slot for someone else.',
                question: 'What if I cannot make it after all?',
              },
            ],
            links: [bookingLink],
            title: 'At the door.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Reception will tell you which entrance suits you best and meet you at the door if that helps.',
            links: [bookingLink],
            title: 'Tell us if getting in is difficult.',
          },
          id: 'cta',
        },
      ],
      title: 'Alder Practice — Visiting Us',
    },
    {
      description:
        'Routes an appointment request calmly: three ways to reach the practice, and a short form that asks for nothing clinical.',
      label: 'Book',
      path: 'book',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Fill this in and we will ring you back to agree a time. If you need to be seen today, ring reception at 8:00 instead — the form is not read out of hours.',
            eyebrow: 'Booking',
            links: [],
            proofItems: [
              { label: 'We ring back the same working day' },
              { label: 'No symptoms needed on the form' },
              { label: 'Interpreters can be booked' },
            ],
            title: 'Ask for an appointment.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Lines open at 8:00 on weekdays and 9:00 on Saturday mornings. Ask for a same-day slot if it cannot wait.',
                label: 'Ring reception',
                value: '555 0118',
              },
              {
                description:
                  'For repeat prescriptions, forms, and anything that is not urgent. We answer inside two working days.',
                label: 'Email the practice team',
                value: 'reception@alderpractice.example',
              },
              {
                description:
                  'Please do not use this form or email for anything urgent. Neither is read out of hours.',
                label: 'If this is an emergency',
                value: 'Contact your local emergency number',
              },
            ],
            description:
              'The form is the slowest of the three, so ring instead if the day matters.',
            eyebrow: 'Getting in touch',
            formConfigured: true,
            formDescription:
              'We will ring you back to agree a time. Please keep it brief — there is no need to describe symptoms here.',
            formLabels: [
              'Your name',
              'Date of birth',
              'Phone number',
              'Email',
              'Anything we should know before we ring you',
            ],
            formTitle: 'Ask us to ring you back',
            submitLabel: 'Send request',
            title: 'Three ways to reach us.',
          },
          id: 'request',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description: 'Four things worth knowing before you send it.',
            eyebrow: 'Before you send',
            items: [
              {
                answer:
                  'On weekday mornings, usually the same day. Requests sent after 16:00 are read the next working morning.',
                question: 'When will you ring back?',
              },
              {
                answer:
                  'No. A name, a date of birth and a number are enough. We will ask the rest on the phone, where you can say it once and be heard properly.',
                question: 'Do I have to say what it is about?',
              },
              {
                answer:
                  'Yes. Add their name in the last box and say who they are, and we will ring them instead of you.',
                question: 'Can somebody request on my behalf?',
              },
              {
                answer:
                  'Ring reception when the lines open at 8:00 and ask for a same-day slot. If this is an emergency, contact your local emergency number.',
                question: 'What if it cannot wait?',
              },
            ],
            links: [visitingLink],
            title: 'Before you send it.',
          },
          id: 'faq',
        },
      ],
      title: 'Alder Practice — Book an appointment',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'healthcare-clinic',
  status: 'concept',
  summary: 'A calm, plainspoken site for a fictional family clinic.',
  theme: {
    description:
      'Soft alder green and sky over warm white — the airiest palette in the gallery, with no inverted band anywhere on the site. Body copy runs at 17px on a comfortable measure, muted text clears AAA on every surface it lands on, and every action is a 48px target. Backend-free image plates are painted as arches of daylight from the theme tokens, so nothing reads as a missing photograph.',
    id: 'healthcare-clinic',
    swatches: ['#fafbf7', '#eef3ec', '#2b463c', '#41705d', '#b4cede'],
  },
  title: 'Healthcare Clinic',
  visualTone: ['Calm', 'Plainspoken', 'Airy', 'High-contrast'],
}
