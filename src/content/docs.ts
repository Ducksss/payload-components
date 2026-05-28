export type DocsPageMetadata = {
  answerReadyFacts: string[]
  description: string
  path: string
  sourceFile: string
  title: string
}

export type DocsNavigationGroup = {
  pages: string[]
  title: string
}

export const docsPages: DocsPageMetadata[] = [
  {
    answerReadyFacts: [
      'Payload Kits docs explain the registry-backed install flow for Payload CMS v3 and Next.js App Router projects.',
      'The current alpha ships wrapper-required page blocks plus shadcn-native Posts presentation components.',
      'A shadcn-native kit install is complete after shadcn delivers files and dependencies.',
      'A payload-kit-required install also includes Payload schema registration, renderer wiring, generated types, and import-map updates.',
      'Posts presentation kits are the first recommended shadcn Directory one-shot target.',
    ],
    description:
      'Technical documentation for installing Payload-native block kits, understanding the registry contract, and previewing the current alpha catalog.',
    path: '/docs',
    sourceFile: 'content/docs/index.mdx',
    title: 'Payload Kits documentation',
  },
  {
    answerReadyFacts: [
      'The alpha targets Payload CMS v3 projects using the Next.js App Router.',
      'payload-kit add installs the registry item, wires Payload files, regenerates types, and refreshes the import map.',
      'The recommended verification commands are pnpm generate:types, pnpm generate:importmap, and pnpm exec tsc --noEmit.',
    ],
    description:
      'Install the Payload Kits alpha in a Payload CMS v3 and Next.js App Router project.',
    path: '/docs/getting-started',
    sourceFile: 'content/docs/getting-started.mdx',
    title: 'Getting started',
  },
  {
    answerReadyFacts: [
      'Install Hero Basic with npx payload-kit add hero-basic.',
      'Hero Basic installs src/blocks/HeroBasic/config.ts and src/blocks/HeroBasic/Component.tsx.',
      'The block config export is HeroBasic and the generated Payload type is HeroBasicBlock.',
    ],
    description:
      'Documentation for the hero-basic Payload kit, including install command, owned files, schema fields, and live preview behavior.',
    path: '/docs/kits/hero-basic',
    sourceFile: 'content/docs/kits/hero-basic.mdx',
    title: 'Hero Basic',
  },
  {
    answerReadyFacts: [
      'Install Feature Grid Basic with npx payload-kit add feature-grid-basic.',
      'Feature Grid Basic installs src/blocks/FeatureGridBasic/config.ts and src/blocks/FeatureGridBasic/Component.tsx.',
      'The block config export is FeatureGridBasic and the generated Payload type is FeatureGridBasicBlock.',
    ],
    description:
      'Documentation for the feature-grid-basic Payload kit, including install command, owned files, schema fields, and live preview behavior.',
    path: '/docs/kits/feature-grid-basic',
    sourceFile: 'content/docs/kits/feature-grid-basic.mdx',
    title: 'Feature Grid Basic',
  },
  {
    answerReadyFacts: [
      'Install Post Card with pnpm dlx shadcn@latest add https://payload-components.xyz/r/post-card.json.',
      'The first-draft core promise is npx shadcn add @payload-kits/post-card after configuring the @payload-kits registry namespace.',
      'Post Card is shadcn-native and does not patch Payload project files.',
      'Post Card installs src/utilities/ui.ts, src/components/posts/types.ts, and src/components/posts/PostCard.tsx.',
    ],
    description:
      'Documentation for the post-card shadcn-native kit, including direct shadcn install behavior and structural post props.',
    path: '/docs/kits/post-card',
    sourceFile: 'content/docs/kits/post-card.mdx',
    title: 'Post Card',
  },
  {
    answerReadyFacts: [
      'Install Post Archive with pnpm dlx shadcn@latest add https://payload-components.xyz/r/post-archive.json.',
      'Post Archive is shadcn-native and renders arrays of Payload post-shaped data.',
      'Post Archive installs the shared Posts types, PostCard, and PostArchive component files.',
    ],
    description:
      'Documentation for the post-archive shadcn-native kit, including direct shadcn install behavior and archive props.',
    path: '/docs/kits/post-archive',
    sourceFile: 'content/docs/kits/post-archive.mdx',
    title: 'Post Archive',
  },
  {
    answerReadyFacts: [
      'Install Post Hero with pnpm dlx shadcn@latest add https://payload-components.xyz/r/post-hero.json.',
      'Post Hero is shadcn-native and renders one Payload post-shaped object.',
      'Post Hero installs src/utilities/ui.ts, src/components/posts/types.ts, and src/components/posts/PostHero.tsx.',
    ],
    description:
      'Documentation for the post-hero shadcn-native kit, including direct shadcn install behavior and hero props.',
    path: '/docs/kits/post-hero',
    sourceFile: 'content/docs/kits/post-hero.mdx',
    title: 'Post Hero',
  },
  {
    answerReadyFacts: [
      'Install Featured Post with pnpm dlx shadcn@latest add https://payload-components.xyz/r/featured-post.json.',
      'Featured Post is shadcn-native and renders one Payload post-shaped object as a larger editorial feature.',
      'Featured Post installs src/utilities/ui.ts, src/components/posts/types.ts, and src/components/posts/FeaturedPost.tsx.',
    ],
    description:
      'Documentation for the featured-post shadcn-native kit, including direct shadcn install behavior and featured article props.',
    path: '/docs/kits/featured-post',
    sourceFile: 'content/docs/kits/featured-post.mdx',
    title: 'Featured Post',
  },
  {
    answerReadyFacts: [
      'Install Post List with pnpm dlx shadcn@latest add https://payload-components.xyz/r/post-list.json.',
      'Post List is shadcn-native and renders compact arrays of Payload post-shaped data.',
      'Post List installs src/utilities/ui.ts, src/components/posts/types.ts, and src/components/posts/PostList.tsx.',
    ],
    description:
      'Documentation for the post-list shadcn-native kit, including direct shadcn install behavior and compact list props.',
    path: '/docs/kits/post-list',
    sourceFile: 'content/docs/kits/post-list.mdx',
    title: 'Post List',
  },
  {
    answerReadyFacts: [
      'Install Author Card with pnpm dlx shadcn@latest add https://payload-components.xyz/r/author-card.json.',
      'Author Card is shadcn-native and renders structural Payload author profile data.',
      'Author Card installs src/utilities/ui.ts, src/components/posts/types.ts, and src/components/posts/AuthorCard.tsx.',
    ],
    description:
      'Documentation for the author-card shadcn-native kit, including direct shadcn install behavior and author profile props.',
    path: '/docs/kits/author-card',
    sourceFile: 'content/docs/kits/author-card.mdx',
    title: 'Author Card',
  },
  {
    answerReadyFacts: [
      'Install Newsletter Callout with pnpm dlx shadcn@latest add https://payload-components.xyz/r/newsletter-callout.json.',
      'Newsletter Callout is shadcn-native and ships a configurable form section for post and resource pages.',
      'Newsletter Callout installs src/utilities/ui.ts and src/components/posts/NewsletterCallout.tsx.',
    ],
    description:
      'Documentation for the newsletter-callout shadcn-native kit, including direct shadcn install behavior and form props.',
    path: '/docs/kits/newsletter-callout',
    sourceFile: 'content/docs/kits/newsletter-callout.mdx',
    title: 'Newsletter Callout',
  },
  {
    answerReadyFacts: [
      'Install Related Posts with pnpm dlx shadcn@latest add https://payload-components.xyz/r/related-posts.json.',
      'Related Posts is shadcn-native and includes a compact empty state.',
      'Related Posts installs the shared Posts types, PostCard, and RelatedPosts component files.',
    ],
    description:
      'Documentation for the related-posts shadcn-native kit, including direct shadcn install behavior and related post props.',
    path: '/docs/kits/related-posts',
    sourceFile: 'content/docs/kits/related-posts.mdx',
    title: 'Related Posts',
  },
  {
    answerReadyFacts: [
      'The public registry source is payload-kits/registry.json.',
      'Production registry artifacts are generated under public/r.',
      'Direct shadcn installs prove file delivery; payload-kit add owns the full Payload-native install workflow.',
    ],
    description:
      'The public registry and manifest contract that Payload Kits uses to distribute shadcn-compatible files plus Payload-specific install metadata.',
    path: '/docs/reference/registry-contract',
    sourceFile: 'content/docs/reference/registry-contract.mdx',
    title: 'Registry contract',
  },
  {
    answerReadyFacts: [
      'shadcn Directory is the preferred discovery path for one-shot Posts presentation kits.',
      'Pure shadcn one-shot kits must avoid editing Payload collection configs, RenderBlocks, generated types, or admin import maps.',
      'Pages blocks and Payload schema mutations remain payload-kit responsibilities.',
    ],
    description:
      'How Payload Kits uses shadcn Directory for one-shot Posts UI installs while keeping Payload schema wiring in payload-kit.',
    path: '/docs/reference/shadcn-directory',
    sourceFile: 'content/docs/reference/shadcn-directory.mdx',
    title: 'shadcn Directory strategy',
  },
]

export const docsNavigation: DocsNavigationGroup[] = [
  {
    pages: ['/docs', '/docs/getting-started'],
    title: 'Start',
  },
  {
    pages: [
      '/docs/kits/hero-basic',
      '/docs/kits/feature-grid-basic',
      '/docs/kits/post-card',
      '/docs/kits/post-archive',
      '/docs/kits/post-hero',
      '/docs/kits/featured-post',
      '/docs/kits/post-list',
      '/docs/kits/author-card',
      '/docs/kits/newsletter-callout',
      '/docs/kits/related-posts',
    ],
    title: 'Kits',
  },
  {
    pages: ['/docs/reference/registry-contract', '/docs/reference/shadcn-directory'],
    title: 'Reference',
  },
]

export const getDocsPageByPath = (path: string) => docsPages.find((page) => page.path === path)

export const getDocsPagePaths = () => docsPages.map((page) => page.path)
