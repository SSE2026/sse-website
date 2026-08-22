import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract query parameters
  const locale = searchParams.get('locale') || 'en';
  const category = searchParams.get('category');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  // Build query string
  const params = new URLSearchParams({
    locale,
    page,
    limit,
  });

  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (featured) params.set('featured', featured);

  // Skip if no API URL configured (e.g., during build)
  if (!API_BASE_URL) {
    return NextResponse.json({ success: true, items: [] });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/blog?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 1 minute, revalidate on new request
        next: {
          revalidate: 60,
          tags: ['news', 'blog-posts']
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch news' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
