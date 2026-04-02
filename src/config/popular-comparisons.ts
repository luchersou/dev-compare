export const POPULAR_COMPARISONS = [
  { a: "axios", b: "ky" },
  { a: "zustand", b: "redux" },
  { a: "vitest", b: "jest" },
  { a: "date-fns", b: "dayjs" },
  { a: "zod", b: "yup" },
  { a: "prisma", b: "drizzle-orm" },
  { a: "vite", b: "webpack" },
  { a: "react-query", b: "swr" },
  { a: "eslint", b: "biome" },
  { a: "npm", b: "pnpm" },
  { a: "tailwindcss", b: "unocss" },
  { a: "framer-motion", b: "motion" },
] as const

export type ComparisonPair = (typeof POPULAR_COMPARISONS)[number]