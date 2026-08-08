import { NextResponse } from "next/server";
import { getPublishedTools } from "../../../lib/tools";

export async function GET() {
  try {
    const tools = await getPublishedTools();

    return NextResponse.json({
      success: true,
      count: tools.length,
      tools,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}