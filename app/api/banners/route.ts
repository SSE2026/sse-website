import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/banners - Public list (active banners only)
export async function GET(request: NextRequest) {
  // Skip if no API URL configured (e.g., during build)
  if (!API_BASE_URL) {
    return NextResponse.json({ items: [] });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/banners`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 60 seconds
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error('Banners API error:', response.status);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch banners' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ items: data });
  } catch (error) {
    console.error('Banners API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
