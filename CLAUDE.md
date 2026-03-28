# CLAUDE.md

## Project Overview

Personal blog for Domokos Tar (domokostar.net), built with **Astro** and **Tailwind CSS**. Uses Astro Content Collections for MDX/Markdown content management and React islands for interactive components.

## Tech Stack

- **Framework**: Astro 5 (static site generator with islands architecture)
- **Language**: TypeScript
- **Content**: Astro Content Collections + MDX (with remark/rehype plugins)
- **Styling**: Tailwind CSS 3.2.2 (class-based dark mode)
- **Interactive Components**: React 19 (hydrated as islands via `client:load` / `client:visible`)
- **Deployment**: Vercel (static output)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (generates RSS, sitemap automatically) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |

## Project Structure

```
src/
├── content/
│   ├── config.ts          # Zod schemas for blog and authors collections
│   ├── blog/              # Blog posts (.md/.mdx files)
│   └── authors/           # Author profiles (.mdx)
├── components/            # Astro components (zero JS shipped)
│   └── react/             # React islands (interactive, hydrated client-side)
├── layouts/               # Astro layout templates
│   ├── Base.astro         # HTML shell, head, dark mode script, header/footer
│   ├── PostLayout.astro   # Full blog post layout with author, tags, comments
│   ├── PostSimple.astro   # Minimal post layout
│   └── AuthorLayout.astro # Author profile layout
├── pages/                 # File-based routing
│   ├── blog/              # Blog listing, pagination, individual posts
│   ├── tags/              # Tag index and per-tag filtering
│   ├── api/               # API endpoints (newsletter)
│   ├── feed.xml.ts        # RSS feed generation
│   ├── index.astro        # Home page
│   ├── about.astro        # About page
│   ├── projects.astro     # Projects page
│   ���── 404.astro          # Not found page
├── data/                  # Static data (siteMetadata, nav links, projects)
├── lib/                   # Utility functions (formatDate, kebabCase)
└── styles/                # CSS (Tailwind base, Prism code highlighting)
public/
├── static/images/         # Blog images, avatars, favicons
└── icons/                 # Social media SVG icons
```

## Key Configuration Files

- `astro.config.mjs` — Integrations (MDX, Tailwind, Sitemap, React), remark/rehype plugins
- `tailwind.config.js` — Theme colors (primary: teal), typography, dark mode (class-based)
- `vercel.json` — Security headers (CSP, HSTS, X-Frame-Options)
- `src/data/siteMetadata.ts` — Site title, description, social links, analytics, comments config
- `src/content/config.ts` — Content collection schemas (Blog, Authors)

## Blog Post Conventions

Posts live in `src/content/blog/` as `.md` or `.mdx` files with YAML frontmatter:

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

## Architecture: Islands

Most components are `.astro` files (zero JS). Interactive components live in `src/components/react/` and are hydrated with directives:

- `client:load` — ThemeSwitch, MobileNav, ListLayoutSearch (needed immediately)
- `client:visible` — ScrollTopAndComment, GiscusComments (lazy-loaded)

## Code Conventions

- **Astro components**: `.astro` files for all static UI
- **React islands**: `.tsx` files in `src/components/react/` for interactive parts
- **Imports**: Use relative paths from `src/` (path aliases available: `@/components/*`, etc.)
- **Content access**: `getCollection('blog')` / `getEntry('authors', 'default')`
- **Static generation**: `getStaticPaths()` for dynamic routes
- **Formatting**: Prettier — no semicolons, single quotes, 100-char width, 2-space tabs
- **Linting**: ESLint with TypeScript rules

## Dark Mode

- Inline `<script>` in `Base.astro` checks `localStorage` / system preference before paint
- `ThemeSwitch` React island toggles `dark` class on `<html>` and persists to `localStorage`
- Tailwind's class-based `dark:` variants handle all styling

## Git Hooks

Husky pre-commit hook runs **lint-staged**, which:
- Runs `eslint --fix` on JS/TS/Astro files
- Runs `prettier --write` on all staged files

## Environment Variables

Optional — only needed for:
- **Giscus comments**: `PUBLIC_GISCUS_*` variables
- **Newsletter**: `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID`

## Adding Content

1. Create a new `.md` or `.mdx` file in `src/content/blog/`
2. Add required frontmatter (title, date, tags)
3. Write content in Markdown/MDX (supports GFM, math via KaTeX, code highlighting)
4. Images go in `public/static/images/` and are referenced as `/static/images/filename`
5. Run `npm run dev` to preview
