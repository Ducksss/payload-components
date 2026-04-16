# Community Post Drafts

Use these as starting points for Payload Discord, GitHub Discussions, or adjacent dev-tool channels. The goal is to be useful first and promotional second.

## Post 1

- Angle: `How we made installable Payload blocks without brittle copy-paste`
- CTA: `/?source=payload-discord-post-01&utm_source=payload-discord&utm_medium=community&utm_campaign=launch-education#early-access`

Starter:

> We kept running into the same problem with reusable Payload blocks: the JSX was never the full install. The real work was the schema wiring, render registration, generated types, and import-map cleanup around it.
>
> We started turning that into a Payload-native kit flow instead of another copy-paste library. The part that feels most important so far is validating repo shape before anything lands.
>
> Curious where other teams see the most breakage when they reuse blocks across real Payload repos.

## Post 2

- Angle: `What actually breaks when you reuse blocks across Payload client repos`
- CTA: `/resources/payload-cms-blocks`

Starter:

> The block usually is not what breaks first.
>
> It is the repo around the block: layout registration, type generation, preview behavior, import maps, and mild client-specific customization. That feels like the real gap between a polished demo and a reusable delivery asset.
>
> We wrote up the patterns we keep seeing here: `/resources/payload-cms-blocks`

## Post 3

- Angle: `Why a shadcn registry alone is not enough for Payload installs`
- CTA: `/resources/shadcn-registry-for-payload`

Starter:

> A shadcn-compatible registry is a strong delivery format, but for Payload it still leaves a second layer of work: collection registration, block rendering, generated types, and import-map updates.
>
> That is why we keep coming back to `init`, `add`, and `doctor` as separate responsibilities instead of treating file delivery as the whole install.

## Post 4

- Angle: `What a good Payload doctor command should catch before deploy`
- CTA: `/?source=payload-discussions-post-02&utm_source=payload-discussions&utm_medium=community&utm_campaign=doctor#early-access`

Starter:

> If a Payload-native kit flow had a `doctor` command, what would you want it to catch before deploy?
>
> Right now the obvious ones seem to be unsupported versions, missing peers, duplicate fragments, and import-map or type-generation drift. I suspect there are more repo-shape failure modes worth detecting early.

## Post 5

- Angle: `Agencies shipping Payload sites: what blocks do you keep rebuilding?`
- CTA: `/?source=payload-discord-post-03&utm_source=payload-discord&utm_medium=community&utm_campaign=kit-discovery&intent=design-partner#early-access`

Starter:

> For teams shipping lots of Payload marketing sites, which sections do you rebuild every time even though they are conceptually the same?
>
> The obvious candidates are hero, pricing, CTA, FAQ, testimonials, forms, and proof sections, but I want to make sure the first kit catalog tracks real delivery pain instead of what looks good in a demo.
