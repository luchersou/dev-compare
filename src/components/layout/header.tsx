"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/shared/icons";
import Link from "next/link";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300",
        scrolled
          ? "top-4 w-[95%] max-w-6xl rounded-2xl border border-border bg-background/70 backdrop-blur-xl shadow-lg"
          : "top-0 w-full bg-transparent"
      )}
    >
      <div className="flex items-center gap-6 px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold transition-opacity hover:opacity-80"
        >
          <span className="text-primary text-xl leading-none">⇄</span>
          <span>DevCompare</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
          <a
            href="https://github.com/luchersou/npm-comparator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-1.5 transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}