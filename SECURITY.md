# Security Policy

Security issues in Payload Kits should be reported privately first.

## Supported Versions

The `main` branch is the supported production line. The `dev` branch is the
staging line for validated changes before promotion to `main`.

Until the project starts publishing versioned releases, security fixes should be
branched from `main`, validated through the release gate, merged back to `main`,
and then carried forward to `dev`.

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability.

Report privately through GitHub Security Advisories for this repository. If that
is unavailable, contact the maintainer listed in the README and include:

- Affected area, such as Payload target code, CLI install behavior, registry
  generation, docs/search routes, or deployment configuration.
- Steps to reproduce or a minimal proof of concept.
- Expected impact and any known affected versions or commits.
- Whether the issue is already public anywhere else.

We will acknowledge valid reports as soon as practical, coordinate a fix, and
publish public details after a patch is available.

## Security Expectations

Contributions that touch Payload target code, registry install logic, generated
files, dependency execution paths, search/LLM surfaces, or deployment
configuration should include focused tests or a clear verification note.
