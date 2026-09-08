import path from 'node:path'

import { assertSafePackageManagerTargets } from './dependencies'
import { readSafeProjectFile, safeProjectFileExists } from './safe-path'
import { getShadcnCommand, printHeader, runCommand } from './utils'

import type { PackageManager } from './types'

/* Third-party registry items, addressed the way shadcn addresses them:
 * `@scope/name`, with the scope resolved from the project's own `registries`
 * map. The catalog documents this already (content/docs/registry.mdx) — this is
 * the code catching up.
 *
 * What this deliberately does NOT do is pretend a third-party item is one of
 * ours. There is no manifest behind it, so there is no wiring contract, no
 * install state, and nothing for list/diff/update/remove to manage. It copies
 * files and says so. */

const NAMESPACED_ITEM_PATTERN = /^@[a-z0-9][a-z0-9-]*\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/

type RegistriesConfig = Record<string, string | { url?: string }>

export const isNamespacedItem = (name: string) => name.startsWith('@')

export const parseNamespacedItem = (name: string) => {
  if (!NAMESPACED_ITEM_PATTERN.test(name)) {
    throw new Error(
      `"${name}" is not a valid namespaced registry item. Expected the shadcn form "@scope/item", for example "@acme/hero".`,
    )
  }

  const separatorIndex = name.indexOf('/')

  return { item: name.slice(separatorIndex + 1), scope: name.slice(0, separatorIndex) }
}

const readRegistries = async (cwd: string) => {
  const configs = await Promise.all(
    ['components.json', 'package.json'].map(async (file) => {
      const filePath = path.join(cwd, file)

      if (!(await safeProjectFileExists({ cwd, filePath }))) {
        return undefined
      }

      return JSON.parse(await readSafeProjectFile({ cwd, filePath })) as {
        registries?: RegistriesConfig
      }
    }),
  )

  return configs.reduce<RegistriesConfig>(
    (merged, config) => ({ ...merged, ...(config?.registries ?? {}) }),
    {},
  )
}

const resolveRegistryUrl = (entry: RegistriesConfig[string]) =>
  typeof entry === 'string' ? entry : entry?.url

/* The scope must be configured before we hand it to shadcn, so an unconfigured
   namespace fails with a message naming the file to edit rather than surfacing
   as a generic downstream error. */
export const resolveNamespacedRegistry = async ({ cwd, scope }: { cwd: string; scope: string }) => {
  const registries = await readRegistries(cwd)
  const url = resolveRegistryUrl(registries[scope])

  if (!url) {
    throw new Error(
      `Unknown registry "${scope}". Define it under "registries" in ${cwd}/components.json (or package.json) before installing from it.`,
    )
  }

  /* A registry URL is fetched and its contents written into the project, so
     plaintext transport is refused outright. Local file paths are refused for
     the same reason a namespace exists: this path is for remote registries. */
  if (!url.startsWith('https://')) {
    throw new Error(
      `Registry "${scope}" resolves to "${url}", which is not an https URL. payload-components will not install from an untrusted transport.`,
    )
  }

  return url
}

export const installNamespacedItem = async ({
  cwd,
  name,
  packageManager,
}: {
  cwd: string
  name: string
  packageManager: PackageManager
}) => {
  const { item, scope } = parseNamespacedItem(name)
  const url = await resolveNamespacedRegistry({ cwd, scope })
  const shadcn = getShadcnCommand(packageManager)

  await assertSafePackageManagerTargets({ cwd, packageManager })

  printHeader(
    [
      `payload-components: installing "${name}" from ${url}`,
      '  This is a third-party registry item: files only.',
      '  No Payload wiring is applied, and no install state is recorded — list, diff,',
      '  update, and remove do not manage it.',
    ].join('\n'),
  )

  await runCommand({
    args: [...shadcn.args, 'add', `${scope}/${item}`, '--cwd', cwd, '--yes'],
    command: shadcn.command,
    cwd,
  })

  printHeader(`payload-components: installed "${name}".`)
}
