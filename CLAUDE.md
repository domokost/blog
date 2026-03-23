# CLAUDE.md

## Project Overview

Personal blog for Domokos Tar (domokostar.net), built on the **Tailwind Next.js Starter Blog** template. Uses **Next.js 13** with **Contentlayer** for MDX content management and **Tailwind CSS** for styling.

## Tech Stack

- **Framework**: Next.js 13.1.6 (Pages Router)
- **Language**: TypeScript
- **Content**: Contentlayer + MDX (with remark/rehype plugins)
- **Styling**: Tailwind CSS 3.2.2 (class-based dark mode)
- **Theme**: next-themes for dark/light mode toggle
- **Deployment**: Vercel

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (+ generates RSS, sitemap, search index) |
| `npm run serve` | Start production server |
| `npm run lint` | ESLint with auto-fix |
| `npm run analyze` | Bundle size analysis |

## Project Structure

```
pages/              # Next.js pages (routing)
  blog/             # Blog listing, post pages, pagination
  tags/             # Tag-based post filtering
  api/              # API routes (newsletter)
components/         # Reusable React components
layouts/            # Page layout templates (PostLayout, ListLayout, AuthorLayout, PostSimple)
data/
  blog/             # Blog posts (.md/.mdx files)
  authors/          # Author profiles (.mdx)
  siteMetadata.js   # Site-wide configuration
  headerNavLinks.ts # Navigation menu items
  projectsData.ts   # Projects listing data
css/                # Tailwind, Prism (syntax highlighting), and search styles
scripts/            # Post-build scripts (RSS, sitemap, search index generation)
public/static/      # Images, favicons, static assets
lib/                # Utility functions
```

## Key Configuration Files

- `contentlayer.config.ts` — Defines Blog and Authors document types, MDX plugins, computed fields
- `next.config.js` — CSP headers, security headers, SVG webpack config, Contentlayer plugin
- `tailwind.config.js` — Theme colors (primary: teal), typography, dark mode
- `data/siteMetadata.js` — Site title, description, analytics, comments, newsletter config

## Blog Post Conventions

Posts live in `data/blog/` as `.md` or `.mdx` files with YAML frontmatter:

```yaml
---
title: 'Post Title'
date: '2023-02-15'
tags: ['tag1', 'tag2']
draft: false
summary: 'Short description'
images: ['/static/images/image.jpg']
layout: PostLayout
---
```

Required fields: `title`, `date`, `tags`. Optional: `lastmod`, `draft`, `summary`, `images`, `authors`, `layout`, `bibliography`, `canonicalUrl`.

## Code Conventions

- **Imports**: Use path aliases (`@/components/*`, `@/data/*`, `@/layouts/*`, `@/lib/*`, `@/css/*`)
- **Components**: Functional React components, PascalCase filenames (e.g., `Header.tsx`)
- **Pages**: Lowercase filenames, brackets for dynamic segments (`[...slug].tsx`)
- **Static generation**: `getStaticProps` / `getStaticPaths` for all content pages
- **Props typing**: `InferGetStaticPropsType<typeof getStaticProps>`
- **Formatting**: Prettier — no semicolons, single quotes, 100-char width, 2-space tabs, ES5 trailing commas
- **Linting**: ESLint with TypeScript, jsx-a11y, Prettier, Next.js core-web-vitals rules
- **TypeScript**: Strict mode is OFF

## Git Hooks

Husky pre-commit hook runs **lint-staged**, which:
- Runs `eslint --fix` on JS/TS files
- Runs `prettier --write` on all staged files

## Environment Variables

Optional — only needed for:
- **Giscus comments**: `NEXT_PUBLIC_GISCUS_*` variables
- **Newsletter**: Provider API keys (ConvertKit configured in siteMetadata)

See `.env.example` for all available variables.

## Adding Content

1. Create a new `.md` or `.mdx` file in `data/blog/`
2. Add required frontmatter (title, date, tags)
3. Write content in Markdown/MDX (supports GFM, math via KaTeX, code highlighting, citations)
4. Images go in `public/static/images/` and are referenced as `/static/images/filename`
5. Run `npm run dev` to preview
