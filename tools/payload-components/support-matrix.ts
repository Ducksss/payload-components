/* Reading support-matrix.json in pairs.
 *
 * A target lists the Payload majors and the Next.js majors it accepts. Read on
 * their own, those two lists are a cross product: every Payload major with every
 * Next.js major. Payload 4 dropped Next.js 15, so a target can narrow the Next.js
 * majors per Payload major through `payloadMajorSupport`. These helpers are the
 * one place that applies the narrowing, so detection, manifest checks and doctor
 * agree on which pairs are supported. */

import type { PayloadMajorSupport, SupportedTarget } from './types'

export const getPayloadMajorSupport = (
  target: SupportedTarget,
  payloadMajor: number,
): PayloadMajorSupport | undefined => target.payloadMajorSupport?.[String(payloadMajor)]

/* The Next.js majors a target accepts alongside one Payload major, in the
 * target's order. Empty when the target does not accept the Payload major. */
export const pairedNextMajors = (target: SupportedTarget, payloadMajor: number) => {
  if (!target.allowedPayloadMajors.includes(payloadMajor)) {
    return []
  }

  const narrowed = getPayloadMajorSupport(target, payloadMajor)?.nextMajors

  return narrowed
    ? target.allowedNextMajors.filter((major) => narrowed.includes(major))
    : [...target.allowedNextMajors]
}

export const targetSupportsPair = (
  target: SupportedTarget,
  { nextMajor, payloadMajor }: { nextMajor: number; payloadMajor: number },
) => pairedNextMajors(target, payloadMajor).includes(nextMajor)

const sortedUnion = (lists: number[][]) =>
  [...new Set(lists.flat())].sort((left, right) => left - right)

/* "Payload v3 with Next.js 15, 16; Payload v4 with Next.js 16", across every
 * target, for errors that have to say which combination would work. */
export const describeSupportedPairs = (targets: SupportedTarget[]) =>
  sortedUnion(targets.map((target) => target.allowedPayloadMajors))
    .map(
      (payloadMajor) =>
        `Payload v${payloadMajor} with Next.js ${sortedUnion(
          targets.map((target) => pairedNextMajors(target, payloadMajor)),
        ).join(', ')}`,
    )
    .join('; ')
