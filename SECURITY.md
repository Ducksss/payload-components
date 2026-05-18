# Security Policy

Security issues in Payload Kits should be reported privately first.

## Supported Versions

The `main` branch is the supported development line. Until the project starts
publishing versioned releases, security fixes will land on `main`.

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability.

Report privately through GitHub Security Advisories for this repository. If that
is unavailable, contact the maintainer listed in the README and include:

- Affected area, such as Payload access control, hooks, CLI install behavior,
  registry generation, or deployment configuration.
- Steps to reproduce or a minimal proof of concept.
- Expected impact and any known affected versions or commits.
- Whether the issue is already public anywhere else.

We will acknowledge valid reports as soon as practical, coordinate a fix, and
publish public details after a patch is available.

## Security Expectations

Contributions that touch Payload access control, hooks, endpoints, auth,
registry install logic, generated files, or dependency execution paths should
include focused tests or a clear verification note.
