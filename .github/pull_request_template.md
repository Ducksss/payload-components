## Summary

-

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm registry:check`
- [ ] `pnpm run test:int`
- [ ] `pnpm run test:e2e`
- [ ] `pnpm build`

## Payload / Registry Checklist

- [ ] Schema changes include regenerated Payload types.
- [ ] Admin component changes include regenerated import maps.
- [ ] Registry changes keep generated `public/r` output out of git.
- [ ] Local API calls that pass `user` also set `overrideAccess: false`.
- [ ] Nested Payload operations inside hooks pass `req`.

## Notes

-
