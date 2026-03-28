# Migration Plan: Next.js 13 to Astro

## Overview

Migrate the Domokos Tar blog from Next.js 13 + Contentlayer to Astro with Content Collections. The blog is fully static, making Astro an excellent fit — it ships zero JS by default and uses islands architecture for the few interactive pieces.

---

## Phase 1: Project Scaffold & Configuration

### 1.1 Initialize Astro project
- Create `astro.config.mjs` with MDX, Tailwind, and sitemap integrations
- Install core dependencies:
  - `astro`, `@astrojs/mdx`, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/rss`
  - `@astrojs/react` (for interactive islands: theme switch, mobile nav, comments, search)
- Keep existing `tailwind.config.js` (works directly with Astro)
- Keep existing `postcss.config.js`
- Keep `prettier.config.js` and `.eslintrc.js` (update plugins for Astro)
- Update `tsconfig.json` to use Astro's `strict` preset and keep path aliases

### 1.2 Preserve rehype/remark pipeline
- All current MDX plugins carry over directly to Astro's MDX integration:
  - `remark-gfm`, `remark-math`, `remark-code-titles`
  - `rehype-slug`, `rehype-autolink-headings`, `rehype-katex`, `rehype-citation`, `rehype-prism-plus`, `rehype-preset-minify`
- Configure in `astro.config.mjs` under `markdown.remarkPlugins` / `markdown.rehypePlugins`

### 1.3 Remove Next.js-specific packages
- Remove: `next`, `next-contentlayer`, `contentlayer`, `next-themes`, `@next/bundle-analyzer`, `@next/font`, `pliny`
- Remove: `next.config.js`, `contentlayer.config.ts`, `jsconfig.json`
- Remove: `.contentlayer/` generated directory

**Files created:** `astro.config.mjs`
**Files modified:** `package.json`, `tsconfig.json`
**Files deleted:** `next.config.js`, `contentlayer.config.ts`, `jsconfig.json`

---

## Phase 2: Content Collections (replaces Contentlayer)

### 2.1 Define content schemas
- Create `src/content/config.ts` with Zod schemas matching current Contentlayer types:

```ts
// Blog collection schema
{
  title: z.string(),
  date: z.date(),
  tags: z.array(z.string()),
  lastmod: z.date().optional(),
  draft: z.boolean().default(false),
  summary: z.string().optional(),
  images: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  layout: z.string().default('PostLayout'),
  bibliography: z.string().optional(),
  canonicalUrl: z.string().optional(),
}

// Authors collection schema
{
  name: z.string(),
  avatar: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  layout: z.string().optional(),
}
```

### 2.2 Move content into `src/content/`
- Move `data/blog/*.md(x)` → `src/content/blog/`
- Move `data/authors/*.mdx` → `src/content/authors/`
- Frontmatter format stays the same (YAML)

### 2.3 Computed fields
- `readingTime`: Use `reading-time` package in layout/utility
- `slug`: Derived from filename (Astro default)
- `toc`: Extract from headings at render time or via remark plugin

**Files created:** `src/content/config.ts`
**Files moved:** `data/blog/` → `src/content/blog/`, `data/authors/` → `src/content/authors/`

---

## Phase 3: Directory Restructure

Astro uses `src/` convention. Restructure as:

```
src/
├── content/
│   ├── config.ts           # Collection schemas
│   ├── blog/               # Blog posts (from data/blog/)
│   └── authors/            # Author profiles (from data/authors/)
├── components/             # Astro + React components (from components/)
│   └── react/              # Interactive React islands
├── layouts/                # Astro layout files (from layouts/)
├── pages/                  # Astro pages (from pages/)
├── lib/                    # Utilities (from lib/)
├── data/                   # Static data files (siteMetadata, headerNavLinks, projectsData)
└── styles/                 # CSS files (from css/)
```

**Key moves:**
- `components/` → `src/components/`
- `layouts/` → `src/layouts/`
- `pages/` → `src/pages/` (will be rewritten)
- `lib/` → `src/lib/`
- `css/` → `src/styles/`
- `data/siteMetadata.js`, `data/headerNavLinks.ts`, `data/projectsData.ts` → `src/data/`

---

## Phase 4: Convert Pages (Next.js → Astro)

All pages are statically generated, so conversion is straightforward. Replace `getStaticProps`/`getStaticPaths` with Astro's `getStaticPaths()` and `getCollection()`.

### 4.1 Home page
- `pages/index.tsx` → `src/pages/index.astro`
- Replace `getStaticProps` with top-level `getCollection('blog')` call
- Sort by date, take top 5, render in Astro template

### 4.2 Blog listing with pagination
- `pages/blog/index.tsx` + `pages/blog/page/[page].tsx` → `src/pages/blog/[...page].astro`
- Use Astro's `paginate()` helper in `getStaticPaths()`
- `POSTS_PER_PAGE = 5`

### 4.3 Individual blog posts
- `pages/blog/[...slug].tsx` → `src/pages/blog/[...slug].astro`
- Use `getCollection('blog')` + `getEntry()` for content
- Render MDX with `<Content />` component
- Compute prev/next from sorted collection
- Draft posts: exclude from `getStaticPaths()` in production

### 4.4 Tags pages
- `pages/tags.tsx` → `src/pages/tags/index.astro`
- `pages/tags/[tag].tsx` → `src/pages/tags/[tag].astro`
- Aggregate tags from blog collection

### 4.5 About page
- `pages/about.tsx` → `src/pages/about.astro`
- Render author MDX from content collection

### 4.6 Projects page
- `pages/projects.tsx` → `src/pages/projects.astro`
- Static data, direct conversion

### 4.7 404 page
- `pages/404.tsx` → `src/pages/404.astro`

### 4.8 API route (newsletter)
- `pages/api/newsletter.ts` → `src/pages/api/newsletter.ts`
- Astro supports API endpoints natively
- Replace Pliny's `NewsletterAPI` with direct Convertkit API call (simple fetch)

**Files created:** 9 Astro page files
**Files deleted:** All files in `pages/`

---

## Phase 5: Convert Components

### 5.1 Pure display components → Astro components (no JS shipped)
These have zero interactivity and should be pure `.astro` files:

| Current (React) | New (Astro) |
|---|---|
| `LayoutWrapper.tsx` | `src/layouts/Base.astro` (base layout) |
| `Header.tsx` | `src/components/Header.astro` |
| `Footer.tsx` | `src/components/Footer.astro` |
| `SectionContainer.tsx` | `src/components/SectionContainer.astro` |
| `PageTitle.tsx` | `src/components/PageTitle.astro` |
| `Tag.tsx` | `src/components/Tag.astro` |
| `Card.tsx` | `src/components/Card.astro` |
| `Link.tsx` | `src/components/Link.astro` |
| `Image.tsx` | Use `<img>` or `astro:assets` `<Image>` |
| `SEO.tsx` | `src/components/SEO.astro` (or use Astro `<head>`) |
| `social-icons/` | `src/components/SocialIcon.astro` |

### 5.2 Interactive components → React islands (client:load / client:visible)
These need JavaScript and stay as React:

| Component | Hydration directive | Reason |
|---|---|---|
| `ThemeSwitch.tsx` | `client:load` | Must run immediately for theme |
| `MobileNav.tsx` | `client:load` | Hamburger menu toggle |
| `ScrollTopAndComment.tsx` | `client:visible` | Scroll listener, can defer |
| Giscus comments | `client:visible` | Third-party widget, lazy-load |

### 5.3 Layout components → Astro layouts
- `PostLayout.tsx` → `src/layouts/PostLayout.astro`
- `PostSimple.tsx` → `src/layouts/PostSimple.astro`
- `ListLayout.tsx` → `src/layouts/ListLayout.astro`
- `AuthorLayout.tsx` → `src/layouts/AuthorLayout.astro`

Each receives content as `<slot />` instead of `children` prop.

### 5.4 MDX components
- Create `src/components/mdx/` for MDX component overrides
- Map custom elements in Astro MDX config or per-page

**Files created:** ~15 Astro components, ~4 Astro layouts
**Files modified:** 4 React components (ThemeSwitch, MobileNav, ScrollTopAndComment, Giscus wrapper)
**Files deleted:** Original React-only components

---

## Phase 6: Replace Pliny Dependencies

The `pliny` package is Next.js-specific. Replace each feature:

| Pliny feature | Astro replacement |
|---|---|
| Analytics provider | Direct script tags in `Base.astro` `<head>` (Plausible/GA/etc) |
| Comments (Giscus) | React island with `giscus-component` or `<script>` embed |
| Newsletter API | Direct Convertkit API call in `src/pages/api/newsletter.ts` |
| Search (kbar) | `pagefind` (Astro-native, zero-config) or `@astrojs/search` |
| MDXLayoutRenderer | Astro's built-in `<Content />` from content collections |
| allCoreContent | `getCollection()` with transforms |

---

## Phase 7: Dark Mode

Replace `next-themes` with a lightweight script:

- Add inline `<script>` in `Base.astro` `<head>` to check `localStorage` / system preference and set `class="dark"` on `<html>` before paint (prevents flash)
- `ThemeSwitch.tsx` React island toggles the class and persists to `localStorage`
- Tailwind's class-based dark mode works unchanged

---

## Phase 8: SEO & Head Management

- Use Astro's `<head>` in layouts directly (no `next/head` needed)
- Create `src/components/SEO.astro` component that accepts props and renders:
  - `<title>`, `<meta>` tags, Open Graph, Twitter cards
  - JSON-LD structured data via `<script type="application/ld+json">`
  - Canonical URLs
- RSS: Use `@astrojs/rss` integration (replaces `scripts/rss.mjs`)
- Sitemap: Use `@astrojs/sitemap` integration (replaces `scripts/sitemap.mjs`)

---

## Phase 9: Static Assets & Styling

### 9.1 Assets
- `public/static/` stays as-is (Astro serves `public/` identically)
- Favicons, images, manifest — no changes needed

### 9.2 Styling
- `css/tailwind.css` → `src/styles/global.css`, imported in `Base.astro`
- `css/prism.css` → `src/styles/prism.css`, imported in post layouts
- Tailwind config unchanged
- KaTeX CSS: import from `katex/dist/katex.min.css` in post layouts

### 9.3 Fonts
- Replace `@next/font` with direct Google Fonts `<link>` or `@fontsource/inter`
- Add to `Base.astro` `<head>`

---

## Phase 10: Security Headers

- Move CSP and security headers from `next.config.js` to:
  - Vercel: `vercel.json` headers config
  - Or: Astro middleware (`src/middleware.ts`)

---

## Phase 11: Build & Deploy

### 11.1 Build scripts
- Remove `scripts/postbuild.mjs`, `scripts/rss.mjs`, `scripts/sitemap.mjs`, `scripts/search.mjs`
- RSS and sitemap handled by Astro integrations
- Search index handled by Pagefind (runs at build time automatically)

### 11.2 Update package.json scripts
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

### 11.3 Vercel deployment
- Astro has first-class Vercel adapter: `@astrojs/vercel`
- For pure static: use `output: 'static'` (default)
- For API routes (newsletter): use `output: 'hybrid'` with server endpoints

---

## Phase 12: Cleanup & Testing

### 12.1 Remove dead files
- Delete all original `pages/`, `components/`, `layouts/` React files
- Delete `contentlayer.config.ts`, `next.config.js`, `jsconfig.json`
- Delete `.contentlayer/` directory
- Remove unused dependencies from `package.json`

### 12.2 Verify functionality
- [ ] All blog posts render correctly with MDX
- [ ] Code syntax highlighting works (Prism)
- [ ] Math rendering works (KaTeX)
- [ ] Dark mode toggle works without flash
- [ ] Mobile navigation works
- [ ] Pagination works on blog listing
- [ ] Tag filtering works
- [ ] About page renders author MDX
- [ ] Projects page displays cards
- [ ] RSS feed generates at `/feed.xml`
- [ ] Sitemap generates at `/sitemap.xml`
- [ ] Giscus comments load on posts
- [ ] SEO meta tags and structured data present
- [ ] 404 page works
- [ ] All links (internal/external) work correctly
- [ ] Security headers present in responses
- [ ] Newsletter API endpoint works (if using hybrid mode)

### 12.3 Performance validation
- Run Lighthouse audit (expect improved scores due to less JS)
- Verify zero JS on pages without interactive islands
- Check bundle sizes for React islands

---

## Migration Order Summary

| Phase | Effort | Dependencies |
|---|---|---|
| 1. Scaffold & Config | Low | None |
| 2. Content Collections | Low | Phase 1 |
| 3. Directory Restructure | Low | Phase 1 |
| 4. Convert Pages | Medium | Phases 2, 3 |
| 5. Convert Components | Medium | Phase 3 |
| 6. Replace Pliny | Medium | Phases 4, 5 |
| 7. Dark Mode | Low | Phase 5 |
| 8. SEO & Head | Low | Phases 4, 5 |
| 9. Assets & Styling | Low | Phase 3 |
| 10. Security Headers | Low | Phase 1 |
| 11. Build & Deploy | Low | All above |
| 12. Cleanup & Testing | Medium | All above |

**Estimated total: ~40 files to create/modify, ~30 files to delete.**

The blog's fully-static nature and clean separation of concerns make this a smooth migration. The biggest wins will be: zero JS by default on most pages, faster builds, native content collections replacing Contentlayer, and built-in RSS/sitemap generation.
