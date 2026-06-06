import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import expressiveCode from 'astro-expressive-code'
import { remarkPlugins, rehypePlugins } from './plugins'
import { SITE } from './src/config'

export default defineConfig({
  site: SITE.website,
  base: SITE.base,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    // Work around duplicated Vite type trees pulled by Astro and @tailwindcss/vite.
    plugins: [tailwindcss()] as any,
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins,
    rehypePlugins,
  },
  integrations: [expressiveCode(), mdx(), react(), sitemap(), robotsTxt()],
})
