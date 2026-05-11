"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors";
  const chatClass =
    "font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors";

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        border-b border-slate-200/90 bg-white/90 backdrop-blur-md
        dark:border-slate-800 dark:bg-slate-950/90
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-slate-900 dark:text-white tracking-tight"
        >
          Dennis Webb
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/#chat" className={chatClass}>
            Chat
          </Link>
          <Link href="/#about" className={linkClass}>
            About
          </Link>
          <Link href="/#skills" className={linkClass}>
            Skills
          </Link>
          <Link href="/#projects" className={linkClass}>
            Projects
          </Link>
          <Link href="/#experience" className={linkClass}>
            Experience
          </Link>
          <Link href="/#life" className={linkClass}>
            Life
          </Link>
          <Link href="/#prompts" className={linkClass}>
            Topics
          </Link>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {open && (
        <div
          className="
            md:hidden border-t border-slate-200 bg-white px-6 py-4
            dark:border-slate-800 dark:bg-slate-950
          "
        >
          <nav className="flex flex-col gap-3 text-slate-700 dark:text-slate-200">
            <Link href="/#chat" className={chatClass} onClick={() => setOpen(false)}>
              Chat
            </Link>
            <Link href="/#about" className={linkClass} onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/#skills" className={linkClass} onClick={() => setOpen(false)}>
              Skills
            </Link>
            <Link href="/#projects" className={linkClass} onClick={() => setOpen(false)}>
              Projects
            </Link>
            <Link href="/#experience" className={linkClass} onClick={() => setOpen(false)}>
              Experience
            </Link>
            <Link href="/#life" className={linkClass} onClick={() => setOpen(false)}>
              Life
            </Link>
            <Link href="/#prompts" className={linkClass} onClick={() => setOpen(false)}>
              Topics
            </Link>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
