import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
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
    environment: 'node',
    include: ['tests/int/**/*.int.spec.ts', 'tests/int/**/*.int.spec.tsx'],
  },
})
