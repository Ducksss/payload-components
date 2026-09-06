# Site translations

`en.json` is the canonical source catalog. Maintain English copy here using
stable message keys; site components read it through `next-intl`, and existing
English data exports read the same source.

## Publication scope

The public site is **English-only**. `publishedSiteLocales` in
`src/i18n/config.ts` controls routing, page generation, the language selector,
and validation. With one published language, the selector is hidden. Links to
saved draft locales redirect temporarily to the corresponding English URL,
preserving the query string and browser fragment.

`siteLocales` and `messages/locales/*.json` retain the 21 existing draft catalogs
for possible future use. Their presence does not publish a language or commit
maintainers to translating every English change. Do not generate additional
manual translation batches just to fill their gaps. No paid provider or Crowdin
credits are required to build or maintain the English site.

The CLI's consumer Payload localization is separate and remains available.
This publication policy only applies to this documentation website.

## Validation

Run the normal release check after changing English copy:

```bash
pnpm i18n:check
```

It validates English ICU and published translations only. Missing or stale
translations in inactive drafts do not require manual maintenance. PR CI also
checks published locales for translation loss against `I18N_BASE_REF`.

Before considering a draft for publication, explicitly check draft compatibility:

```bash
pnpm i18n:check --drafts
```

This checks draft keys, ICU arguments, rich-text tags, protected technical terms,
and locale-specific plural categories against current English. It may fail as
English evolves; that is a reason to keep the draft unpublished. Preserve
commands, paths, product names, and every `{argument}` in translations.

## Parked Crowdin integration

The `Crowdin translations` workflow is manual-only until a reliable no-cost
translation workflow is verified. English edits do not automatically trigger a
translation job or create a manual translation queue. The site never calls a
translation service during a visitor request.

The existing integration is retained for that verification. It uses the
`CROWDIN_PROJECT_ID` and `CROWDIN_PERSONAL_TOKEN` repository secrets. Its optional
`import_existing` input bootstraps existing catalogs as unapproved suggestions;
do not re-import all drafts on every run because that can compete with
contributor edits. No workflow buys credits or approves translations.

Downloads preserve translations absent from sparse or empty exports. The merger
validates all exported catalogs and rejects translation loss, English replacements,
and invalid ICU before opening a draft PR. It dispatches Registry Verification
explicitly because bot-created PRs do not trigger normal PR workflows.

## Enabling another language

Enable a language only after verifying that a no-cost Crowdin workflow can keep
it current, its required messages pass validation, and a native reviewer can
review its published resources. Add it to `publishedSiteLocales`, test its routes
and mobile layout, and update the relevant tests in the same change. Restore
automatic Crowdin source uploads only once that workflow is proven.

Native review is recorded per resource in `status.json`; automation does not
set it. Machine and fallback resources remain `noindex` until reviewed.
Long-form articles stay in MDX and need their own translated source before they
can be advertised as translated content.

`Components.<registry-slug>.{title,description,target}` owns catalog display copy.
Keep technical slugs, categories, field names, and install contracts in TypeScript.
Existing drafts remain saved; structural validation alone does not establish
native-language editorial quality.
