import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt = `You're an assistant helping users choose what to say in a conversation. 
                    Suggest 3 friendly, natural messages that the user can send to another person.

                    Make the suggestions sound human, thoughtful, and casual. Format your response as:

                    1. ...
                    2. ...
                    3. ...`;

    const result = await streamText({
      model: openai("gpt-4o"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Streaming error:", error);
    if (error?.statusCode && error?.error) {
      return NextResponse.json(
        {
          success: false,
          message: error.error.message || "OpenAI error",
        },
        {
          status: error.statusCode,
        }
      );
    }

    // Generic fallback
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
