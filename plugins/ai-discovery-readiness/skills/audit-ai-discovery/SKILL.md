---
name: audit-ai-discovery
description: Audit or improve a website, documentation site, public registry, CLI, or developer tool for AI/search discovery, machine-readable content, crawler access, structured data, truthful freshness, trust, evidence, and verification. Use for llms.txt, Markdown endpoints, robots, sitemaps, feeds, JSON-LD, metadata, public artifacts, citation-readiness, or AI visibility requests.
---

# Audit AI Discovery

Treat discovery as an evidence and delivery problem. Inspect the target's real
surfaces, apply only relevant controls, implement repository-owned fixes when
authorized, and label external or unavailable evidence honestly.

## Workflow

1. Read `references/methodology.md` for the evidence model and decision rules.
2. Identify the target boundary: web, docs, registry, CLI, app, MCP, or external.
3. Read the matching sections of `references/audit-catalog.md`. Do not apply web,
   app, and MCP controls as if they were interchangeable.
4. When auditing Payload Components, also read `references/payload-components.md`.
5. Inventory existing routes, metadata, content sources, schemas, public artifacts,
   tests, and deployment assumptions before proposing changes.
6. For every finding, record the four catalog tags and one status: `verified`,
   `implemented`, `unverified`, `missing`, or `not-applicable`.
7. Prefer one maintained source feeding HTML and machine-readable alternatives.
8. Implement applicable repository-controlled fixes when the request authorizes
   changes. Add stable tests for observable contracts, not third-party rankings.
9. Run the relevant checks in `references/verification.md` and report exact evidence.
10. Keep account actions, directory submissions, public messages, and console work
    assigned to a maintainer until explicitly authorized and observed.

## Finding format

For each control, include:

- control ID and concise outcome;
- `Surface`, `Objective`, `Evidence`, and `Owner` tags;
- status and confidence;
- observed evidence with URL, file, command, or test;
- impact stated without guaranteed ranking or citation claims;
- smallest permanent fix and its acceptance check;
- external follow-up, owner, and recheck date when applicable.

Use `not-applicable` with a reason instead of forcing irrelevant controls into the
denominator. Use `unverified` when a likely control cannot be observed.

## Guardrails

- Never fabricate scores, citations, recommendations, traffic, revenue, customers,
  profiles, knowledge-graph identities, or verification state.
- Never serve crawler-only facts or recommend cloaking, doorway pages, or keyword stuffing.
- Do not add an MCP manifest unless real callable MCP tools exist and a product
  workflow requires them.
- Do not treat `robots.txt` as authorization or a security boundary.
- Do not derive editorial freshness from request time, deployment time, or filesystem
  timestamps unless the source contract makes that timestamp authoritative.
- Do not copy proprietary source prose or weighting systems. Paraphrase concepts and
  preserve source attribution in `references/sources.md`.
- Distinguish standards, project contracts, observations, estimates, and unknowns.
- Do not mutate external services or communicate publicly without explicit authority.

## Output

Lead with the verified outcome. Then present prioritized findings, implemented
changes, validation results, and maintainer-only follow-ups. If no material gap is
found, say so and list the evidence checked. A numeric score is optional and should
normally be omitted; if the user explicitly requests one, disclose applicability,
weights, evidence state, and uncertainty.

## References

- `references/methodology.md` — distilled model, measurement rules, evidence states.
- `references/audit-catalog.md` — tagged controls and acceptance evidence.
- `references/payload-components.md` — repository-specific surface map and constraints.
- `references/verification.md` — deterministic and deployed validation procedures.
- `references/sources.md` — source register and guide-by-guide distillation map.
