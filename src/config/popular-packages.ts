export const POPULAR_PACKAGES = [
  "react",
  "typescript",
  "next",
  "zod",
  "tailwindcss",
  "axios",
  "express",
  "vite",
  "prisma",
] as const

export type PopularPackage = (typeof POPULAR_PACKAGES)[number]