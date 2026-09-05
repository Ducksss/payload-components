# Site translations

`en.json` is the canonical source catalogue. Site code refers to stable keys
such as `Landing.hero.headline`; changing a sentence never requires editing the
same React component in every language.

Crowdin owns translation memory, machine pre-translation, and contributor
review. The `Crowdin translations` workflow uploads English changes and opens a
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

Enable perfect-match translation-memory reuse for new content in Crowdin. To
generate drafts for genuinely new sentences, connect a machine translation or AI
provider in the project and enable its automatic translation setting. The workflow
does not buy translation credits, configure provider credentials, or approve drafts.
Translation may complete after a source upload; run the workflow again after the
provider finishes to collect those drafts.
The site never calls a translation service while handling a visitor request.

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

English and Chinese have complete catalogue prose. The other existing locales
retain their translated shell and explicitly fall back to English for absent
`Components` keys; English is never copied into their JSON files to pretend a
translation exists. This one staged namespace is declared in
`src/i18n/catalog-policy.ts`; every other missing key is an error. Add reviewed
locale coverage there as catalogue translations become available. Chinese drafts
are still unreviewed; passing structure and browser checks does not establish
native-language editorial review.

`I18N_BASE_REF=<git-ref> pnpm i18n:check` additionally rejects loss of existing
translations or replacement with English, including in the staged namespace.
PR CI compares against its base commit. The Crowdin merger performs the same
comparison against a snapshot taken immediately before export.
