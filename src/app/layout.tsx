import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { CompareFloatingBar } from "@/components/global/compare-floating-bar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "DevCompare — Compare npm packages",
    template: "%s — DevCompare",
  },
  description: "Compare npm packages side by side. Downloads, bundle size, GitHub stats and more.",
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
      className={cn("h-full antialiased", dmSans.variable, spaceMono.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <QueryProvider>
            <div className="bg-grid-overlay" />
            <div className="bg-noise-overlay" />
            <CompareFloatingBar />
              {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}