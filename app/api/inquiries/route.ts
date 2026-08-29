import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl, API_PREFIX } from "@/lib/api/config";

// POST /api/inquiries - Public inquiry form submission.
// Proxies to NestJS POST /v1/inquiries (no auth needed — public RFQ endpoint).
export async function POST(request: NextRequest) {
  const baseUrl = getApiBaseUrl();

  try {
    const body = await request.json();

    const response = await fetch(`${baseUrl}${API_PREFIX}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            (data as { message?: string }).message ||
            "Failed to submit inquiry",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Inquiry proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
