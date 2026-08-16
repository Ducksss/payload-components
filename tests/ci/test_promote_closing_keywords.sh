#!/usr/bin/env bash
set -euo pipefail

workflow="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/.github/workflows/promote-closing-keywords.yml"

for event in opened reopened edited synchronize; do
  grep -Fqx "      - $event" "$workflow"
done
grep -Fqx '      - main' "$workflow"
grep -Fqx '  contents: read' "$workflow"
grep -Fqx "    if: github.event_name == 'pull_request' && github.base_ref == 'main'" "$workflow"
grep -Fq "Closes #123" "$workflow"
grep -Fq "No issues closed this cycle." "$workflow"
if grep -Eq '^[[:space:]]+uses:' "$workflow"; then
  echo "FAIL: workflow must not use third-party actions" >&2
  exit 1
fi

run_script="$(sed -n '/^        run: |/,$p' "$workflow" | sed '1d; s/^          //')"
if [[ -z "$run_script" ]]; then
  echo "FAIL: could not extract workflow validation script" >&2
  exit 1
fi

check_body() {
  local body="$1"
  PR_BODY="$body" bash -c "$run_script" >/dev/null 2>&1
}

pass_case() {
  local name="$1"
  local body="$2"
  if ! check_body "$body"; then
    echo "FAIL: expected pass: $name" >&2
    exit 1
  fi
}

fail_case() {
  local name="$1"
  local body="$2"
  if check_body "$body"; then
    echo "FAIL: expected failure: $name" >&2
    exit 1
  fi
}

pass_case "standard closing keyword" $'Summary\nCloses #477'
pass_case "cross-repository closing keyword" "Fixes upstream/project#12"
pass_case "case-insensitive keyword" "resolves #9"
pass_case "exact no-issues opt-out" "No issues closed this cycle."

fail_case "empty body" ""
fail_case "closing verb without issue reference" "This change closes a documentation gap."
fail_case "near-miss opt-out" "No issues closed this cycle"
fail_case "malformed issue reference suffix" "Closes #123abc"
fail_case "case-variant opt-out" "no issues closed this cycle."

printf '%s\n' "All promote closing-keyword contract cases passed."
