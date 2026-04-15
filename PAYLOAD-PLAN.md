# Payload Kits SaaS v1

## Summary

Build this as a **Payload-native kit platform for agencies/freelancers**, not as a generic component CDN.  
The core promise is: **one `npx` command installs a production-ready Payload block kit** that includes the frontend component, Payload block/schema wiring, admin-safe defaults, and the repo updates needed to make it work in a Payload v3 + Next.js project.

The business shape should be **open core + paid Pro**:
- Free public registry for trust, SEO, and adoption
- Paid private registry for premium kits and higher-value bundles
- No user-generated marketplace in v1

## Public Interfaces

The product should expose three user-facing interfaces:

- `npx payload-kit init`
  - Detect project shape, confirm it is a supported Payload v3 + Next.js app, add registry config, and prepare local settings
- `npx payload-kit add <kit-name>`
  - Install a kit from the registry, wire required files/config, install dependencies, and run `generate:types` plus `generate:importmap`
- `npx payload-kit doctor`
  - Validate compatibility, detect missing dependencies, and report drift after upgrades

Each installable kit should have a manifest with:
- kit name and version
- supported Payload and Next.js versions
- dependencies and peer dependencies
- files/components to install
- Payload fragments to register
- post-install tasks
- optional Pro entitlement requirement

## Key Changes

- Base the distribution on a **shadcn-compatible registry**, but wrap it with your own CLI so you own the Payload-specific workflow.
- Keep v1 focused on **frontend blocks first**, because that matches agency pain best and maps cleanly to Payload layouts.
- Ship each kit as a complete unit:
  - block config
  - frontend render component
  - optional admin config/component
  - sample content/seed data
  - docs and preview metadata
- Start with a narrow catalog of repeat-use agency blocks:
  - heroes
  - feature grids
  - testimonials
  - pricing
  - logo clouds
  - FAQs
  - CTAs
  - newsletter/contact forms
  - team/about sections
  - stats and content sections
- Treat the real moat as **Payload-native integration quality**, not visual novelty alone:
  - works with Payload layouts
  - type-safe
  - preview-friendly
  - import-map aware
  - upgradeable
  - consistent across kits
- Keep v1 opinionated:
  - only support Payload v3
  - only support Next.js App Router projects
  - only support known repo layouts at first
  - do not try to support every frontend or every Payload version yet

## Test Plan

Validate the product around installation reliability, not just component appearance:

- Fresh install into the official Payload website-style starter
- Install into a mildly customized Payload repo with existing blocks
- Install multiple kits in sequence and verify dedupe/conflict handling
- Re-run install on the same kit and verify idempotency
- Verify `generate:types` and `generate:importmap` complete successfully after install
- Verify uninstall/rollback behavior or at minimum a clean failure story
- Verify Pro auth flows:
  - missing token
  - expired token
  - unauthorized kit
- Verify rendered block output, admin editability, and preview behavior

## Assumptions And Defaults

- Primary customer is agencies/freelancers shipping many client sites
- v1 is a **kit platform**, not a broad marketplace
- v1 prioritizes **website blocks**, not admin workflow extensions
- Paid tier is delivered through a private/authenticated registry namespace
- The first launch should optimize for install success, curated quality, and clear docs over a huge catalog

## External Context

This direction lines up with the current tooling landscape:
- [shadcn registry docs](https://ui.shadcn.com/docs/registry/mcp)
- [shadcn registry authentication](https://ui.shadcn.com/docs/registry/authentication)
- [shadcn CLI 3.0 changelog](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp)
- [Payload website template](https://github.com/payloadcms/payload/tree/main/templates/with-vercel-website)
- [Payload docs](https://payloadcms.com/docs)
