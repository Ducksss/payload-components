#!/usr/bin/env bash
set -euo pipefail

workflow="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/.github/workflows/promote-closing-keywords.yml"
closing_keyword_regex='(^|[^[:alnum:]])(close[sd]?|fix(e[sd])?|resolve[sd]?)[[:space:]]+[^[:space:]]*#[0-9]+'
opt_out_regex='^[[:space:]]*No issues closed this cycle\.[[:space:]]*$'

check_body() {
  local body="$1"
  grep -Eiq "$closing_keyword_regex" <<<"$body" || grep -Eiq "$opt_out_regex" <<<"$body"
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

# Keep the test coupled to the workflow's documented contract.
grep -Fq "branches:" "$workflow"
grep -Fq "edited" "$workflow"
grep -Fq "No issues closed this cycle." "$workflow"

pass_case "standard closing keyword" $'Summary\nCloses #477'
pass_case "cross-repository closing keyword" "Fixes upstream/project#12"
pass_case "explicit no-issues opt-out" "No issues closed this cycle."
pass_case "case-insensitive keyword" "resolves #9"

fail_case "empty body" ""
fail_case "closing verb without issue reference" "This change closes a documentation gap."
fail_case "near-miss opt-out" "No issues closed this cycle"

printf '%s\n' "All promote closing-keyword contract cases passed."
