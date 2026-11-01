import "./globals.css";

import type { Metadata } from "next";
import { Familjen_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

import { CompareFloatingBar } from "@/components/global/compare-floating-bar";
import { ScrollToTop } from "@/components/global/scroll-to-top";
import { ScrollToTopOnNavigate } from "@/components/global/scroll-to-top-on-navigate";
import { Header } from "@/components/layout/header";
import { GlobalSearch } from "@/components/search/global-search";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-familjen",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

const description = "Compare npm packages side by side. Downloads, bundle size, GitHub stats and more."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Compare npm packages`,
    template: `%s — ${SITE_NAME}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    description,
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(familjen.variable, plex.variable, jetbrains.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <QueryProvider>
            <GlobalSearch />
            <CompareFloatingBar />
            <ScrollToTopOnNavigate />
            <ScrollToTop />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
