"use client";

import { useState } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Chat hook — UI layer for the portfolio RAG assistant.
 *
 * Flow: user message → POST /api/ask (Next.js route, no API key in browser)
 * → server attaches API_KEY and calls backend /api/ask → RAG pipeline returns
 * { answer } → assistant bubble renders the answer as markdown.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") return data.error;
  } catch {
    // ignore non-JSON bodies
  }
  if (response.status === 401) {
    return "The assistant is temporarily unavailable. Please try again later.";
  }
  return "Something went wrong. Please try again.";
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        const errorMessage = await readErrorMessage(response);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMessage },
        ]);
        return;
      }

      const data = await response.json();
      const answer =
        typeof data?.answer === "string"
          ? data.answer
          : "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
