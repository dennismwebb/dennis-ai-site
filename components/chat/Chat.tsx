"use client";

import { useChat } from "@/hooks/useChat";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type ChatProps = {
  /** Full-page chat keeps sidebar avatar; home embed is tighter */
  variant?: "embedded" | "page";
  showAvatar?: boolean;
};

export default function Chat({ variant = "page", showAvatar = true }: ChatProps) {
  const { messages, sendMessage, isLoading } = useChat();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    await sendMessage(text);
  };

  const showSideAvatar = showAvatar && variant === "page";

  return (
    <div className="flex h-full min-h-0 flex-1">
      {showSideAvatar && (
        <div className="hidden w-1/3 shrink-0 items-start justify-center pt-8 md:flex lg:w-1/4">
          <Image
            src="/avatars/waving.png"
            alt="Dennis avatar"
            width={220}
            height={220}
            className="rounded-full object-contain ring-1 ring-slate-200/80 dark:ring-slate-600"
            priority
          />
        </div>
      )}

      <div
        className={`
          relative flex min-h-0 flex-1 flex-col
          bg-gradient-to-b from-slate-50 to-white
          dark:from-slate-900 dark:to-slate-950
          ${variant === "embedded" ? "" : ""}
        `}
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 pb-28">
          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic px-2">
              Try: “Summarize your experience with .NET and Angular” or “What are you building with AI agents?”
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
                      : "border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  }
                `}
              >
                <div className="[&_p]:my-1 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_code]:text-[0.9em]">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="
                  rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm italic
                  text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400
                "
              >
                Thinking…
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            absolute bottom-0 left-0 right-0 flex gap-2 border-t border-slate-200 bg-white/95 p-3
            backdrop-blur-sm sm:gap-3 sm:p-4
            dark:border-slate-700 dark:bg-slate-900/95
          "
        >
          <input
            type="text"
            name="message"
            placeholder="Ask about experience, stack, or projects…"
            autoComplete="off"
            className="
              min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900
              placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2
              focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100
              dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20
            "
          />
          <button
            type="submit"
            className="
              shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm
              bg-slate-900 hover:bg-slate-800 sm:px-6
              dark:bg-indigo-600 dark:hover:bg-indigo-500
              transition-colors
            "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
