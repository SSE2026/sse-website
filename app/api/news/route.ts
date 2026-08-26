import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const locale = searchParams.get('locale') || 'en';
  const category = searchParams.get('category');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  const params = new URLSearchParams({
    locale,
    page,
    limit,
  });

  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (featured) params.set('featured', featured);

  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, error: 'API URL not configured' },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/blog?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: {
          revalidate: 60,
          tags: ['news', 'blog-posts'],
        },
      }
    );

    console.log('[news-api] Backend response:', response.status, response.statusText);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('[news-api] Backend error body:', errBody.substring(0, 500));
      return NextResponse.json(
        { success: false, error: `Backend returned ${response.status}: ${errBody.substring(0, 200)}` },
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
      { success: false, error: 'Backend unreachable' },
      { status: 502 }
    );
  }
}