"use client";

import { AvatarWaving } from "@/components/avatar/AvatarWaving";
import Link from "next/link";
import Chat from "@/components/chat/Chat";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative overflow-hidden
        border-b border-slate-200/80 dark:border-slate-800
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        pt-28 pb-16 sm:pb-20 lg:pt-32 lg:pb-24
      "
    >
      <div
        className="
          pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full
          bg-gradient-to-br from-indigo-400/15 via-violet-400/10 to-transparent
          blur-3xl dark:from-indigo-500/10 dark:via-violet-500/5
        "
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid min-h-0 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-stretch">
          {/* Intro — resume positioning */}
          <div className="space-y-6 lg:col-span-5 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Lead software engineer · Peoria, AZ
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Dennis Webb
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              I design and ship enterprise web platforms, explore applied AI, and teach
              adjunct — focused on clarity, reliability, and teams that ship.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="#experience"
                className="
                  inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold
                  bg-slate-900 text-white shadow-sm
                  hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100
                  transition-colors
                "
              >
                View experience
              </Link>
              <Link
                href="#projects"
                className="
                  inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold
                  border border-slate-300 bg-white text-slate-800
                  hover:border-slate-400 hover:bg-slate-50
                  dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800
                  transition-colors
                "
              >
                Selected projects
              </Link>
              <Link
                href="#chat"
                className="
                  inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold
                  text-indigo-700 dark:text-indigo-300
                  hover:text-indigo-900 dark:hover:text-indigo-200
                  transition-colors
                "
              >
                Ask the assistant →
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div
                className="
                  h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white
                  shadow-sm dark:border-slate-700 dark:bg-slate-900
                "
              >
                <AvatarWaving size={64} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug max-w-xs">
                Prefer email or LinkedIn for formal inquiries; use the assistant for a
                quick, conversational overview of my work.
              </p>
            </div>
          </div>

          {/* Chat — primary CTA: fixed height so the message list can overflow-y-scroll */}
          <div className="lg:col-span-7 flex min-h-0 flex-col h-[min(68dvh,560px)] lg:h-[min(70vh,640px)]">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Chat with my assistant
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Ask about stack, leadership, teaching, or side projects — answers stream live.
                </p>
              </div>
            </div>
            <div
              id="chat"
              className="
                flex flex-1 flex-col min-h-0 overflow-hidden rounded-2xl border border-slate-200/90
                bg-white shadow-sm ring-1 ring-slate-900/[0.04]
                dark:border-slate-700 dark:bg-slate-900 dark:ring-white/[0.06]
              "
            >
              <Chat variant="embedded" showAvatar={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
