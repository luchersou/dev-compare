# DevCompare

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

---

## Features

- 🔍 **Package search** — real-time npm search with debounced input
- 📦 **Package page** — version, description, bundle size, weekly downloads and GitHub stats
- ⚖️ **Side-by-side comparison** — compare two packages with a visual stats table and a verdict
- 📈 **Download chart** — historical download trends powered by Recharts
- 🌗 **Light / Dark mode** — theme toggle with shadcn + Tailwind
- 📱 **Responsive** — mobile-first layout throughout
- ⚡ **Server Components by default** — client components only where interaction is required (search bar)

---

## Data Sources

DevCompare aggregates data from four public APIs — no API key required:

| API | Usage |
|-----|-------|
| `registry.npmjs.org` | Package metadata, version, description |
| `api.npmjs.org` | Weekly download counts and historical data |
| `bundlephobia.com/api` | Bundle size (minified + gzip) |
| `api.github.com` | Stars, open issues, license |

---

## Design

- **Component library:** [shadcn/ui](https://ui.shadcn.com)
- **Theme:** Soft Pop via [tweakcn](https://tweakcn.com)
- **Design tokens:** Tailwind CSS 4 CSS variables used throughout 

---

## Project Structure
```
src/
├── app/
│   ├── compare/
│   │   └── page.tsx
│   │
│   ├── package/
│   │   └── [name]/
│   │       └── page.tsx
│   ├── api/
│   │   └── search/
│   │       └── route.ts
│   │
│   ├── icon.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css
│
├── components/
│   ├── ui/                # shadcn 
│   │
│   ├── layout/
│   │   ├── section.tsx
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── footer.tsx
│   │   └── container.tsx
│   │
│   ├── global/
│   │   ├── scroll-to-top-on-navigate.tsx
│   │   ├── scroll-to-top.tsx
│   │   └── compare-floating-bar.tsx
│   │
│   ├── home/
│   │   ├── popular-packages.tsx
│   │   ├── popular-comparisons.tsx
│   │   ├── comparison-card.tsx
│   │   ├── how-it-works.tsx
│   │   ├── popular-package-card.tsx
│   │   └── comparison-card-skeleton.tsx
│   │
│   ├── search/
│   │   ├── search-bar.tsx
│   │   ├── search-command.tsx
│   │   ├── search-item.tsx
│   │   └── search-skeleton.tsx
│   │
│   ├── package/
│   │   ├── package-hero.tsx
│   │   ├── stats-grid.tsx
│   │   ├── package-content-skeleton.tsx
│   │   ├── package-content.tsx
│   │   ├── package-metadata.tsx
│   │   ├── bundle-details.tsx
│   │   └── downloads-chart.tsx
│   │
│   ├── compare/
│   │   ├── compare-header.tsx
│   │   ├── compare-content-skeleton.tsx
│   │   ├── compare-content.tsx
│   │   ├── compare-fade-section.tsx
│   │   ├── summary-card.tsx
│   │   ├── compare-stats-table.tsx
│   │   └── compare-verdict.tsx
│   │
│   │
│   └── shared/
│       ├── error-state.tsx
│       └── icons.tsx
│
├── features/
│   └── search/
│       ├── use-search.ts
│       └── search.service.ts
│
├── store/
│   └── compare.store.ts/
│
├── services/
│   ├── api/
│   │   ├── npm.ts
│   │   ├── downloads.ts
│   │   ├── bundlephobia.ts
│   │   └── github.ts
│   │
│   └── query/
│       ├── package-summary.ts
│       ├── package-details.ts
│       └── popular-comparison.ts
│
├── lib/
│   ├── github.ts
│   ├── verdict.ts
│   └── utils.ts
│
├── hooks/
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
│
├── types/
│   ├── npm.ts
│   ├── downloads.ts
│   ├── compare.ts
│   ├── verdict.ts
│   ├── github.ts
│   ├── bundlephobia.ts
│   └── global.ts
│
└── config/
    ├── popular-comparison.ts
    └── popular-packages.ts
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

MIT
