import type { ComparatorTableDemoContent, PricingPlanDemo } from '@/lib/demo-content'

import type { TemplateShowcase } from './types'

/* Fintech — "Ledgerline", a fictional money-movement infrastructure platform.
 *
 * Art direction: serious, precise, institutional — the kind of infrastructure a
 * CFO signs off on. Trust is earned with specificity (rails, windows, bps,
 * p99s, reconciliation coverage), never with adjectives. One product story runs
 * across the five pages:
 *
 *   Home      states the thesis (one ledger under every movement) and proves it
 *   Product   the three primitives, the daily work, and the path to first volume
 *   Security  controls, written guarantees, and the compliance posture
 *   Pricing   one metered rate on settled volume, with the full tier matrix
 *   Contact   three named desks at the reserved ledgerline.example domain
 *
 * Everything is fictional: Ledgerline is not a real company, and its customers
 * (Northwind, Globex, Initech, Vandelay), people, figures, and
 * compliance posture are invented and illustrative. Compliance language stays
 * generic on purpose: industry program names only, never a named auditor,
 * certificate number, regulator, or bank partner.
 *
 * Pricing is expressed in basis points of settled volume rather than currency
 * amounts — deliberate for the product (volume-metered infrastructure) and it
 * keeps every template surface free of literal price strings.
 *
 * All copy stays editor-shaped (demo-content types); layout belongs to the
 * twins and the Ledgerline shell/theme. */

/* One pricing truth for the whole site: the Home teaser and the Pricing page
 * render the same three tiers, and the comparator matrix below index-aligns to
 * this order (Core, Scale, Reserve). */
const ledgerlinePlans: PricingPlanDemo[] = [
  {
    description: 'Metered monthly, no platform fee',
    features: [
      'Double-entry ledger and audit trail',
      'Two settlement rails, six currencies',
      'Daily reconciliation exports',
      'Shared implementation queue',
    ],
    link: { appearance: 'outline', label: 'Start an evaluation' },
    name: 'Core',
    period: 'of settled volume',
    /* Non-breaking space: the pricing card's price/period row is narrow at the
     * tablet breakpoint and "24 bps" would otherwise break across two lines. */
    price: '24 bps',
  },
  {
    description: 'Volume-tiered, stepping down from 24 bps',
    featured: true,
    features: [
      'Everything in Core',
      'Nine settlement rails, 34 currencies',
      'Sub-ledger per counterparty',
      'Signed webhooks with 90-day replay',
      'Named implementation engineer',
    ],
    link: { appearance: 'default', label: 'Talk to an engineer' },
    name: 'Scale',
    period: 'of settled volume',
    price: '11 bps',
  },
  {
    description: 'Committed volume, negotiated rate',
    features: [
      'Everything in Scale',
      'Dedicated ledger cluster and region',
      'Custom settlement windows',
      'Quarterly control review',
    ],
    link: { appearance: 'outline', label: 'Contact the desk' },
    name: 'Reserve',
    price: 'Custom',
  },
]

/* The dense tier matrix — the page's institutional centrepiece. Values are
 * index-aligned to ledgerlinePlans (Core, Scale, Reserve). */
const ledgerlineComparator: ComparatorTableDemoContent = {
  description:
    'The full matrix. The ledger, the audit trail, and the reconciliation engine are in every tier — they are never the upsell.',
  features: [
    {
      feature: 'Settlement rails',
      groupLabel: 'Volume and rails',
      values: [{ label: '2' }, { label: '9' }, { label: 'All rails' }],
    },
    {
      feature: 'Settlement currencies',
      values: [{ label: '6' }, { label: '34' }, { label: '34 + custom' }],
    },
    {
      feature: 'Monthly settled volume',
      values: [{ label: 'Up to 40M' }, { label: 'Up to 2B' }, { label: 'Uncapped' }],
    },
    {
      feature: 'Payout windows per day',
      values: [{ label: '1' }, { label: '4' }, { label: 'Custom' }],
    },
    {
      feature: 'Double-entry ledger',
      groupLabel: 'Ledger',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Immutable audit trail',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'Sub-ledger per counterparty',
      values: [{}, { included: true }, { included: true }],
    },
    {
      feature: 'Event replay window',
      values: [{ label: '7 days' }, { label: '90 days' }, { label: 'Full history' }],
    },
    {
      feature: 'Reconciliation exports',
      values: [{ label: 'Daily' }, { label: 'Hourly' }, { label: 'Streaming' }],
    },
    {
      feature: 'SOC 2 Type II report',
      groupLabel: 'Controls and compliance',
      values: [{ included: true }, { included: true }, { included: true }],
    },
    {
      feature: 'SSO and SCIM',
      values: [{}, { included: true }, { included: true }],
    },
    {
      feature: 'Maker-checker approvals',
      values: [{}, { included: true }, { included: true }],
    },
    {
      feature: 'Dedicated ledger cluster',
      values: [{}, {}, { included: true }],
    },
    {
      feature: 'Named implementation engineer',
      groupLabel: 'Coverage',
      values: [{}, { included: true }, { included: true }],
    },
    {
      feature: 'Quarterly control review',
      values: [{}, {}, { included: true }],
    },
  ],
  plans: [
    { links: [{ link: { appearance: 'outline', label: 'Start an evaluation' } }], name: 'Core' },
    {
      badge: 'Most programs',
      highlighted: true,
      links: [{ link: { appearance: 'default', label: 'Talk to an engineer' } }],
      name: 'Scale',
    },
    { links: [{ link: { appearance: 'outline', label: 'Contact the desk' } }], name: 'Reserve' },
  ],
  title: 'Compare every tier',
}

export const fintechTrustTemplate: TemplateShowcase = {
  assets: [],
  category: 'fintech',
  description:
    'Ledgerline is a fictional money-movement infrastructure platform: a dense, institutional, trust-first fintech marketing site concept spanning Home, Product, Security, Pricing, and Contact — deep ink and cool-slate surfaces, a restrained teal used only as signal, tabular figures and hairline rules throughout, and inverted paper bands wherever the numbers and written guarantees live. Composed entirely from blocks in the open registry.',
  navigation: [
    { label: 'Home', path: '' },
    { label: 'Product', path: 'product' },
    { label: 'Security', path: 'security' },
    { label: 'Pricing', path: 'pricing' },
    { label: 'Contact', path: 'contact' },
  ],
  pages: [
    {
      description: 'Explains the platform, proves reliability, and resolves trust up front.',
      label: 'Home',
      path: '',
      sections: [
        {
          /* The aurora hero as a cool instrument glow rather than a launch
           * firework: the word cascade closes on a serif-italic "line." (the
           * brand's own name element), and the count-up ticker carries the three
           * figures a treasury team asks for first — volume, latency, uptime.
           * CTAs map to real routes: Talk to an engineer → contact, Read the
           * security posture → security. */
          componentSlug: 'hero-aurora',
          content: {
            description:
              'Ledgerline is the ledger, payout, and reconciliation layer underneath your product — one immutable record across every rail, currency, and settlement window.',
            eyebrow: 'Money movement infrastructure',
            imageCaption: 'Authorization, settlement, fees, and reversals — posted to one record.',
            links: [
              { link: { appearance: 'default', label: 'Talk to an engineer' } },
              { link: { appearance: 'outline', label: 'Read the security posture' } },
            ],
            /* Terse labels on purpose: the ticker is a single instrument row,
             * and longer captions wrap it onto two lines at desktop width. */
            metrics: [
              { label: 'annualized volume', value: '412B' },
              { label: 'p99 ledger write', value: '38ms' },
              { label: '24-month uptime', value: '99.995%' },
            ],
            proofItems: [
              { label: 'SOC 2 Type II' },
              { label: 'PCI DSS Level 1' },
              { label: 'Double-entry by design' },
            ],
            title: 'Money movement you can prove, line by line.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'logo-cloud-marquee',
          content: { heading: 'Moving money on Ledgerline' },
          id: 'customers',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-bento',
          content: {
            description:
              'One system of record for money in motion: authorize, settle, reconcile, and prove — instead of stitching four vendors together and reconciling the seams by hand.',
            eyebrow: 'Platform',
            items: [
              {
                description:
                  'Every authorization, capture, payout, fee, and reversal posts as balanced entries. Nothing is edited: a correction is a new entry that references the one it corrects, so the history you show an examiner is the history that happened.',
                title: 'Double-entry ledger',
              },
              {
                description:
                  'Route each payout to the cheapest rail that still clears the window, with automatic failover when a rail degrades mid-batch.',
                title: 'Payout orchestration',
              },
              {
                description:
                  'Bank files, processor reports, and your ledger matched hourly — exceptions queued with context instead of buried in a spreadsheet.',
                title: 'Continuous reconciliation',
              },
              {
                description:
                  'Maker-checker approvals, per-counterparty limits, and an immutable trail on every write.',
                title: 'Controls in the record',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See the platform' } }],
            title: 'One ledger under every movement.',
          },
          id: 'platform',
        },
        {
          componentSlug: 'stats-proof',
          content: {
            author: 'Ines Kovač',
            body: 'Reconciliation is the figure that matters: unmatched entries are the ones that eventually become write-offs.',
            description:
              'Aggregate figures across Ledgerline programs for the twelve months ending March 2026.',
            eyebrow: 'Measured, not claimed',
            logoLabel: 'NORTHWIND',
            metrics: [
              { label: 'annualized settled volume', value: '412B' },
              { label: 'entries reconciled without a human', value: '99.7%' },
              { label: 'p99 ledger write latency', value: '38ms' },
              { label: 'rails availability, 24 months', value: '99.995%' },
            ],
            quote:
              'We closed the month in two days instead of nine. The ledger and the bank statements simply agreed, and nobody had to prove why.',
            role: 'Group Treasurer, Northwind',
            title: 'The figures auditors ask for first.',
          },
          id: 'proof',
          tone: 'contrast',
        },
        {
          componentSlug: 'integration-grid',
          content: {
            heading: 'Wired into the rails and systems you already run.',
            itemDescription:
              'Certified connection with signed webhooks, idempotent retries, and a replayable event log.',
            subtext:
              'Card processors, bank rails, ERPs, and your warehouse — connected with scoped credentials and no nightly export jobs to babysit.',
          },
          id: 'integrations',
        },
        {
          componentSlug: 'testimonials-spotlight',
          content: {
            testimonial: {
              author: 'Ruben Adeyemi',
              quote:
                'Our auditors asked us to walk one payout end to end and got the whole chain — authorization, rail, fee, reversal — in about four minutes. That used to be a two-week request.',
              role: 'VP Finance Systems, Globex',
            },
          },
          id: 'testimonial',
          tone: 'muted',
        },
        {
          componentSlug: 'pricing-cards-muted',
          content: {
            description:
              'One metered rate on volume that actually settles. No platform fee, no per-seat licensing, and no charge for the ledger, the audit trail, or reconciliation.',
            eyebrow: 'Pricing',
            plans: ledgerlinePlans,
            title: 'Priced on settled volume, not seats.',
          },
          id: 'pricing',
        },
        {
          componentSlug: 'faq-split',
          content: {
            description:
              'The four questions that come up before a treasury team points production volume at a new ledger.',
            eyebrow: 'Diligence',
            items: [
              {
                answer:
                  'No. Ledgerline is the system of record and the orchestration layer; your existing rail and processor relationships stay yours. We hold no customer funds.',
                question: 'Are you a bank, or in the flow of funds?',
              },
              {
                answer:
                  'Entries are append-only. A reversal or correction posts as a new balanced entry that references the original, so the trail reads forward and never rewrites itself.',
                question: 'What happens when a posted entry is wrong?',
              },
              {
                answer:
                  'Hourly against bank files and processor reports, with an optional streaming match for programs on continuous settlement. Unmatched entries route to a queue with the file, the rail response, and a suggested match attached.',
                question: 'How often does reconciliation run?',
              },
              {
                answer:
                  'A named implementation engineer runs the integration with your team. Most programs move first live volume on one rail in under three weeks, then add rails without re-integrating.',
                question: 'How long until we move real volume?',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Talk to the desk' } }],
            title: 'Asked in every diligence call.',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'Bring a week of real settlement files. We run them against a Ledgerline sandbox on the call and hand back the exception report before you hang up.',
            links: [
              { link: { appearance: 'default', label: 'Talk to an engineer' } },
              { link: { appearance: 'outline', label: 'Read the security posture' } },
            ],
            title: 'Put one ledger under every movement.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Ledgerline — Money movement, engineered for trust',
    },
    {
      description: 'Explains the core money-movement primitives and workflows.',
      label: 'Product',
      path: 'product',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'A small API over three objects, a settlement engine that knows every rail cut-off, and a reconciliation loop that never stops running. Everything else composes from those.',
            eyebrow: 'Product',
            links: [
              { link: { appearance: 'default', label: 'Talk to an engineer' } },
              { link: { appearance: 'outline', label: 'See pricing' } },
            ],
            proofItems: [
              { label: 'Nine settlement rails' },
              { label: '34 currencies' },
              { label: 'Immutable by default' },
            ],
            title: 'Authorize, settle, reconcile — on one record.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-split',
          content: {
            description:
              'The API surface is deliberately small. Payouts, refunds, fees, holds, and FX are all compositions of these three objects — which is why the ledger stays provable as the product grows.',
            eyebrow: 'The ledger model',
            items: [
              {
                description:
                  'Every counterparty, wallet, fee pool, and reserve is an account whose balance is derived from entries alone — never stored, never drifting.',
                title: 'Accounts',
              },
              {
                description:
                  'The atomic unit: a balanced debit and credit, timestamped, immutable, and addressable forever.',
                title: 'Entries',
              },
              {
                description:
                  'A transfer groups entries into one atomic movement across accounts and rails. It commits in full or it does not commit.',
                title: 'Transfers',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'See the security controls' } }],
            title: 'Three primitives. One record.',
          },
          id: 'primitives',
          tone: 'muted',
        },
        {
          componentSlug: 'feature-cards-media',
          content: {
            description:
              'The daily surfaces stay quiet because the ledger underneath them does the difficult part.',
            eyebrow: 'Daily work',
            items: [
              {
                description:
                  'Rails are scored on cost, cut-off, and current health. When one degrades mid-batch, the next takes the remainder — no manual re-run, no duplicate payouts.',
                icon: 'zap',
                title: 'Payouts that clear the window',
              },
              {
                description:
                  'Every unmatched entry lands in a queue with the source file, the rail response, and a suggested match. An analyst clears the exception in seconds instead of reconstructing it.',
                icon: 'chart',
                title: 'Exception queues, not mysteries',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'See pricing' } }],
            title: 'Built for the work of a settlement day.',
          },
          id: 'capabilities',
        },
        {
          componentSlug: 'feature-steps',
          content: {
            description:
              'A named implementation engineer runs the integration with your team. Most programs move first live volume in under three weeks.',
            eyebrow: 'Implementation',
            items: [
              {
                description:
                  'Declare counterparties, fee pools, and reserves. Balances derive from entries, so there is no legacy balance state to migrate or reconcile twice.',
                title: 'Model your accounts',
              },
              {
                description:
                  'One idempotent call posts balanced entries and returns the settlement window the movement will land in — with the rail already chosen.',
                title: 'Post your first transfer',
              },
              {
                description:
                  'Point Ledgerline at your bank and processor files. Matching runs hourly from the first day and exceptions route straight to your queue.',
                title: 'Turn on reconciliation',
              },
            ],
            links: [{ link: { appearance: 'default', label: 'Talk to an engineer' } }],
            title: 'Live on a rail in three steps.',
          },
          id: 'flow',
          tone: 'muted',
        },
        {
          componentSlug: 'integration-cluster',
          content: {
            heading: 'At the centre of your money stack.',
            links: [{ link: { appearance: 'outline', label: 'Talk to an engineer' } }],
            subtext:
              'Card processors, bank rails, ERPs, and data warehouses connect with scoped credentials and signed, replayable webhooks — Ledgerline stays the record, never the bottleneck.',
          },
          id: 'ecosystem',
        },
        {
          componentSlug: 'content-quote',
          content: {
            citation: 'Sofia Brandt, Head of Payment Operations, Initech',
            eyebrow: 'In their words',
            logoLabel: 'INITECH',
            paragraphs: [
              {
                text: 'Initech settles to sixty-one thousand counterparties across four rails on a single Ledgerline workspace. Operations dropped from three reconciliation spreadsheets to one exception queue, and the month-end close moved from a project to a morning.',
              },
            ],
            quote:
              'The part nobody advertises is the exception queue. It turned reconciliation from detective work into a list you finish.',
            title: 'What changes when the ledger is the source of truth.',
          },
          id: 'quote',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-centered',
          content: {
            description:
              'Bring last week of settlement files. We run them against a sandbox ledger on the call and hand back the exception report.',
            links: [
              { link: { appearance: 'default', label: 'Talk to an engineer' } },
              { link: { appearance: 'outline', label: 'See pricing' } },
            ],
            title: 'Reconcile a real week with us.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Ledgerline — Product',
    },
    {
      description: 'Details the compliance posture, controls, and infrastructure guarantees.',
      label: 'Security',
      path: 'security',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'Ledgerline is built for the review that comes after the integration: immutable records, least-privilege access, and evidence you export rather than assemble.',
            eyebrow: 'Security and compliance',
            links: [
              { link: { appearance: 'default', label: 'Talk to the security desk' } },
              { link: { appearance: 'outline', label: 'See the platform' } },
            ],
            proofItems: [
              { label: 'SOC 2 Type II' },
              { label: 'PCI DSS Level 1' },
              { label: 'Annual third-party audit' },
            ],
            title: 'Controls you can show an examiner.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'feature-icon-grid',
          content: {
            description:
              'Every control below is enforced by the ledger itself rather than layered over it — which is why the evidence is exportable instead of reconstructed.',
            eyebrow: 'Controls',
            items: [
              {
                description:
                  'Entries are append-only. A correction is a new balanced entry referencing the one it corrects, so history never rewrites itself.',
                icon: 'shield',
                title: 'Immutable ledger',
              },
              {
                description:
                  'Payout batches over your threshold need a second approver. The approval, the approver, and the timestamp are part of the record, not a log line beside it.',
                icon: 'fingerprint',
                title: 'Maker-checker approvals',
              },
              {
                description:
                  'Roles map to your identity provider and scope per account tree and per rail. SSO and SCIM are standard from the Scale tier, never a bolt-on.',
                icon: 'id-card',
                title: 'Least-privilege access',
              },
              {
                description:
                  'AES-256 at rest, TLS 1.3 in transit, and per-region ledger clusters so records stay in the jurisdiction that governs them.',
                icon: 'database',
                title: 'Encryption and residency',
              },
              {
                description:
                  'Rail health, balance drift, and reconciliation coverage are watched on the same dashboards our on-call engineers page from.',
                icon: 'chart',
                title: 'Continuous monitoring',
              },
              {
                description:
                  'Export the full chain for any transfer — authorization, approvals, rail responses, fees, reversals — as a signed archive with a verifiable hash.',
                icon: 'zap',
                title: 'Evidence on demand',
              },
            ],
            links: [{ link: { appearance: 'outline', label: 'Talk to the security desk' } }],
            title: 'Controls that are part of the record.',
          },
          id: 'controls',
        },
        {
          componentSlug: 'content-stats',
          content: {
            eyebrow: 'Guarantees',
            features: [
              {
                description:
                  'Customer funds stay in accounts separate from operating capital and are reconciled to the ledger daily.',
                icon: 'lock',
                title: 'Segregated balances',
              },
              {
                description:
                  'A contractual monthly availability target on the ledger API, with service credits when we miss it.',
                icon: 'gauge',
                title: 'Availability commitment',
              },
              {
                description:
                  'Written notification within 24 hours of a confirmed incident affecting your records, with the remediation plan attached.',
                icon: 'shield',
                title: 'Incident notification',
              },
            ],
            paragraphs: [
              {
                text: 'A security page is only worth the commitments it is willing to put in a contract. These are ours, in the same words our agreements use.',
              },
            ],
            stats: [
              { label: 'monthly availability commitment', value: '99.99%' },
              { label: 'confirmed-incident notification', value: '24 hours' },
              { label: 'reconciliation of customer balances', value: 'Daily' },
              { label: 'audit evidence retention', value: '7 years' },
            ],
            title: 'What we commit to in writing.',
          },
          id: 'guarantees',
          tone: 'contrast',
        },
        {
          componentSlug: 'content-columns',
          content: {
            eyebrow: 'Compliance posture',
            links: [{ link: { appearance: 'default', label: 'Talk to the security desk' } }],
            paragraphs: [
              {
                text: 'Ledgerline maintains SOC 2 Type II and PCI DSS Level 1 programs, an ISO 27001-aligned control set, and an annual third-party penetration test. Reports and the current control matrix go out under mutual NDA during diligence.',
              },
              {
                text: 'Every finding, remediation, and control change is tracked in the same system the engineering team ships from. Nothing about the compliance programme lives only in a slide deck — and because Ledgerline is a fictional concept, the posture described here is illustrative rather than certified.',
              },
            ],
            title: 'Reviewed on the same cadence as the rails.',
          },
          id: 'compliance',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description:
              'The answers our security desk gives most often — usually before the questionnaire arrives.',
            eyebrow: 'Security FAQ',
            groups: [
              {
                icon: 'globe',
                items: [
                  {
                    answer:
                      'In the region you choose, on a ledger cluster that never replicates entries across jurisdictions. Aggregates used for monitoring are regional too.',
                    question: 'Where do our records physically live?',
                  },
                  {
                    answer:
                      'Encrypted at rest with AES-256 and in transit with TLS 1.3. Keys are per-tenant, rotated on a fixed schedule, and never shared between regions.',
                    question: 'How is data encrypted?',
                  },
                ],
                title: 'Data and residency',
              },
              {
                icon: 'help-circle',
                items: [
                  {
                    answer:
                      'Roles come from your identity provider over SAML or OIDC, with SCIM provisioning. Access is scoped per account tree and per rail, and every grant is part of the audit trail.',
                    question: 'How do you handle access control?',
                  },
                  {
                    answer:
                      'Set a threshold per rail. Any batch above it needs a second approver, and the approval is recorded as part of the transfer rather than beside it.',
                    question: 'Can we require dual approval on payouts?',
                  },
                ],
                title: 'Access and approvals',
              },
              {
                icon: 'package',
                items: [
                  {
                    answer:
                      'Seven years by default, and longer by agreement. Evidence exports are signed and hash-verifiable, so an examiner can confirm nothing changed after the fact.',
                    question: 'How long is audit evidence retained?',
                  },
                  {
                    answer:
                      'Email the security desk. Reports are acknowledged the same business day, and our disclosure policy commits to a remediation timeline at triage.',
                    question: 'Where do we report a vulnerability?',
                  },
                ],
                title: 'Audit and evidence',
              },
            ],
            title: 'Security questions, answered.',
          },
          id: 'faq',
        },
        {
          componentSlug: 'call-to-action-boxed',
          content: {
            description:
              'The security desk answers standard questionnaires within two business days and attaches the current control matrix — no portal, no gate.',
            links: [
              { link: { appearance: 'default', label: 'Talk to the security desk' } },
              { link: { appearance: 'outline', label: 'See the platform' } },
            ],
            title: 'Send us your questionnaire.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Ledgerline — Security',
    },
    {
      description: 'Makes packaging legible and resolves procurement objections.',
      label: 'Pricing',
      path: 'pricing',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'No platform fee, no per-seat licensing, and no line item for the ledger, the reconciliation engine, or the audit trail. You pay a metered rate on volume that settles.',
            eyebrow: 'Pricing',
            links: [
              { link: { appearance: 'default', label: 'Talk to an engineer' } },
              { link: { appearance: 'outline', label: 'See the platform' } },
            ],
            proofItems: [
              { label: 'Metered monthly' },
              { label: 'Volume-tiered rates' },
              { label: 'No seat licensing' },
            ],
            title: 'One rate, on settled volume.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'pricing-cards',
          content: {
            description:
              'The same three tiers from first evaluation to committed volume. Rates step down as settled volume grows; the tier only changes what the platform is allowed to do.',
            eyebrow: 'Tiers',
            plans: ledgerlinePlans,
            title: 'Three tiers, one metered rate.',
          },
          id: 'plans',
        },
        {
          componentSlug: 'comparator-table',
          content: ledgerlineComparator,
          id: 'compare',
          tone: 'muted',
        },
        {
          componentSlug: 'testimonials-rating',
          content: {
            description:
              'Programmes that moved onto Ledgerline in the last four quarters, in their own words.',
            eyebrow: 'From the finance side',
            items: [
              {
                author: 'Priya Raghunathan',
                quote:
                  'The rate was legible on the first call — one number on settled volume, and the sheet we built matched the first invoice to the basis point.',
                rating: 5,
                role: 'Director of Treasury, Vandelay',
              },
              {
                author: 'Dmitri Kowalczyk',
                quote:
                  'We stopped paying for seats, so risk and support finally got logins. The people closest to an exception can now actually see it.',
                rating: 5,
                role: 'Head of Payment Ops, Umbra Freight',
              },
              {
                author: 'Amara Diallo',
                quote:
                  'Procurement had four objections. Three were answered by the tier matrix and the fourth by the security desk in a day.',
                rating: 4,
                role: 'CFO, Loamworks',
              },
            ],
            title: 'Rated by the teams who sign the invoice.',
          },
          id: 'testimonials',
        },
        {
          componentSlug: 'faq-grouped',
          content: {
            description:
              'Metering, contracts, and implementation — the answers procurement asks for in writing.',
            eyebrow: 'Pricing FAQ',
            groups: [
              {
                icon: 'credit-card',
                items: [
                  {
                    answer:
                      'On settled volume only. Authorizations, retries, failed payouts, and reversals are never metered, and neither are ledger reads.',
                    question: 'What exactly is metered?',
                  },
                  {
                    answer:
                      'Rates step down automatically once trailing volume crosses a tier boundary, applied from the following billing period. You never have to ask for the lower rate.',
                    question: 'How do volume tiers apply?',
                  },
                ],
                title: 'Rates and metering',
              },
              {
                icon: 'package',
                items: [
                  {
                    answer:
                      'Core is month to month. Scale and Reserve run on annual terms with committed volume, and the committed rate is fixed for the term.',
                    question: 'What are the contract terms?',
                  },
                  {
                    answer:
                      'Yes. Every tier includes a full export of accounts, entries, and evidence archives in an open format, available for the life of the agreement and ninety days after it.',
                    question: 'Can we take our ledger with us?',
                  },
                ],
                title: 'Contracts',
              },
              {
                icon: 'clock',
                items: [
                  {
                    answer:
                      'It is included. Scale and Reserve programmes get a named implementation engineer; Core programmes work through a shared queue with the same engineers.',
                    question: 'Is implementation charged separately?',
                  },
                  {
                    answer:
                      'Adding a rail is configuration, not an integration. Currencies, windows, and counterparty structures change without touching your transfer code.',
                    question: 'What does it cost to add a rail later?',
                  },
                ],
                title: 'Implementation',
              },
            ],
            title: 'Before you sign',
          },
          id: 'faq',
          tone: 'muted',
        },
        {
          componentSlug: 'call-to-action-signup',
          content: {
            action: '/newsletter',
            description:
              'Rail status, settlement-window changes, and what shipped in the ledger — one plain-text note a month, no sequence, unsubscribe in one click.',
            emailPlaceholder: 'you@treasury.example',
            submitLabel: 'Subscribe',
            title: 'The monthly rails briefing.',
          },
          id: 'cta',
          tone: 'contrast',
        },
      ],
      title: 'Ledgerline — Pricing',
    },
    {
      description: 'Routes sales and compliance questions without collecting any real data.',
      label: 'Contact',
      path: 'contact',
      sections: [
        {
          componentSlug: 'hero-basic',
          content: {
            description:
              'New programmes, live implementations, and security reviews each have their own desk — staffed by people who work on the ledger, not a routing queue.',
            eyebrow: 'Contact',
            links: [],
            proofItems: [
              { label: 'Replies within one business day' },
              { label: 'Engineers on every thread' },
              { label: 'No routing queue' },
            ],
            title: 'Three desks, one business day.',
          },
          id: 'hero',
        },
        {
          componentSlug: 'contact-routing-form',
          content: {
            channels: [
              {
                description:
                  'Rates, rail coverage, and a sandbox reconciliation run against your own settlement files.',
                label: 'New programmes',
                value: 'programs@ledgerline.example',
              },
              {
                description:
                  'For live programmes — median first reply under three hours during rail hours.',
                label: 'Implementation',
                value: 'build@ledgerline.example',
              },
              {
                description:
                  'Questionnaires, control-matrix requests, and vulnerability reports, acknowledged the same business day.',
                label: 'Security desk',
                value: 'security@ledgerline.example',
              },
            ],
            description:
              'Pick a desk or send the details — both land in the same triage, reviewed at the start of every rail day.',
            eyebrow: 'Contact Ledgerline',
            formConfigured: true,
            formDescription:
              'Volume, rails, currencies, and what you reconcile today. We reply with specifics and a rate range, not a sequence.',
            formLabels: [
              'Name',
              'Work email',
              'Company',
              'Monthly settled volume',
              'What are you moving, and on which rails?',
            ],
            formTitle: 'Tell us about the money you move',
            submitLabel: 'Send to the desk',
            title: 'Reach the desk that owns the answer.',
          },
          id: 'contact',
          tone: 'muted',
        },
        {
          componentSlug: 'faq-card',
          content: {
            description: 'What happens after you press send.',
            eyebrow: 'What to expect',
            items: [
              {
                answer:
                  'Within one business day, from a named person. Live programmes see a median first reply under three hours while rails are open.',
                question: 'How fast will someone reply?',
              },
              {
                answer:
                  'Yes. Send a week of settlement files and we reconcile them against a sandbox ledger on the call, then hand back the exception report to keep.',
                question: 'Can you reconcile our real files first?',
              },
              {
                answer:
                  'The security desk returns standard questionnaires within two business days and attaches the current control matrix under mutual NDA.',
                question: 'How do security reviews work?',
              },
              {
                answer:
                  'A named implementation engineer, a shared channel with your team, and a migration plan that moves one rail at a time so volume never stops.',
                question: 'What does onboarding look like?',
              },
            ],
            links: [],
            title: 'Answered before you ask.',
          },
          id: 'faq',
        },
      ],
      title: 'Ledgerline — Contact',
    },
  ],
  revision: 3,
  schemaVersion: 1,
  slug: 'fintech-trust',
  status: 'concept',
  summary:
    'A dense, institutional, trust-first marketing site for a fictional money-movement platform.',
  theme: {
    description:
      'Deep ink and cool-slate surfaces with a restrained teal used only as signal, near-square geometry, tabular figures, hairline rules, and inverted paper bands for the numbers and the written guarantees.',
    id: 'fintech-trust',
    swatches: ['#0b1318', '#adb6bb', '#5ac5c4'],
  },
  title: 'Fintech Trust',
  visualTone: ['Institutional', 'Dense', 'Numbers-forward'],
}
