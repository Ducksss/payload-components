# Site translations

`en.json` is the canonical source catalogue. Site code refers to stable keys
such as `Landing.hero.headline`; changing a sentence never requires editing the
same React component in every language.

Crowdin owns translation memory, machine pre-translation, and contributor
review. The `Crowdin translations` workflow uploads English changes and opens a
PR into `dev` with one complete JSON catalogue under `messages/locales/` per
locale. Configure these repository secrets before running it:

- `CROWDIN_PROJECT_ID`
- `CROWDIN_PERSONAL_TOKEN`

Enable Crowdin pre-translation for new strings in the project so its configured
machine translation provider fills drafts before the workflow downloads them.
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

The checker requires exact keys, valid ICU, matching argument types and tags, and
every plural category required by each locale's `Intl.PluralRules`. Preserve
commands, paths, product names, and every `{argument}` during review.

`fumadocs.json` is separate because it contains upstream documentation-shell
labels rather than Payload Components copy. Long-form MDX and hard-coded showcase
content still fall back to English until a reviewed translation exists.
