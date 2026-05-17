import {
  API_UNAUTHORIZED_MESSAGE,
  ApiError,
  postChat,
} from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const backendRes = await postChat(message);

    return new Response(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
      },
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return NextResponse.json(
        { error: API_UNAUTHORIZED_MESSAGE },
        { status: 401 },
      );
    }

    console.error("[api/chat]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
