import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock news data - used when backend API is not available
const MOCK_NEWS = [
  {
    id: 'mock-1',
    slug: 'sse-2026-q1-strategy-summit',
    title: 'SSE 2026 Q1 Strategy Summit Held in Shenzhen HQ',
    excerpt: 'Swift Safe Energy convened its global leadership team to outline the strategic roadmap for 2026.',
    coverImage: '/images/news/summit-2026.jpg',
    authorName: 'SSE Editorial Team',
    category: { id: 'cat-1', slug: 'company', name: 'Company News' },
    tags: ['strategy', 'global', '2026'],
    publishedAt: '2026-02-15T10:00:00Z',
    viewCount: 1245,
  },
  {
    id: 'mock-2',
    slug: '460-x-energy-density-breakthrough',
    title: '460 Wh/kg Energy Density: New Benchmark for eVTOL',
    excerpt: 'Our R&D team achieved a breakthrough in cell chemistry.',
    coverImage: '/images/news/460x-breakthrough.jpg',
    authorName: 'Dr. Wei Chen',
    category: { id: 'cat-2', slug: 'technology', name: 'Technology' },
    tags: ['rd', 'battery-tech'],
    publishedAt: '2026-02-08T09:30:00Z',
    viewCount: 2180,
  },
  {
    id: 'mock-3',
    slug: 'aeroride-400-e-launch',
    title: 'Aeroride 400-E Officially Launches',
    excerpt: 'New 400-E series combines high discharge rate with extended cycle life.',
    coverImage: '/images/news/400e-launch.jpg',
    authorName: 'Product Team',
    category: { id: 'cat-3', slug: 'product', name: 'Product' },
    tags: ['product-launch', '400e'],
    publishedAt: '2026-01-28T14:00:00Z',
    viewCount: 3567,
  },
  {
    id: 'mock-4',
    slug: 'drone-battery-market-2026',
    title: 'Global Drone Battery Market: Trends and Forecasts',
    excerpt: 'An industry analysis of the commercial drone battery market.',
    coverImage: '/images/news/drone-market.jpg',
    authorName: 'Market Research',
    category: { id: 'cat-4', slug: 'industry', name: 'Industry' },
    tags: ['market', 'drones'],
    publishedAt: '2026-01-20T11:30:00Z',
    viewCount: 1890,
  },
  {
    id: 'mock-5',
    slug: 'sse-europe-expansion',
    title: 'SSE Expands European Distribution Network',
    excerpt: 'Opening of Berlin sales office marks another milestone.',
    coverImage: '/images/news/berlin-office.jpg',
    authorName: 'SSE Editorial Team',
    category: { id: 'cat-1', slug: 'company', name: 'Company News' },
    tags: ['expansion', 'europe'],
    publishedAt: '2026-01-15T08:00:00Z',
    viewCount: 987,
  },
  {
    id: 'mock-6',
    slug: 'low-temperature-performance',
    title: 'How SSE Batteries Deliver Performance at -40°C',
    excerpt: 'A deep dive into our low-temperature electrolyte formulation.',
    coverImage: '/images/news/cold-weather.jpg',
    authorName: 'Dr. Mei Lin',
    category: { id: 'cat-2', slug: 'technology', name: 'Technology' },
    tags: ['rd', 'low-temp'],
    publishedAt: '2026-01-10T13:00:00Z',
    viewCount: 1456,
  },
];

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
    return NextResponse.json({
      success: true,
      items: MOCK_NEWS,
      meta: { page: 1, pageSize: MOCK_NEWS.length, total: MOCK_NEWS.length, totalPages: 1 },
    });
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
      console.error('News API error:', response.status);
      return NextResponse.json({
        success: true,
        items: MOCK_NEWS,
        meta: { page: 1, pageSize: MOCK_NEWS.length, total: MOCK_NEWS.length, totalPages: 1 },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({
      success: true,
      items: MOCK_NEWS,
      meta: { page: 1, pageSize: MOCK_NEWS.length, total: MOCK_NEWS.length, totalPages: 1 },
    });
  }
}
