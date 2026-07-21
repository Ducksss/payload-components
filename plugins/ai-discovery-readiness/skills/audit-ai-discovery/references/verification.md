# Verification procedures

## General repository checks

Before changing files, inspect project instructions, status, runtime, content sources,
route conventions, and existing tests. Prefer the repository's documented gate over an
invented command list.

For a web surface, verify at least:

```bash
curl -fsSI https://example.com/
curl -fsS https://example.com/robots.txt
curl -fsS https://example.com/sitemap.xml
curl -fsS https://example.com/feed.xml
curl -fsS https://example.com/llms.txt
```

Record status, redirect chain, canonical host, content type, relevant headers, body
markers, observation time, and environment. Do not expose credentials or private URLs.

Validate generated XML and JSON with available standard parsers. Test escaping with `&`,
`<`, `>`, single quotes, double quotes, and Unicode. Verify empty-collection behavior.

## Payload Components focused checks

Run source generation before type checks in a fresh worktree:

```bash
pnpm source:build
pnpm exec vitest run --config ./vitest.config.mts tests/int/fumadocs-site.int.spec.ts
pnpm exec playwright test tests/e2e/geo.e2e.spec.ts
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Use the full release gate before handoff:

```bash
pnpm test:release
```

When registry or installer behavior changes, also check the exact affected slice early:

```bash
pnpm test:registry
pnpm run test:int
pnpm test:fresh
```

`test:fresh` is slower and external; use it for pre-release/nightly confidence or when the
change affects real consumer installation behavior.

## Plugin and skill validation

From the repository root:

```bash
python3 /Users/chaipinzheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  plugins/ai-discovery-readiness/skills/audit-ai-discovery

python3 /Users/chaipinzheng/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py \
  plugins/ai-discovery-readiness
```

Then inspect:

- no scaffold TODO or placeholder remains;
- plugin paths resolve inside the plugin;
- marketplace entry points to `./plugins/ai-discovery-readiness`;
- skill frontmatter contains only supported fields;
- `agents/openai.yaml` contains the literal `$audit-ai-discovery` invocation;
- every reference linked by `SKILL.md` exists one level below it;
- the catalog contains the four required tag axes and all five result states.

## Structured data

Parse every `application/ld+json` script. Confirm:

- valid JSON and schema types appropriate to visible content;
- canonical absolute URLs;
- stable organization/site/software IDs;
- referenced IDs exist in the page graph or sitewide graph;
- article title, description, author, and date match the visible page;
- no invented offers, ratings, reviews, people, organizations, or profiles.

Third-party structured-data tools are observations, not substitutes for local parsing and
source parity tests.

## Freshness

For every emitted date, identify its authoritative source. Fail or omit the field when the
source lacks a date. Check that:

- successive builds do not change undated sitemap entries;
- feed build date equals the newest real item date;
- item ordering uses publication date with deterministic tie behavior;
- versions come from package/manifest sources;
- time zones serialize predictably.

## External observation template

Use this record for console, search, directory, profile, or model observations:

```text
Control:
Surface:
Objective:
Owner:
Status: unverified | verified | missing | not-applicable
Observed at (UTC):
Environment/provider/model/locale:
Exact URL or prompt:
Result:
Cited URLs:
Evidence location:
Assumptions and limits:
Next action:
Recheck date:
```

Never store secrets, session cookies, private account identifiers, or personal data in the
audit record.

## Final integrity review

Run `git diff --check`, inspect the complete diff and working tree, and distinguish authored
files from generated/ignored output. Report exact commands and outcomes. If a check cannot run,
state the limitation and do not mark the related control verified.
