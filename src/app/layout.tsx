import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { CompareFloatingBar } from "@/components/global/compare-floating-bar";
import { ScrollToTop } from "@/components/global/scroll-to-top";
import { ScrollToTopOnNavigate } from "@/components/global/scroll-to-top-on-navigate";
import { Header } from "@/components/layout/header";
import { GlobalSearch } from "@/components/search/global-search";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

// Self-hosted (OFL) variable fonts, latin subset. next/font/google failed
// intermittently under Turbopack when Google answered with /l/font?kit= URLs,
// and hosting them also removes a network fetch from every build.
const familjen = localFont({
  src: "./fonts/familjen-grotesk-latin.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-familjen",
  adjustFontFallback: "Arial",
});

const plex = localFont({
  src: "./fonts/ibm-plex-sans-latin.woff2",
  weight: "100 700",
  display: "swap",
  variable: "--font-plex",
  adjustFontFallback: "Arial",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-jetbrains",
  adjustFontFallback: false,
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
      <head>
        {/* Marks that script runs, so no-script states (every switcher panel) can show. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
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
