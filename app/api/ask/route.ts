import {
  API_UNAUTHORIZED_MESSAGE,
  ApiError,
  postAsk,
} from "@/lib/api";
import { NextResponse } from "next/server";

/**
 * BFF route for the RAG ask endpoint. The browser calls this route only;
 * API_KEY is attached here when proxying to the backend /api/ask pipeline.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body?.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    const { answer } = await postAsk(question);
    return NextResponse.json({ answer });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return NextResponse.json(
        { error: API_UNAUTHORIZED_MESSAGE },
        { status: 401 },
      );
    }

    console.error("[api/ask]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
