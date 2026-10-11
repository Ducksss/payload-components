import type { Datasheet } from '@/lib/datasheet'
import {
  CardPinout,
  Command,
  DatasheetCard,
  FAINT,
  Headline,
  headlineSize,
  INK,
  Lead,
  RULE,
  siteDomain,
  TRACE,
} from '@/lib/og/datasheet-card'

/* ImageResponse rasterizes raw image elements server-side; next/image is a
   browser component and cannot participate in Satori's render tree. */
/* eslint-disable @next/next/no-img-element */

/* The card bodies, kept apart from their routes so each can be rendered on its
 * own (the docs and blog routes read MDX sources, which only the Next build
 * can load). Every card is a page of the same datasheet: see
 * src/lib/og/datasheet-card.tsx. */

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      style={{
        color: TRACE,
        display: 'flex',
        fontFamily: 'Azeret Mono',
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: 1.6,
        marginBottom: 18,
      }}
    >
      {children.toUpperCase()}
    </div>
  )
}

/* The landing's first page: the claim and its one command, beside hero-basic
   drawn as its part. */
export function RootCard({
  command,
  datasheet,
  headline,
}: {
  command: string
  datasheet: Datasheet
  headline: string
}) {
  return (
    <DatasheetCard
      docId={`${datasheet.part} · REV ${datasheet.version}`}
      footer={siteDomain}
      section="DATASHEET"
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 520 }}>
          <Headline size={92}>{headline}</Headline>
          <div style={{ display: 'flex', marginTop: 36 }}>
            <Command command={command} />
          </div>
        </div>
        <CardPinout datasheet={datasheet} height={392} maxFont={19} width={548} />
      </div>
    </DatasheetCard>
  )
}

/* A component's docs page is its datasheet: part number in the strip, title
   and description beside its pinout, and the exact install command. */
export function ComponentDocsCard({
  command,
  datasheet,
  description,
  eyebrow,
  title,
  url,
}: {
  command: string
  datasheet: Datasheet
  description?: string
  eyebrow: string
  title: string
  url: string
}) {
  return (
    <DatasheetCard
      docId={`${datasheet.part} · REV ${datasheet.version}`}
      footer={`${siteDomain}${url}`}
      section="DOCS"
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 470 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline size={headlineSize(title, 96)}>{title}</Headline>
          {description ? <Lead lines={3}>{description}</Lead> : null}
          <div style={{ display: 'flex', marginTop: 28 }}>
            {/* One line at any slug length: Azeret advances 0.65em. */}
            <Command command={command} size={Math.min(17, 452 / ((command.length + 2) * 0.65))} />
          </div>
        </div>
        <CardPinout datasheet={datasheet} height={420} maxFont={18} width={600} />
      </div>
    </DatasheetCard>
  )
}

/* Every other docs page: a sheet in its sidebar section. */
export function DocsCard({
  description,
  section,
  title,
  url,
}: {
  description?: string
  section?: string
  title: string
  url: string
}) {
  return (
    <DatasheetCard docId={section?.toUpperCase()} footer={`${siteDomain}${url}`} section="DOCS">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 1000,
          width: '100%',
        }}
      >
        <Headline size={headlineSize(title, 112)}>{title}</Headline>
        {description ? <Lead lines={3}>{description}</Lead> : null}
      </div>
    </DatasheetCard>
  )
}

/* A blog post: its series in the strip, the title beside its cover, framed
   and captioned as the sheet's figure. */
export function BlogCard({
  cover,
  description,
  series,
  title,
  url,
}: {
  cover: string
  description?: string
  series: string
  title: string
  url: string
}) {
  return (
    <DatasheetCard docId={series.toUpperCase()} footer={`${siteDomain}${url}`} section="BLOG">
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 600 }}>
          <Headline size={headlineSize(title, 100)}>{title}</Headline>
          {description ? <Lead lines={3}>{description}</Lead> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 440 }}>
          <div
            style={{
              border: `1px solid ${RULE}`,
              display: 'flex',
              height: 232,
              overflow: 'hidden',
              width: 440,
            }}
          >
            <img
              alt=""
              height={232}
              src={cover}
              style={{ height: '100%', objectFit: 'cover', width: '100%' }}
              width={440}
            />
          </div>
          <div
            style={{
              color: FAINT,
              display: 'flex',
              fontFamily: 'Azeret Mono',
              fontSize: 14,
              letterSpacing: 1.4,
              marginTop: 12,
            }}
          >
            <div style={{ color: INK, display: 'flex', fontWeight: 500, marginRight: 12 }}>
              FIG. 1
            </div>
            <div style={{ display: 'flex' }}>COVER</div>
          </div>
        </div>
      </div>
    </DatasheetCard>
  )
}

/* The datasheet's "PRELIMINARY" stamp, for template concepts. */
function Stamp({ children }: { children: string }) {
  return (
    <div
      style={{
        border: `2.5px solid ${TRACE}`,
        color: TRACE,
        display: 'flex',
        fontFamily: 'Azeret Mono',
        fontSize: 19,
        fontWeight: 500,
        letterSpacing: 3,
        padding: '10px 18px',
        transform: 'rotate(-4deg)',
      }}
    >
      {children.toUpperCase()}
    </div>
  )
}

/* A template concept, with its bill of materials: the registry parts its
   pages are composed from. */
export function TemplateCard({
  docId,
  parts,
  status,
  summary,
  title,
  url,
}: {
  docId: string
  parts?: string[]
  status: string
  summary: string
  title: string
  url: string
}) {
  const shown = parts?.slice(0, 6) ?? []
  const more = (parts?.length ?? 0) - shown.length

  return (
    <DatasheetCard docId={docId} footer={`${siteDomain}${url}`} section="TEMPLATES">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', position: 'absolute', right: 8, top: 36 }}>
          <Stamp>{status}</Stamp>
        </div>
        <div style={{ display: 'flex', maxWidth: 860 }}>
          <Headline size={headlineSize(title, 104)}>{title}</Headline>
        </div>
        <div style={{ display: 'flex', maxWidth: 900 }}>
          <Lead lines={2}>{summary}</Lead>
        </div>
        {shown.length ? (
          <div
            style={{
              color: INK,
              display: 'flex',
              flexWrap: 'wrap',
              fontFamily: 'Azeret Mono',
              fontSize: 15,
              marginTop: 28,
            }}
          >
            <div style={{ color: FAINT, display: 'flex', letterSpacing: 1.4, marginRight: 16 }}>
              {`BOM · ${parts?.length} PARTS`}
            </div>
            {shown.map((part) => (
              <div key={part} style={{ display: 'flex', marginRight: 16 }}>
                {part}
              </div>
            ))}
            {more > 0 ? (
              <div style={{ color: FAINT, display: 'flex' }}>{`+${more} more`}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </DatasheetCard>
  )
}
