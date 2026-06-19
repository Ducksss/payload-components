import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Ajv from 'ajv'
import type { ErrorObject, ValidateFunction } from 'ajv'

import { readJsonFile, repoRoot } from './utils'

// shadcn publishes its registry schemas as draft-07 (not 2020-12, unlike the
// Payload manifest schema), so this validator uses the default Ajv class. The
// schemas are vendored under tools/payload-components/schemas so the gate stays
// offline-deterministic instead of fetching ui.shadcn.com at validation time.
const schemaDir = path.join(repoRoot, 'tools', 'payload-components', 'schemas')
const registrySchemaPath = path.join(schemaDir, 'registry.schema.json')
const registryItemSchemaPath = path.join(schemaDir, 'registry-item.schema.json')
// The registry schema references the item schema by this absolute URL, so the
// vendored item schema must be registered under the same id for $ref to resolve.
const registryItemSchemaId = 'https://ui.shadcn.com/schema/registry-item.json'

const sourceRegistryPath = path.join(repoRoot, 'payload-components', 'registry.json')
const publicRegistryDir = path.join(repoRoot, 'public', 'r')

type RegistryItem = { name?: string }
type RegistryDefinition = { items?: RegistryItem[] }

const formatError = (error: ErrorObject) =>
  `${error.instancePath || '(root)'} ${error.message ?? 'is invalid'}`

const formatErrors = (errors: ErrorObject[] | null | undefined) =>
  (errors ?? []).map(formatError).join('; ') || 'unknown validation error'

// ajv bundles the draft-07 meta-schema under its http:// id, but shadcn's schemas
// declare the https:// variant, which ajv can't resolve. Drop the dialect hint and
// let ajv validate with its default (draft-07) dialect.
const loadSchemaWithoutDialect = async (schemaPath: string) => {
  const schema = await readJsonFile<Record<string, unknown>>(schemaPath)
  delete schema.$schema
  return schema
}

const createValidators = async () => {
  const registrySchema = await loadSchemaWithoutDialect(registrySchemaPath)
  const registryItemSchema = await loadSchemaWithoutDialect(registryItemSchemaPath)

  const ajv = new Ajv({ allErrors: true, strict: false })
  ajv.addSchema(registryItemSchema, registryItemSchemaId)

  const validateRegistry = ajv.compile(registrySchema)
  const validateItem = ajv.getSchema(registryItemSchemaId) as ValidateFunction

  return { validateItem, validateRegistry }
}

export const validateRegistryArtifacts = async () => {
  const { validateItem, validateRegistry } = await createValidators()
  const errors: string[] = []

  // Validate the source registry the maintainer edits and the directory entry
  // points at. Built items only add schema-valid `content`/`$schema` strings on
  // top of these (and the reproducibility check proves built === source + content),
  // so source validity is the authoritative submission-readiness signal.
  const sourceRegistry = await readJsonFile<RegistryDefinition>(sourceRegistryPath)

  if (!validateRegistry(sourceRegistry)) {
    errors.push(`payload-components/registry.json: ${formatErrors(validateRegistry.errors)}`)
  }

  for (const item of sourceRegistry.items ?? []) {
    // Read the name before validating: ValidateFunction is a type guard, so
    // referencing `item` inside the `!valid` branch narrows it to `never`.
    const itemName = item.name ?? '(unnamed)'

    if (!validateItem(item)) {
      errors.push(`registry item "${itemName}": ${formatErrors(validateItem.errors)}`)
    }
  }

  // When a built registry is present (after `pnpm registry:build`, or in a
  // production build), also validate the served artifacts consumers and the
  // shadcn directory actually fetch.
  let validatedPublic = false

  if (existsSync(publicRegistryDir)) {
    validatedPublic = true
    const entries = (await readdir(publicRegistryDir)).filter((entry) => entry.endsWith('.json'))

    for (const entry of entries) {
      const document = await readJsonFile<unknown>(path.join(publicRegistryDir, entry))

      if (entry === 'registry.json') {
        if (!validateRegistry(document)) {
          errors.push(`public/r/registry.json: ${formatErrors(validateRegistry.errors)}`)
        }
      } else if (!validateItem(document)) {
        errors.push(`public/r/${entry}: ${formatErrors(validateItem.errors)}`)
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Registry schema validation failed:\n- ${errors.join('\n- ')}`)
  }

  return {
    itemCount: sourceRegistry.items?.length ?? 0,
    validatedPublic,
  }
}

const isMain = () => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  validateRegistryArtifacts()
    .then((result) => {
      const publicNote = result.validatedPublic ? ' and built public/r artifacts' : ''
      process.stdout.write(
        `registry schema valid: ${result.itemCount} source items${publicNote} conform to the shadcn registry schema.\n`,
      )
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    })
}
