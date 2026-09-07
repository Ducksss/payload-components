import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: /^@\/blocks\/shared\/(.*)$/,
        replacement: `${process.cwd()}/payload-components/source/blocks/shared/$1`,
      },
      {
        find: '@/components/ui/button',
        replacement: `${process.cwd()}/tests/int/fixtures/target-ui-button.tsx`,
      },
      {
        find: '@/utilities/ui',
        replacement: `${process.cwd()}/src/utilities/ui.ts`,
      },
    ],
  },
  test: {
    maxWorkers: 2,
    environment: 'node',
    include: ['tests/int/**/*.int.spec.ts', 'tests/int/**/*.int.spec.tsx'],
  },
})
