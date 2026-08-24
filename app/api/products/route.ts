import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock product data for fallback when backend is unavailable
const MOCK_PRODUCTS = [
  {
    id: "1",
    sku: "SSE-360P-001",
    model: "Aeroride 360-P",
    slug: "cloudchi-360-p",
    shortDescription: "Ultimate Endurance",
    description: "Premium solid-state battery optimized for maximum endurance and stability in extreme conditions.",
    energyDensity: 360,
    cycleLife: 2000,
    operatingTempMin: -20,
    operatingTempMax: 60,
    weight: 3.5,
    nominalVoltage: 48,
    nominalCapacity: 100,
    images: [{ id: "1", url: "/images/products/360p-hero.png" }],
    variants: [
      {
        id: "v1",
        sku: "SSE-360P-001-V1",
        name: "Aeroride 360-P Standard",
        nominalVoltage: 48,
        nominalCapacity: 100,
        energyDensity: 360,
        cycleLife: 2000,
      },
    ],
    published: true,
  },
  {
    id: "2",
    sku: "SSE-400E-001",
    model: "Aeroride 400-E",
    slug: "cloudchi-400-e",
    shortDescription: "Extreme Performance",
    description: "High-performance solid-state battery delivering exceptional power output for demanding applications.",
    energyDensity: 400,
    cycleLife: 1500,
    operatingTempMin: -30,
    operatingTempMax: 55,
    weight: 2.8,
    nominalVoltage: 72,
    nominalCapacity: 80,
    images: [{ id: "1", url: "/images/products/400e-hero.png" }],
    variants: [
      {
        id: "v1",
        sku: "SSE-400E-001-V1",
        name: "Aeroride 400-E Standard",
        nominalVoltage: 72,
        nominalCapacity: 80,
        energyDensity: 400,
        cycleLife: 1500,
      },
    ],
    published: true,
  },
  {
    id: "3",
    sku: "SSE-460X-001",
    model: "Aeroride 460-X",
    slug: "cloudchi-460-x",
    shortDescription: "Maximum Energy",
    description: "Next-generation solid-state battery pushing the boundaries of energy density for future applications.",
    energyDensity: 460,
    cycleLife: 1000,
    operatingTempMin: -40,
    operatingTempMax: 50,
    weight: 2.2,
    nominalVoltage: 96,
    nominalCapacity: 60,
    images: [{ id: "1", url: "/images/products/460x-hero.png" }],
    variants: [
      {
        id: "v1",
        sku: "SSE-460X-001-V1",
        name: "Aeroride 460-X Standard",
        nominalVoltage: 96,
        nominalCapacity: 60,
        energyDensity: 460,
        cycleLife: 1000,
      },
    ],
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

  // Use mock data if no API URL configured or if API call fails
  // This ensures product list always works, even without a running backend
  if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
    console.log('Using mock product data (API_BASE_URL:', API_BASE_URL, ')');
    return NextResponse.json({
      success: true,
      items: MOCK_PRODUCTS,
      total: MOCK_PRODUCTS.length,
      page: 1,
      limit: 12,
    });
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
      `${API_BASE_URL}/products?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Products API error:', response.status, '- using mock data');
      // Return mock data when backend returns error
      return NextResponse.json({
        success: true,
        items: MOCK_PRODUCTS,
        total: MOCK_PRODUCTS.length,
        page: 1,
        limit: 12,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products API error:', error);
    // Use mock data as fallback when backend is unavailable
    return NextResponse.json({
      success: true,
      items: MOCK_PRODUCTS,
      total: MOCK_PRODUCTS.length,
      page: 1,
      limit: 12,
      _fallback: true,
    });
  }
}
