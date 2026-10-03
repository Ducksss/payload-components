# Maintainer records

This folder holds dated, point-in-time records for maintainers. Nothing here is
published, and nothing here is current guidance: for how the repository works
today, read [`AGENTS.md`](../AGENTS.md), [`CONTRIBUTING.md`](../CONTRIBUTING.md),
and [`payload-components/README.md`](../payload-components/README.md).

- The public documentation site lives in [`content/docs/`](../content/docs/), and
  blog posts in [`content/blog/`](../content/blog/).
- Design proposals live in [`rfcs/`](../rfcs/).

| Path                                     | What it is                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `reviews/2026-09-06-repository-audit.md` | The September 2026 repository audit and its remediation, which shipped in 1.6.0 (#554).                                                     |
| `superpowers/`                           | Implementation plans and design specs from July 2026 for work that has since shipped or moved to another repository. Kept for history only. |

Add a record here only when it documents a decision or review worth keeping after
the work lands. Implementation plans belong in the pull request that executes them.
