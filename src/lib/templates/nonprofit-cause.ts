import type {
  ContactRoutingFormDemoContent,
  ContentSectionDemoContent,
  CtaDemoContent,
  FaqDemoContent,
  FeatureCardsMediaDemoContent,
  FeatureIconGridDemoContent,
  FeatureSectionDemoContent,
  HeroBasicDemoContent,
  HeroVideoDemoContent,
  LogoCloudDemoContent,
  StatsProofDemoContent,
  TeamSectionDemoContent,
  TestimonialDemoContent,
} from '@/lib/demo-content'
import type { TemplateShowcase } from './types'

/* Nonprofit — "Rivermouth Trust", a fictional watershed conservation charity
 * mending nine miles of the invented River Corrow, from the Kilnmoss springs to
 * the tide below Hollow Weir.
 *
 * REGISTER — the point of the concept. This is the only site in the gallery
 * whose ask is give/volunteer rather than buy/book/demo. The voice is sincere
 * and specific: named reaches (Blackbank, Sedge Mill, Ferney Ford, Hollow
 * Weir), named species, a named volunteer Saturday, and figures that come from
 * the trust's own monitoring rather than from marketing. Nothing shrill, nothing
 * guilt-tripping, and no growth-marketing verbs.
 *
 * EVERY NAME AND FIGURE IS INVENTED. The trust, the river, the catchment, the
 * partnership that spot-checks the monitoring, the staff, the trustees, the
 * farms, and the volunteers are fiction. There is deliberately no charity
 * registration number, no regulator, no government body, and no real partner
 * organisation anywhere in this file — a concept preview must never look like
 * it is claiming accreditation.
 *
 * NO CURRENCY, BY DESIGN. A preview-surface guard forbids literal price strings,
 * and the Donate page turns that constraint into the concept's most honest page:
 * giving is expressed as four named paths (River Guardians, Adopt a reach, In
 * memory, Gifts in kind) and priced in river work — metres fenced, trees in the
 * ground, gauges read — with the trust stating outright that it does not publish
 * suggested amounts because the answer depends on what the reach needs.
 *
 * Each page's sections are assembled from named, individually typed content
 * consts below, so a mismatch between a recipe slug and its twin's content shape
 * fails at this file rather than at render time.
 *
 * SECTION SWAP vs the frozen skeleton: the Home partner strip moved from
 * logo-cloud-inline-wrap to logo-cloud-marquee (same LogoCloudDemoContent, same
 * job) so the band under the letterbox hero drifts like the current it sits
 * beneath. Tones are art direction, not contract: each page carries exactly one
 * silt band, and the two frozen 'contrast' sections keep theirs. */

/* ————————————————————————————————————————————————————————————————
 * Home — the place first, then the work, then the proof, then the way in.
 * ———————————————————————————————————————————————————————————————— */

const homeCatchment: HeroVideoDemoContent = {
  description:
    'We are a small river trust working the Corrow from the peat springs on Kilnmoss down to the tide. Trees on the south banks, gravel back in the shallows, fences where cattle used to stand in the beck — and a written count of every one.',
  eyebrow: 'The Corrow catchment',
  links: [
    { link: { appearance: 'default', label: 'Donate' } },
    { link: { appearance: 'outline', label: 'See our work' } },
  ],
  proofItems: [
    { label: 'Working the Corrow since 2009' },
    { label: 'Six reaches' },
    { label: 'First Saturday, every month' },
  ],
  title: 'Nine miles of river, mended reach by reach.',
}

/* The marquee sets this heading in a narrow left-hand column against a rule, so
   it has to survive wrapping to two short lines. */
const homePartners: LogoCloudDemoContent = {
  heading: 'Funders and partners',
}

const homeTheWork: ContentSectionDemoContent = {
  eyebrow: 'What we do',
  features: [
    {
      description: 'Native trees along the south banks, to hold the water temperature down in August.',
      icon: 'sparkles',
      title: 'Shade the water',
    },
    {
      description: 'Weirs notched or removed so sea trout and lamprey can reach the spawning gravels.',
      icon: 'zap',
      title: 'Open the channel',
    },
    {
      description: 'Fenced margins and buffer strips where stock used to walk straight into the beck.',
      icon: 'shield',
      title: 'Keep the silt out',
    },
    {
      description: 'Temperature, invertebrates and redds, logged monthly and published whole.',
      icon: 'gauge',
      title: 'Count everything',
    },
  ],
  paragraphs: [
    {
      text: 'None of it is clever. It is tree guards, gravel, fence posts and a notebook, repeated in the same places for long enough to show up in the counts.',
    },
  ],
  title: 'Four kinds of work, repeated until the river answers.',
}

const homeImpact: StatsProofDemoContent = {
  author: 'Marion Ashcroft',
  body: 'Where a figure moved the wrong way we have said so in that year’s review and explained what we changed.',
  description:
    'Every number here comes from our own monitoring on the Corrow — thirty-one points, read every month — and is spot-checked each spring by the Northwind Catchment Partnership, the landowners, clubs and commoners who share this river with us.',
  eyebrow: 'Measured, not claimed',
  metrics: [
    { label: 'native trees planted on the banks', value: '11,400' },
    { label: 'of margin fenced against stock', value: '6.2 km' },
    { label: 'barriers notched or removed', value: '4' },
    { label: 'monitoring points read monthly', value: '31' },
  ],
  quote:
    'Rivermouth publish the counts that make them look bad as readily as the ones that don’t. On this catchment, that is the whole basis for trust.',
  role: 'Chair, Northwind Catchment Partnership',
  title: 'Nine years of counts, published whole.',
}

const homePlace: ContentSectionDemoContent = {
  eyebrow: 'The catchment',
  links: [{ link: { appearance: 'outline', label: 'See our work' } }],
  paragraphs: [
    {
      text: 'The Corrow rises in peat on Kilnmoss, drops through Blackbank and the old leat at Sedge Mill, slows over the shallows at Ferney Ford, and meets salt water below Hollow Weir.',
    },
    {
      text: 'Six reaches, one river, and about four thousand people living alongside it. We know all six by name, and so do the two hundred people who work them with us.',
    },
  ],
  title: 'From the Kilnmoss springs to the tide, in nine miles.',
}

const homeVoice: TestimonialDemoContent = {
  testimonial: {
    author: 'Dilys Frayne',
    quote:
      'I started because the bank behind our house was falling into the water. I stayed because you can stand at Ferney Ford now and watch clean gravel moving under the shallows, and I helped put it there.',
    role: 'First Saturday volunteer, eleven years',
  },
}

const homePeople: TeamSectionDemoContent = {
  eyebrow: 'Who we are',
  groups: [
    {
      label: 'The river team',
      members: [
        { name: 'Nerys Ballantyne', role: 'Director' },
        { name: 'Idris Adeyemi', role: 'Catchment ecologist' },
        { name: 'Marta Sepúlveda', role: 'Volunteering lead' },
        { name: 'Tom Fairhurst', role: 'River keeper, lower reaches' },
      ],
    },
    {
      label: 'Trustees',
      members: [
        { name: 'Ada Pengelly', role: 'Chair' },
        { name: 'Wilf Grieve', role: 'Treasurer' },
        { name: 'Ruth Oyelaran', role: 'Trustee, hydrology' },
        { name: 'Callum Rae', role: 'Trustee, farm liaison' },
      ],
    },
  ],
  title: 'Four of us are paid. The rest give their Saturdays.',
}

const homeCta: CtaDemoContent = {
  description:
    'It is the last barrier between the sea trout and eleven miles of gravel, and the winter window is short. Give to the work, or come and stand in the river with us on the first Saturday of the month.',
  links: [
    { link: { appearance: 'default', label: 'Donate' } },
    { link: { appearance: 'outline', label: 'Get involved' } },
  ],
  title: 'The next reach is Hollow Weir.',
}

/* ————————————————————————————————————————————————————————————————
 * Our Work — how a reach actually gets mended, and by whose agreement.
 * ———————————————————————————————————————————————————————————————— */

const workHero: HeroBasicDemoContent = {
  description:
    'We do not spread thin. A reach gets a full year of survey, a plan marked up by the people who own its banks, three years of work and ten of monitoring — and we say out loud what we will not be able to fix.',
  eyebrow: 'Our work',
  links: [],
  proofItems: [
    { label: 'Reach plans agreed with landowners' },
    { label: 'Three-year commitments' },
    { label: 'Ten years of monitoring' },
  ],
  title: 'Six reaches, worked in order.',
}

const workApproach: ContentSectionDemoContent = {
  eyebrow: 'How we work',
  links: [{ link: { appearance: 'outline', label: 'See the impact' } }],
  paragraphs: [
    {
      text: 'Every metre of the Corrow has an owner. Nothing happens on a reach until the farm, the angling club or the commoners who hold that bank have read the plan and marked it up. It is slower, and it is why the fences at Blackbank are still standing after nine winters.',
    },
    {
      text: 'We survey for a full year before we touch anything, so we know what August looks like as well as February. Any landowner can end their agreement with us, and we write the work so that the trees and the fences would stay if they did.',
    },
  ],
  title: 'Agreement first, then diggers.',
}

const workProgrammes: FeatureIconGridDemoContent = {
  description:
    'Each one has a named lead, a line in the accounts and a published monitoring record. Nothing here is a pilot.',
  eyebrow: 'Programmes',
  items: [
    {
      description:
        'Alder, willow and hazel along the south banks, grown on from local seed and guarded until the deer lose interest.',
      icon: 'shield',
      title: 'Bankside planting',
    },
    {
      description:
        'Barriers argued one at a time on their own evidence. Four eased so far; two left in place, and we explain why.',
      icon: 'zap',
      title: 'Barrier work',
    },
    {
      description:
        'Clean gravel returned to the runs the ford widening buried in the seventies, then counted for trout redds each winter.',
      icon: 'database',
      title: 'Spawning gravels',
    },
    {
      description:
        'Balsam and knotweed walked reach by reach every June, and a hard line held against signal crayfish above Hollow Weir.',
      icon: 'fingerprint',
      title: 'Invasive species',
    },
    {
      description:
        'Fencing, gates and alternative cattle water, so a buffer strip costs a working farm grazing rather than goodwill.',
      icon: 'id-card',
      title: 'Farm advice',
    },
    {
      description:
        'Thirty-one points read monthly by trained volunteers to a written protocol, with the raw readings published.',
      icon: 'chart',
      title: 'Monitoring',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'See the impact' } }],
  title: 'The six things we are funded to do.',
}

const workProjects: ContentSectionDemoContent = {
  eyebrow: 'On the ground now',
  paragraphs: [
    { text: 'Where this year’s money and Saturdays are going.' },
  ],
  rows: [
    {
      description:
        'Nine hundred metres of collapsing bank, held with willow spiling and planted through with alder. The beck below ran the colour of tea after every storm; last winter it ran clear twice.',
      title: 'Reach two — Blackbank',
    },
    {
      description:
        'The shallows here silted over when the ford was widened in the seventies. We have moved clean gravel back in three stages and counted trout redds on it for two seasons running.',
      title: 'Reach four — Ferney Ford',
    },
    {
      description:
        'The last barrier before the tide. Survey done, agreement signed with the mill, and the notch waiting on the winter window. This is the reach we are raising for.',
      title: 'Reach six — Hollow Weir',
    },
  ],
  title: 'Three reaches in the work, one waiting on the weather.',
}

const workField: ContentSectionDemoContent = {
  eyebrow: 'A First Saturday',
  paragraphs: [
    {
      text: 'Thirty-odd people, a trailer of stakes, two flasks and a job list written on the back of a survey sheet. We stop at one o’clock. Nobody has ever been turned away for not knowing anything about rivers.',
    },
  ],
  title: 'Half past eight at Ferney Ford, whatever the weather.',
}

const workFaq: FaqDemoContent = {
  description: 'The questions that come up on the bank most months, answered the way we answer them there.',
  eyebrow: 'Straight answers',
  items: [
    {
      answer:
        'On the Corrow, yes, and we can show you the graph. Shaded runs at Blackbank held two and a half degrees cooler than the open reach above them through last August — the difference between trout being uncomfortable and trout dying.',
      question: 'Does planting trees really cool a river?',
    },
    {
      answer:
        'Because some hold up water a farm or a mill depends on, and one is the only thing keeping signal crayfish out of the upper river. We argue each barrier on its own evidence, and we have left two standing.',
      question: 'Why not take every weir out?',
    },
    {
      answer:
        'The bed and the banks belong to the people whose land they cross. We work by written agreement with every one of them, and any of them can end that agreement at any time.',
      question: 'Who owns the river?',
    },
    {
      answer:
        'The trees and the fences stay. Monitoring drops from monthly to seasonal, and we say so publicly rather than quietly thinning the record and hoping nobody reads it.',
      question: 'What happens if the funding stops?',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'Get involved' } }],
  title: 'What people ask us on the bank',
}

const workCta: CtaDemoContent = {
  description:
    'The work makes far more sense standing in it. First Saturday of the month, Ferney Ford car park, half past eight — boots and a flask, nothing else needed.',
  links: [
    { link: { appearance: 'default', label: 'Get involved' } },
    { link: { appearance: 'outline', label: 'Donate' } },
  ],
  title: 'Come and see a reach.',
}

/* ————————————————————————————————————————————————————————————————
 * Impact — the proof spine. Numbers first, including the bad ones.
 * ———————————————————————————————————————————————————————————————— */

const impactHero: HeroBasicDemoContent = {
  description:
    'Everything on this page comes from our own monitoring on the Corrow: thirty-one points, read every month, published whole — including the two years our figures were corrected downward.',
  eyebrow: 'Impact',
  links: [],
  proofItems: [
    { label: '31 monitoring points' },
    { label: 'Read monthly since 2016' },
    { label: 'Raw readings published' },
  ],
  title: 'What nine years of Saturdays actually changed.',
}

const impactNumbers: ContentSectionDemoContent = {
  eyebrow: 'The record',
  features: [
    {
      description:
        'Shaded reaches held two and a half degrees cooler than open reaches through the last three Augusts.',
      icon: 'gauge',
      title: 'Temperature is down',
    },
    {
      description:
        'Turbidity after heavy rain has roughly halved on the fenced sections at Blackbank and Sedge Mill.',
      icon: 'shield',
      title: 'Silt is down',
    },
    {
      description:
        'Redd counts are up on two reaches and flat on a third — and we cannot yet separate our work from two mild winters.',
      icon: 'sparkles',
      title: 'Fish, honestly',
    },
  ],
  paragraphs: [
    {
      text: 'Habitat work shows up in the counts within about three years. Water chemistry takes longer. Fish recovery is the slowest thing we measure and the easiest to claim dishonestly, so we report it as a range and name the things we cannot rule out.',
    },
  ],
  stats: [
    { label: 'native trees in the ground since 2016', value: '11,400' },
    { label: 'of riverbank fenced against stock', value: '6.2 km' },
    { label: 'cooler in shaded reaches last August', value: '2.5°C' },
    { label: 'monitoring points read every month', value: '31' },
  ],
  title: 'Three things we can prove, and one we cannot.',
}

const impactProof: StatsProofDemoContent = {
  author: 'Marion Ashcroft',
  body: 'We publish the protocol, the raw readings, and the springs where the two sets of numbers disagreed.',
  description:
    'Our monitoring is done by trained volunteers to a written protocol, then spot-checked each spring by the Northwind Catchment Partnership — the landowners, angling clubs and commoners who share this river with us.',
  eyebrow: 'Checked by our neighbours',
  metrics: [
    { label: 'years of unbroken monthly readings', value: '9' },
    { label: 'trained volunteer surveyors', value: '148' },
    { label: 'years our figures were corrected downward', value: '2' },
    { label: 'of readings published raw', value: '100%' },
  ],
  quote:
    'We came in expecting the usual optimism. What we found was a spreadsheet with the bad springs left in it, and a protocol we could follow ourselves.',
  role: 'Chair, Northwind Catchment Partnership',
  title: 'The counts, and who checks them.',
}

const impactQuote: ContentSectionDemoContent = {
  citation: 'Wynn Tregarth, Sedge Mill Farm',
  eyebrow: 'A farm on reach three',
  paragraphs: [
    {
      text: 'Sedge Mill Farm gave up about an acre of grazing to the buffer strip we asked for in 2019. It took two winters of talking, a new water supply for the cattle, and a plan the family wrote half of themselves.',
    },
  ],
  quote:
    'I was against it and I said so loudly. Then the beck stopped running brown and my heifers stopped standing in it. I would put that fence up again tomorrow.',
  title: 'The fence everybody argued about.',
}

const impactCommunityVoice: TestimonialDemoContent = {
  description:
    'Volunteers, anglers, farmers and people who simply walk the river path — collected at the last two open days at the Gauge House.',
  eyebrow: 'From the catchment',
  items: [
    {
      author: 'Dilys Frayne',
      quote: 'Eleven years of Saturdays. The bank behind our house is still there because of them.',
      role: 'First Saturday volunteer',
    },
    {
      author: 'Wynn Tregarth',
      quote: 'They asked before they planned, which is not how this usually goes with a farm.',
      role: 'Sedge Mill Farm',
    },
    {
      author: 'Jory Penhale',
      quote:
        'We had not seen a sea trout above the ford since I was a boy. Two last September, both photographed.',
      role: 'Corrow Anglers',
    },
    {
      author: 'Bev Odogwu',
      quote: 'The peat work upstream matters as much as the pretty bits, and they treat it that way.',
      role: 'Kilnmoss Commoners',
    },
    {
      author: 'Errol Tamm',
      quote: 'I read the same three points every month. It is dull, and the whole record rests on it.',
      role: 'Volunteer surveyor',
    },
    {
      author: 'Fen Aldiss',
      quote: 'Our Year Fives have planted two hundred trees they can walk down and visit.',
      role: 'Teacher, Ferney Ford school',
    },
    {
      author: 'Maribel Cazorla',
      quote: 'You can hear the shallows again at Blackbank. That is the thing I notice.',
      role: 'River path walker',
    },
    {
      author: 'Rhodri Snell',
      quote: 'They were straight with me about what the notch would cost me and what it would not.',
      role: 'Hollow Weir Mill',
    },
    {
      author: 'Sena Okiro',
      quote: 'Came for a school project. Stayed four years, and now I run the stakes trailer.',
      role: 'Work-party volunteer',
    },
  ],
  title: 'People who live with this river.',
}

const impactCta: CtaDemoContent = {
  description:
    'One notch in one barrier opens eleven miles of gravel to sea trout. It is the single biggest change left on the Corrow, and it is what we are raising for now.',
  links: [
    { link: { appearance: 'default', label: 'Donate' } },
    { link: { appearance: 'outline', label: 'Get involved' } },
  ],
  title: 'Hollow Weir is the next number on this page.',
}

/* ————————————————————————————————————————————————————————————————
 * Get Involved — the volunteer path, in place of a pricing page.
 * ———————————————————————————————————————————————————————————————— */

const involvedHero: HeroBasicDemoContent = {
  description:
    'There are four ways in. The first one takes a Saturday morning and a pair of boots you do not mind ruining; the rest we will teach you on the bank.',
  eyebrow: 'Get involved',
  links: [],
  proofItems: [
    { label: 'First Saturday, every month' },
    { label: 'Ferney Ford, half past eight' },
    { label: 'Every tool lent' },
  ],
  title: 'Nobody has ever been turned away for not knowing about rivers.',
}

const involvedHowToHelp: FeatureSectionDemoContent = {
  description: 'No sign-up form, no induction evening, and none of your own equipment.',
  eyebrow: 'Your first Saturday',
  items: [
    {
      description:
        'Ferney Ford car park, half past eight, first Saturday of the month. Look for the trailer and the flasks, tell somebody your name, and they will pair you with a regular.',
      title: 'Turn up at the ford',
    },
    {
      description:
        'Everybody starts on stakes or planting bags. You will be shown twice and then left to it, and somebody will quietly straighten your first three posts.',
      title: 'Do one job badly',
    },
    {
      description:
        'We finish at one o’clock whatever is left undone. Most people stand about at the tailgate for half an hour afterwards, which is where the trust actually gets built.',
      title: 'Stop at one',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'See our work' } }],
  title: 'How a first morning actually goes.',
}

const involvedRoles: ContentSectionDemoContent = {
  eyebrow: 'Other ways in',
  links: [{ link: { appearance: 'outline', label: 'See the impact' } }],
  paragraphs: [
    {
      text: 'Work-party volunteers plant, fence and shift gravel one Saturday a month. Surveyors read a fixed point every month for a year. Bank hosts let us cross their land and keep an eye on a stretch. Committee volunteers do the minutes, the grant forms and the tea rota.',
    },
    {
      text: 'The one we are always short of is surveyors — forty minutes a month, in the same place, with a kit we lend you and a protocol on one laminated sheet. Nine years of that record is the only reason anybody believes our numbers.',
    },
  ],
  title: 'Four roles, and the one we are always short of.',
}

const involvedCommunity: ContentSectionDemoContent = {
  avatars: [
    { name: 'Dilys Frayne' },
    { name: 'Errol Tamm' },
    { name: 'Sena Okiro' },
    { name: 'Bev Odogwu' },
    { name: 'Jory Penhale' },
    { name: 'Maribel Cazorla' },
    { name: 'Fen Aldiss' },
    { name: 'Wynn Tregarth' },
    { name: 'Rhodri Snell' },
    { name: 'Callum Rae' },
    { name: 'Ada Pengelly' },
    { name: 'Wilf Grieve' },
    { name: 'Ruth Oyelaran' },
    { name: 'Tom Fairhurst' },
  ],
  eyebrow: 'The First Saturday regulars',
  paragraphs: [
    {
      text: 'Farmers, anglers, a retired hydrologist, a Year Five class with permission slips, and a great many people who simply live near a river and would rather it were better than it is.',
    },
  ],
  title: 'About two hundred people. Thirty of them most months.',
}

const involvedFaq: FaqDemoContent = {
  description: 'The things people email us the week before their first Saturday.',
  eyebrow: 'Before you come',
  items: [
    {
      answer:
        'For most jobs, no. Planting and bagging are done sitting down as often as standing up, and two of our longest-serving volunteers work from the tailgate and never go near the water.',
      question: 'Do I need to be fit?',
    },
    {
      answer:
        'Boots you do not mind ruining and layers you can lose. We lend waders, gloves and every tool. If it is raining we still go out; if the river is in flood we do not.',
      question: 'What should I wear?',
    },
    {
      answer:
        'Yes, on the planting and litter mornings, one adult each. In-water work is sixteen and over, because of how fast the current runs through the ford.',
      question: 'Can I bring children?',
    },
    {
      answer:
        'Come to that one. The autumn planting weekend is built almost entirely out of people who come once a year, and it puts about three thousand trees in the ground.',
      question: 'I can only manage one morning a year.',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'See our work' } }],
  title: 'Practical questions',
}

const involvedCta: CtaDemoContent = {
  description:
    'Come to a First Saturday if you can give a morning. Give to the work if you cannot — the tree stock and the fencing wire have to be paid for either way.',
  links: [
    { link: { appearance: 'default', label: 'Donate' } },
    { link: { appearance: 'outline', label: 'See our work' } },
  ],
  title: 'The river needs both kinds of help.',
}

/* ————————————————————————————————————————————————————————————————
 * Donate — named giving paths, priced in river work rather than money.
 * ———————————————————————————————————————————————————————————————— */

const donateHero: HeroBasicDemoContent = {
  description:
    'We do not publish suggested amounts, because the honest answer depends on what the reach needs that year. Choose the kind of giving that suits you, tell us what you want it to do, and we will write back with the reach it went to.',
  eyebrow: 'Donate',
  links: [],
  proofItems: [
    { label: 'No suggested amounts' },
    { label: 'Every gift assigned to a reach' },
    { label: 'Accounts published in full' },
  ],
  title: 'What your giving buys, in metres and trees.',
}

const donateWaysToGive: FeatureCardsMediaDemoContent = {
  description:
    'Each path is tied to a real line in the work plan, so we can tell you what your giving did rather than what it might have done.',
  eyebrow: 'Ways to give',
  items: [
    {
      description:
        'A regular monthly gift, at whatever size you set it. Guardians are what let us commit three years to a reach instead of one, and they pay for the monitoring nobody else will fund.',
      icon: 'shield',
      title: 'River Guardians',
    },
    {
      description:
        'One gift that carries a named reach through a full year — its planting, its fencing, its survey kit. You get that reach’s monitoring record and an invitation to walk it in spring.',
      icon: 'id-card',
      title: 'Adopt a reach',
    },
    {
      description:
        'A tribute gift plants a named group of trees on the reach of your choosing. We send the grid reference and a photograph the following spring, and the name goes into the planting log.',
      icon: 'fingerprint',
      title: 'In memory',
    },
    {
      description:
        'A tractor day, a load of stakes, a surveyor’s afternoon, a field to store spoil in. Half of what happens on the Corrow never passes through the bank account at all.',
      icon: 'zap',
      title: 'Gifts in kind',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'See the impact' } }],
  title: 'Four named paths, and what each one funds.',
}

const donateWhatItFunds: ContentSectionDemoContent = {
  eyebrow: 'Where it goes',
  features: [
    {
      description:
        'Tree stock, guards, stakes and the willow we cut ourselves — the cheapest work we do and the slowest to show.',
      icon: 'sparkles',
      title: 'Into the ground',
    },
    {
      description:
        'Fencing, gates and the alternative cattle water that makes a buffer strip acceptable to a working farm.',
      icon: 'shield',
      title: 'Along the bank',
    },
    {
      description:
        'Survey kit, lab tests and the small amount of paid time it takes to keep nine years of monthly readings honest.',
      icon: 'gauge',
      title: 'On the record',
    },
  ],
  paragraphs: [
    {
      text: 'Most of what a river costs is stakes, wire, tree guards, fuel for the trailer and somebody’s time reading a gauge in February. We would rather show you that list than a photograph of a kingfisher.',
    },
  ],
  stats: [
    { label: 'of what we spend goes straight into the catchment', value: '81%' },
    { label: 'of our income comes from River Guardians', value: '34%' },
    { label: 'of accounts published in full', value: '9 years' },
    { label: 'of it spent on paid fundraisers', value: 'None' },
  ],
  title: 'The unglamorous list.',
}

const donateContact: ContactRoutingFormDemoContent = {
  channels: [
    {
      description: 'Marta and Nerys read this one. A person replies, usually within two working days.',
      label: 'The giving team',
      value: 'giving@rivermouth.example',
    },
    {
      description: 'The Gauge House, Ferney Ford — for legacies, and anything you would rather not email.',
      label: 'By post',
      value: 'Rivermouth Trust, Ferney Ford',
    },
  ],
  description:
    'Nothing is taken on this page. Tell us which path suits you and, if you like, the reach you want it to go to, and somebody will ring you back to set it up.',
  eyebrow: 'Set up a gift',
  formConfigured: true,
  formDescription:
    'The more you tell us about what you want your giving to do, the better we can match it to a reach that needs it.',
  formLabels: ['Name', 'Email', 'Which path', 'Phone (optional)', 'What you would like your gift to do'],
  formTitle: 'Set up a gift',
  submitLabel: 'Send this to the giving team',
  title: 'Tell us what you want your giving to do.',
}

const donateFaq: FaqDemoContent = {
  description: 'Including the two we get asked most often and answer least comfortably.',
  eyebrow: 'Giving questions',
  items: [
    {
      answer:
        'We deliberately do not suggest a figure. A Guardian gift you will not notice each month is worth more to a three-year reach plan than a single large one, and a load of stakes from a farm is worth more than either. Tell us what you can do and we will tell you what it funds.',
      question: 'How much should I give?',
    },
    {
      answer:
        'Yes, for adoptions and tribute gifts. Guardian income is pooled on purpose, because the reaches nobody wants to sponsor — the peat flats, the culverted middle — are usually the ones doing the most good.',
      question: 'Can I say which reach my gift goes to?',
    },
    {
      answer:
        'Most of it, and we publish the split every year in the accounts rather than on a poster. Four people are paid, and the fundraising is done by trustees and volunteers.',
      question: 'How much of it reaches the river?',
    },
    {
      answer:
        'Email or telephone and it stops that month. We do not ask you to explain, we never pass your details on, and we will not ring you about it afterwards.',
      question: 'What if I want to stop?',
    },
  ],
  links: [{ link: { appearance: 'outline', label: 'See the impact' } }],
  title: 'What people ask before they give',
}

export const nonprofitCauseTemplate: TemplateShowcase = {
  assets: [],
  category: 'nonprofit',
  description:
    'Rivermouth Trust is a fictional river trust mending nine miles of the invented River Corrow. Five pages — Home, Our Work, Impact, Get Involved and Donate — carry the one register the rest of the gallery does not: the ask is give and volunteer, the persuasion is done by published monitoring rather than promises, and the Donate page names four giving paths instead of amounts. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Our Work', path: 'work' },
    { label: 'Impact', path: 'impact' },
    { label: 'Get Involved', path: 'involved' },
    { label: 'Donate', path: 'donate' },
  ],
  pages: [
    {
      description:
        'Opens on the river itself, states what the trust does, shows the measured impact, and invites people onto the bank.',
      label: 'Home',
      path: '',
      sections: [
        { componentSlug: 'hero-video', content: homeCatchment, id: 'catchment' },
        {
          componentSlug: 'logo-cloud-marquee',
          content: homePartners,
          id: 'partners',
          tone: 'muted',
        },
        { componentSlug: 'content-showcase', content: homeTheWork, id: 'the-work' },
        { componentSlug: 'stats-proof', content: homeImpact, id: 'impact', tone: 'contrast' },
        { componentSlug: 'content-image-lead', content: homePlace, id: 'place' },
        { componentSlug: 'testimonials-quote', content: homeVoice, id: 'voice', tone: 'muted' },
        { componentSlug: 'team-roster', content: homePeople, id: 'people' },
        {
          componentSlug: 'call-to-action-centered',
          content: homeCta,
          id: 'cta',
          tone: 'muted',
        },
      ],
      title: 'Rivermouth Trust — Restoring a river, reach by reach',
    },
    {
      description:
        'Explains the six conservation programmes, the landowner agreements they depend on, and the three reaches in the work now.',
      label: 'Our Work',
      path: 'work',
      sections: [
        { componentSlug: 'hero-basic', content: workHero, id: 'hero' },
        { componentSlug: 'content-columns', content: workApproach, id: 'approach' },
        {
          componentSlug: 'feature-icon-grid',
          content: workProgrammes,
          id: 'programmes',
          tone: 'muted',
        },
        { componentSlug: 'content-rows', content: workProjects, id: 'projects' },
        {
          componentSlug: 'content-image-frame',
          content: workField,
          id: 'field',
          tone: 'contrast',
        },
        { componentSlug: 'faq-accordion', content: workFaq, id: 'faq' },
        { componentSlug: 'call-to-action-boxed', content: workCta, id: 'cta', tone: 'muted' },
      ],
      title: 'Rivermouth Trust — Our Work',
    },
    {
      description:
        'Reports the monitoring honestly — what nine years of counts prove, what they cannot, and who checks them.',
      label: 'Impact',
      path: 'impact',
      sections: [
        { componentSlug: 'hero-basic', content: impactHero, id: 'hero' },
        { componentSlug: 'content-stats', content: impactNumbers, id: 'numbers' },
        { componentSlug: 'stats-proof', content: impactProof, id: 'proof', tone: 'contrast' },
        { componentSlug: 'content-quote', content: impactQuote, id: 'quote' },
        {
          componentSlug: 'testimonials-wall',
          content: impactCommunityVoice,
          id: 'community-voice',
          tone: 'muted',
        },
        { componentSlug: 'call-to-action-boxed', content: impactCta, id: 'cta' },
      ],
      title: 'Rivermouth Trust — Impact',
    },
    {
      description:
        'Lays out how a first volunteer morning actually goes, the four roles, and the practical questions people ask first.',
      label: 'Get Involved',
      path: 'involved',
      sections: [
        { componentSlug: 'hero-basic', content: involvedHero, id: 'hero' },
        { componentSlug: 'feature-steps', content: involvedHowToHelp, id: 'how-to-help' },
        { componentSlug: 'content-columns', content: involvedRoles, id: 'roles', tone: 'muted' },
        {
          componentSlug: 'content-community',
          content: involvedCommunity,
          id: 'community',
          tone: 'contrast',
        },
        { componentSlug: 'faq-split', content: involvedFaq, id: 'faq' },
        {
          componentSlug: 'call-to-action-centered',
          content: involvedCta,
          id: 'cta',
          tone: 'muted',
        },
      ],
      title: 'Rivermouth Trust — Get Involved',
    },
    {
      description:
        'Names four giving paths and what each one funds in river work — deliberately without a single currency amount.',
      label: 'Donate',
      path: 'donate',
      sections: [
        { componentSlug: 'hero-basic', content: donateHero, id: 'hero' },
        {
          componentSlug: 'feature-cards-media',
          content: donateWaysToGive,
          id: 'ways-to-give',
          tone: 'muted',
        },
        {
          componentSlug: 'content-stats',
          content: donateWhatItFunds,
          id: 'what-it-funds',
          tone: 'contrast',
        },
        { componentSlug: 'contact-routing-form', content: donateContact, id: 'contact' },
        { componentSlug: 'faq-card', content: donateFaq, id: 'faq', tone: 'muted' },
      ],
      title: 'Rivermouth Trust — Donate',
    },
  ],
  revision: 2,
  schemaVersion: 1,
  slug: 'nonprofit-cause',
  status: 'concept',
  summary:
    'A place-led site for a fictional river trust, where the ask is give and volunteer and the proof is published monitoring.',
  theme: {
    description:
      'River green and silt over oat paper. Every backend-free plate is a stratified landscape still built from the brand tints — mist, treeline, waterline, deepening water — mounted square behind a hairline, and the impact numerals carry the display weight.',
    id: 'nonprofit-cause',
    swatches: ['#f4f3ea', '#1c2b23', '#3f7a67'],
  },
  title: 'Nonprofit Cause',
  visualTone: ['Sincere', 'Place-led', 'Measured'],
}
