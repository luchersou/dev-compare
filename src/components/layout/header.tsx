"use client";

import { Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { GithubIcon } from "@/components/shared/icons";
import { Wordmark } from "@/components/shared/wordmark";
import { useSearchStore } from "@/store/search.store";

function subscribeNoop() {
  return () => {};
}

export function Header() {
  // false on the server and during hydration, true afterwards, so the theme
  // icon only renders once the client knows the theme.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const { theme, setTheme } = useTheme();
  const setSearchOpen = useSearchStore((s) => s.setOpen);
  const isDark = mounted && theme === "dark";

  return (
    <header className="nav">
      <nav className="nav__pill" aria-label="Main">
        <Link href="/" className="wordmark" aria-label="DevCompare home">
          <Wordmark />
          <span>DevCompare</span>
        </Link>

        <button
          type="button"
          className="nav__search"
          onClick={() => setSearchOpen(true)}
          aria-haspopup="dialog"
        >
          <Search aria-hidden="true" />
          <span>Search packages</span>
          <kbd className="kbd" aria-hidden="true">⌘K</kbd>
        </button>

        <div className="nav__links">
          <a
            href="https://github.com/luchersou/dev-compare"
            target="_blank"
            rel="noopener noreferrer"
            className="nav__link"
          >
            <GithubIcon aria-hidden="true" />
            <span className="nav__link-text">GitHub</span>
          </a>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="nav__toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
