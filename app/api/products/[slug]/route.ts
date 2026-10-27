import { NextRequest, NextResponse } from 'next/server';
import { getConfiguredApiBaseUrl } from '@/lib/api/config';

// 运行时读取（NEXT_PUBLIC_ 前缀会被构建期内联，见 lib/api/config.ts）
const API_BASE_URL = getConfiguredApiBaseUrl();

// GET /api/products/[slug] - Public detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'en';

  // Skip if no API URL configured (e.g., during build)
  if (!API_BASE_URL) {
    return NextResponse.json({ success: false, error: 'API not configured' }, { status: 503 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/products/${slug}?locale=${locale}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      console.error('Product API error:', response.status);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
