import Navbar from "@/components/layout/Navbar";
import Chat from "@/components/chat/Chat";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Chat
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Same assistant as on the home page — use this route for a focused, full-width session.
          </p>
        </div>
        <div
          className="
            h-[min(78vh,720px)] min-h-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white
            shadow-sm ring-1 ring-slate-900/[0.04] dark:border-slate-700 dark:bg-slate-900 dark:ring-white/[0.06]
          "
        >
          <Chat variant="page" showAvatar />
        </div>
      </div>
    </main>
  );
}
