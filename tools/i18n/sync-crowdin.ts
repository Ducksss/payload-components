import { mergeCrowdinExport } from './merge-crowdin'

const baselineRoot = process.argv[2]
if (!baselineRoot) throw new Error('Usage: tsx tools/i18n/sync-crowdin.ts <baseline-directory>')
await mergeCrowdinExport(baselineRoot)
