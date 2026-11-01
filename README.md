# DevCompare

![CI](https://github.com/luchersou/dev-compare/actions/workflows/ci.yml/badge.svg)

DevCompare is a developer tool for comparing npm packages side by side.
Search any package to explore its weekly downloads, bundle size, GitHub activity and metadata — or pick two packages and get a full head-to-head breakdown with a verdict to help you decide.

🔗 **Live Demo**: https://npm-comparator-ten.vercel.app/

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433e38?style=for-the-badge&logo=zustand&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## Features

- 🔍 **Package search** — real-time npm search with debounced input
- 📦 **Package page** — version, description, bundle size, downloads, GitHub stats and metadata, including scoped packages like `@types/node`
- ⚖️ **Side-by-side comparison** — compare two packages with a visual stats table and a weighted verdict (popularity, community, bundle size and maintenance activity)
- 📈 **Download history** — weekly downloads over the last 12 months, powered by Recharts
- 💾 **Persistent selection** — the packages picked for comparison survive a reload
- 🔗 **Shareable links** — dynamic Open Graph images for every package and comparison, plus sitemap and robots.txt
- 🌗 **Light / Dark mode** — theme toggle with shadcn + Tailwind
- 📱 **Responsive** — mobile-first layout throughout
- ⚡ **Server Components by default** — data is fetched and cached on the server; client components only where interaction is required

---

## Data Sources

DevCompare aggregates data from four public APIs — no API key required:

| API | Usage |
|-----|-------|
| `registry.npmjs.org` | Latest version manifest and search (publish date) |
| `api.npmjs.org` | Daily downloads for the last year (totals and chart) |
| `bundlephobia.com/api` | Bundle size (minified + gzip) |
| `api.github.com` | Stars, forks, open issues and last push |

Responses are cached for an hour with the Next.js data cache. Optional sources (downloads, bundle size, GitHub) time out after 8s, so a slow API shows up as missing data instead of blocking the page.

---

## Design

- **Component library:** [shadcn/ui](https://ui.shadcn.com)
- **Theme:** Soft Pop via [tweakcn](https://tweakcn.com)
- **Design tokens:** Tailwind CSS 4 CSS variables used throughout 

---

## Project Structure

```
src/
├── app/                  # routes (App Router)
│   ├── api/search/       # npm search proxy used by the search dialog
│   ├── api/og/           # Open Graph images for packages and comparisons
│   ├── compare/          # /compare?a=<pkg>&b=<pkg>
│   ├── package/[...name] # /package/<name>, catch-all so scoped names work
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx, icon.tsx
│   └── error.tsx, not-found.tsx
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # header, footer, container, section
│   ├── home/ package/ compare/ search/   # page-specific components
│   ├── global/           # floating compare bar, scroll helpers
│   ├── og/               # Open Graph card layout
│   └── shared/           # error and status states, icons
├── services/
│   ├── api/              # one module per external API
│   └── queries/          # combine the APIs into page data
├── lib/                  # pure helpers: verdict, routes, github urls, formatting
├── features/search/      # search hook and client service
├── store/                # zustand store for the compare selection
├── hooks/ providers/ types/ config/
```

---

## Getting Started

```bash
# Install dependencies
npm install

# (optional) configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub token (no scopes needed). Raises the GitHub API limit from 60 to 5000 requests/hour — recommended in production. |
| `NEXT_PUBLIC_SITE_URL` | No | Public URL used for canonical links, Open Graph images and the sitemap. Defaults to the live demo. |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (`lint:fix` to auto-fix) |
| `npm run typecheck` | TypeScript without emitting |
| `npm test` | Jest test suite (`test:watch` for watch mode) |

Lint, typecheck and tests run on every push and pull request via GitHub Actions.

---

## License

MIT
