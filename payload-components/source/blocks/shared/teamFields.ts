import type { Field } from 'payload'

/**
 * Shared field core for the Team component family.
 *
 * Every team variant (team-roster, team-grid, …) spreads `teamFields` first for
 * the shared heading, then appends its own variant-specific shape — the grouped
 * department roster or the flat member grid that differs per layout. Editing the
 * shared eyebrow/title shape here updates every installed team block at once, so
 * the family never drifts field-by-field across a repo.
 *
 * `teamMemberFields` is the one-person shape (avatar upload, name, role, optional
 * link) reused by both variants — team-roster nests it inside each group, while
 * team-grid uses it for a single flat `members` array — so a member looks the
 * same everywhere it appears. Each avatar is an editable Media upload, so editors
 * manage the team from the admin instead of shipping hardcoded image URLs.
 *
 * Installed once per repo at `src/blocks/shared/teamFields.ts`; re-running
 * `payload-components add team-*` never overwrites a copy you have already edited.
 */
export const teamFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
  },
  {
    name: 'title',
    type: 'text',
    required: true,
  },
]

export const teamMemberFields: Field[] = [
  {
    name: 'avatar',
    type: 'upload',
    relationTo: 'media',
    required: true,
  },
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'role',
    type: 'text',
    required: true,
  },
  {
    name: 'href',
    type: 'text',
  },
]
