import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl, API_PREFIX } from "@/lib/api/config";

// GET /api/content/[page] - Public page content (no auth)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const baseUrl = getApiBaseUrl();
  const url = new URL(_request.url);
  const locale = url.searchParams.get("locale") || "en";

  try {
    const response = await fetch(
      `${baseUrl}${API_PREFIX}/content/${page}?locale=${locale}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      // No content row — return empty so frontend falls back to defaults.
      return NextResponse.json({ page, locale, content: {} });
    }

    const data = await response.json();
    // Unwrap { success, data: { page, locale, content } }
    return NextResponse.json(data?.data ?? data);
  } catch (error) {
    console.error("Public content proxy error:", error);
    return NextResponse.json({ page, locale, content: {} });
  }
}
