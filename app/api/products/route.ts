import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock product data - used when backend API is not available
const MOCK_PRODUCTS = [
  {
    id: "1",
    sku: "SSE-360P-001",
    model: "Aeroride 360-P",
    slug: "cloudchi-360-p",
    energyDensity: 360,
    cycleLife: 2000,
    weight: 3.5,
    nominalVoltage: 48,
    nominalCapacity: 100,
    length: 400,
    width: 200,
    height: 80,
    dischargeRate: 5,
    images: [{ id: "1", url: "/images/products/360p.png" }],
    variants: [],
    published: true,
  },
  {
    id: "2",
    sku: "SSE-400E-001",
    model: "Aeroride 400-E",
    slug: "cloudchi-400-e",
    energyDensity: 400,
    cycleLife: 1500,
    weight: 2.8,
    nominalVoltage: 72,
    nominalCapacity: 80,
    length: 350,
    width: 180,
    height: 75,
    dischargeRate: 10,
    images: [{ id: "1", url: "/images/products/400e.png" }],
    variants: [],
    published: true,
  },
  {
    id: "3",
    sku: "SSE-460X-001",
    model: "Aeroride 460-X",
    slug: "cloudchi-460-x",
    energyDensity: 460,
    cycleLife: 1000,
    weight: 2.2,
    nominalVoltage: 96,
    nominalCapacity: 60,
    length: 300,
    width: 150,
    height: 70,
    dischargeRate: 8,
    images: [{ id: "1", url: "/images/products/460x.png" }],
    variants: [],
    published: true,
  },
];

// GET /api/products - Public list
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'en';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '12';
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured');

  // Use mock data if no API URL configured
  if (!API_BASE_URL) {
    return NextResponse.json({ success: true, items: MOCK_PRODUCTS });
  }

  try {
    const params = new URLSearchParams({
      page,
      limit,
      locale,
    });

    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (featured !== null) params.set('featured', featured);

    const response = await fetch(
      `${API_BASE_URL}/v1/products?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Products API error:', response.status);
      return NextResponse.json(
        { success: false, error: `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Backend unreachable' },
      { status: 502 }
    );
  }
}
