# Domokos Tar - Personal Blog

Personal blog at [domokostar.net](https://domokostar.net), built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |

## Project Structure

```
src/
├── content/blog/          # Blog posts (.md/.mdx)
├── content/authors/       # Author profiles (.mdx)
├── components/            # Astro components (zero JS)
│   └── react/             # React islands (interactive)
├── layouts/               # Page layouts
├── pages/                 # File-based routing
├── data/                  # Site metadata, nav links, projects
├── lib/                   # Utility functions
└── styles/                # Tailwind CSS, Prism code highlighting
public/
├── static/images/         # Blog images, avatars, favicons
└── icons/                 # Social media SVG icons
```

## Customize

- `src/data/siteMetadata.ts` — Site title, description, social links, analytics, comments config
- `src/content/authors/default.mdx` — Default author profile
- `src/data/projectsData.ts` — Projects page data
- `src/data/headerNavLinks.ts` — Navigation links
- `tailwind.config.js` — Theme colors, typography, dark mode
- `src/styles/prism.css` — Code block syntax highlighting theme

## Blog Posts

Create `.md` or `.mdx` files in `src/content/blog/` with YAML frontmatter:

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

**Required**: `title`, `date`, `tags`
**Optional**: `lastmod`, `draft`, `summary`, `images`, `authors`, `layout`, `bibliography`, `canonicalUrl`

Images go in `public/static/images/` and are referenced as `/static/images/filename`.

## Tech Stack

- **Astro 5** — Static site generator with islands architecture
- **Tailwind CSS** — Utility-first styling with class-based dark mode
- **React** — Interactive islands (theme switch, mobile nav, search, comments)
- **MDX** — Markdown with JSX support, remark/rehype plugins (GFM, KaTeX math, Prism code highlighting)
- **Giscus** — GitHub Discussions-based comments

## Deploy

Deployed to [Vercel](https://vercel.com) as a static site. Security headers are configured in `vercel.json`.

## Environment Variables

Optional — only needed for:
- **Giscus comments**: `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPOSITORY_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`
- **Newsletter**: `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID`

## License

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/LICENSE) © [Timothy Lin](https://www.timrlx.com) (original template)
