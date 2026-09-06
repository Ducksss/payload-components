# Site translations

`en.json` is the canonical source catalogue. Site code refers to stable keys
such as `Landing.hero.headline`; changing a sentence never requires editing the
same React component in every language.

Translation drafts can be authored directly in `messages/locales/<locale>.json`
and submitted as a normal pull request. A paid service is not required. Crowdin
provides optional translation memory and contributor review. The `Crowdin translations` workflow uploads English changes and opens a
draft PR into `dev`. Downloads omit untranslated strings; a local merge retains
existing translations absent from the export. ICU, required keys, and regressions
from translated text back to English are checked before a PR can be created.
The full Registry Verification workflow is explicitly dispatched on the bot
branch, because PRs created with `GITHUB_TOKEN` do not trigger PR workflows. Configure these repository secrets before running it:

- `CROWDIN_PROJECT_ID`
- `CROWDIN_PERSONAL_TOKEN`

Bootstrap an existing project once by manually running `Crowdin translations`
with `import_existing: true`. This uploads the committed catalogues as unapproved
suggestions, skipping values identical to English. Leave it off on routine runs
so repository imports cannot compete with contributor review in Crowdin.

Perfect-match translation-memory reuse is enabled in Crowdin. New sentences are
drafted in the repository without purchasing translation credits or enabling a
paid provider. Automated machine pre-translation is optional, not a prerequisite
for maintaining or shipping translations. The workflow does not buy credits,
configure provider credentials, or approve drafts.
The site never calls a translation service while handling a visitor request.

## No-cost draft workflow

1. Read the current English message and its UI context, then translate the whole
   sentence under the same key in the locale JSON. Preserve technical names,
   commands, paths, ICU arguments, and rich-text tags.
2. Add only the intended missing strings. Keep existing translations unless the
   change explicitly corrects them; do not copy English into untranslated keys.
3. Run `pnpm i18n:check` and inspect the localized page, including mobile layout
   and search. Include the translated keys and languages in the PR description.
4. Keep AI-assisted drafts unreviewed in `status.json`. A native reviewer must
   review the whole resource before its publication status changes. A valid JSON
   file or passing ICU check does not establish linguistic accuracy.

Crowdin can remain the optional place for contributors to review those drafts.
Do not re-import all repository translations on every run: the one-time bootstrap
is not a routine synchronization policy and can compete with contributor edits.

Every non-English route is treated as machine translated and emitted with
`noindex` until a native reviewer explicitly marks that locale and resource as
reviewed in `status.json`. Long-form docs and blog articles fall back to English
until translated source files exist; fallback pages are never advertised as
translated search results.

Run the offline contract check before merging a Crowdin PR:

```bash
pnpm i18n:check
```

The checker requires valid ICU, matching argument types and tags, and
every plural category required by each locale's `Intl.PluralRules`. Preserve
commands, paths, product names, and every `{argument}` during review.

The Fumadocs documentation shell follows the same publication rule. Chinese uses
the upstream Fumadocs language pack; every unreviewed locale uses the explicit
English fallback rather than shipping duplicated English labels under a locale
name. Long-form MDX and hard-coded showcase content also fall back to English
until a reviewed translation exists.

## Copy ownership and rollout

`Components.<registry-slug>.{title,description,target}` owns catalogue copy for
both installable and planned entries. `src/lib/component-catalog.ts` keeps stable
slugs, categories, field names, and install contracts; its English projection and
`src/lib/site.ts` read the source catalogue instead of duplicating copy. React
renders messages through `next-intl`. Keep commands, paths, identifiers, and
product names out of translation changes. Long-form articles stay in MDX.

English, Chinese, Japanese, and Korean have complete catalogue prose. The other existing locales
retain their translated shell and explicitly fall back to English for absent
`Components` keys; English is never copied into their JSON files to pretend a
translation exists. This one staged namespace is declared in
`src/i18n/catalog-policy.ts`; every other missing key is an error. Add reviewed
locale coverage there as catalogue translations become available. Non-English drafts
are still unreviewed; passing structure and browser checks does not establish
native-language editorial review.

`I18N_BASE_REF=<git-ref> pnpm i18n:check` additionally rejects loss of existing
translations or replacement with English, including in the staged namespace.
PR CI compares against its base commit. The Crowdin merger performs the same
comparison against a snapshot taken immediately before export.
