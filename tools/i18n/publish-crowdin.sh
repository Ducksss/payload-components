#!/usr/bin/env bash
set -euo pipefail

# This branch belongs to the exporter. Contributor edits go through Crowdin or
# a separate PR; only validated locale files from dev are committed here.
branch=codex/crowdin-translations
git add -- messages/locales/*.json
if git diff --cached --quiet; then
  echo 'No new translations to publish.'
  exit 0
fi

gh auth setup-git
previous_sha=$(git ls-remote --heads origin "refs/heads/$branch" | cut -f1)
git switch -C "$branch"
git -c user.name='github-actions[bot]' -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
  commit -m 'chore(i18n): sync Crowdin translations'
git push --force-with-lease="refs/heads/$branch:$previous_sha" origin "HEAD:refs/heads/$branch"

body_file="$RUNNER_TEMP/crowdin-pr-body.md"
cat > "$body_file" <<'BODY'
Validated translation update from Crowdin. Missing export strings retain their existing translations. English regressions, invalid ICU, and missing required keys are rejected before publication.

Machine translations remain unreviewed and noindex until a native reviewer marks the resource in messages/status.json. The full Registry Verification workflow is explicitly dispatched for this commit.
BODY
pr_number=$(gh pr list --base dev --head "$branch" --state open --json number --jq '.[0].number // empty')
if [ -n "$pr_number" ]; then
  gh pr edit "$pr_number" --title 'chore(i18n): sync Crowdin translations' --body-file "$body_file"
else
  gh pr create --base dev --head "$branch" --draft --title 'chore(i18n): sync Crowdin translations' --body-file "$body_file"
  pr_number=$(gh pr list --base dev --head "$branch" --state open --json number --jq '.[0].number')
fi
printf 'pr_number=%s\n' "$pr_number" >> "$GITHUB_OUTPUT"
