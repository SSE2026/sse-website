import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock product data for fallback when backend is unavailable
const MOCK_PRODUCTS = [
  {
    id: "1",
    slug: "cloudchi-360-p",
    name: "CloudChi 360-P",
    nameZh: "云驰 360-P",
    series: "360-P",
    tagline: "Ultimate Endurance",
    taglineZh: "极致续航",
    description: "Premium solid-state battery optimized for maximum endurance and stability in extreme conditions.",
    descriptionZh: "专为极端条件下的极致续航和稳定性优化的优质固态电池。",
    category: "Aeroride Series",
    categoryZh: "云驰系列",
    badge: "Endurance+",
    badgeColor: "blue",
    featured: true,
    specifications: {
      energy: "360",
      energyUnit: "Wh/kg",
      voltage: "48V",
      capacity: "100Ah",
      cycle: "2000+",
      workingTemp: "-20°C to 60°C",
      weight: "3.5kg",
      dimensions: "400×200×80mm",
      chargingTemp: "0°C to 45°C",
      dischargingTemp: "-20°C to 60°C",
      maxChargeRate: "2C",
      maxDischargeRate: "5C",
      waterproof: "IP67",
    },
    features: [
      { icon: "battery", text: "High Energy Density", textZh: "高能量密度" },
      { icon: "thermometer", text: "Wide Temperature Range", textZh: "宽温域" },
      { icon: "shield", text: "Enhanced Safety", textZh: "增强安全性" },
      { icon: "clock", text: "Long Cycle Life", textZh: "长循环寿命" },
    ],
    images: ["/images/products/360p-1.jpg", "/images/products/360p-2.jpg"],
    video: "/videos/product-hero.mp4",
    isNew: false,
    isHot: true,
  },
  {
    id: "2",
    slug: "cloudchi-400-e",
    name: "CloudChi 400-E",
    nameZh: "云驰 400-E",
    series: "400-E",
    tagline: "Extreme Performance",
    taglineZh: "极致性能",
    description: "High-performance solid-state battery delivering exceptional power output for demanding applications.",
    descriptionZh: "为高要求应用提供卓越功率输出的高性能固态电池。",
    category: "Aeroride Series",
    categoryZh: "云驰系列",
    badge: "Power+",
    badgeColor: "green",
    featured: true,
    specifications: {
      energy: "400",
      energyUnit: "Wh/kg",
      voltage: "72V",
      capacity: "80Ah",
      cycle: "1500+",
      workingTemp: "-30°C to 55°C",
      weight: "2.8kg",
      dimensions: "350×180×75mm",
      chargingTemp: "-10°C to 50°C",
      dischargingTemp: "-30°C to 55°C",
      maxChargeRate: "3C",
      maxDischargeRate: "10C",
      waterproof: "IP67",
    },
    features: [
      { icon: "zap", text: "High Power Output", textZh: "高功率输出" },
      { icon: "thermometer", text: "Low Temperature Ready", textZh: "低温启动" },
      { icon: "shield", text: "Enhanced Safety", textZh: "增强安全性" },
      { icon: "gauge", text: "Fast Charging", textZh: "快速充电" },
    ],
    images: ["/images/products/400e-1.jpg", "/images/products/400e-2.jpg"],
    video: "/videos/product-hero.mp4",
    isNew: false,
    isHot: false,
  },
  {
    id: "3",
    slug: "cloudchi-460-x",
    name: "CloudChi 460-X",
    nameZh: "云驰 460-X",
    series: "460-X",
    tagline: "Maximum Energy",
    taglineZh: "最大能量",
    description: "Next-generation solid-state battery pushing the boundaries of energy density for future applications.",
    descriptionZh: "为未来应用突破能量密度极限的新一代固态电池。",
    category: "Aeroride Series",
    categoryZh: "云驰系列",
    badge: "Future+",
    badgeColor: "purple",
    featured: true,
    specifications: {
      energy: "460",
      energyUnit: "Wh/kg",
      voltage: "96V",
      capacity: "60Ah",
      cycle: "1000+",
      workingTemp: "-40°C to 50°C",
      weight: "2.2kg",
      dimensions: "300×150×70mm",
      chargingTemp: "-20°C to 45°C",
      dischargingTemp: "-40°C to 50°C",
      maxChargeRate: "1.5C",
      maxDischargeRate: "8C",
      waterproof: "IP65",
    },
    features: [
      { icon: "battery", text: "Maximum Energy Density", textZh: "最大能量密度" },
      { icon: "thermometer", text: "Ultra Low Temp", textZh: "超低温" },
      { icon: "shield", text: "Next-Gen Safety", textZh: "下一代安全" },
      { icon: "rocket", text: "Future Ready", textZh: "面向未来" },
    ],
    images: ["/images/products/460x-1.jpg", "/images/products/460x-2.jpg"],
    video: "/videos/product-hero.mp4",
    isNew: true,
    isHot: false,
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

  // Use mock data if no API URL configured (e.g., during build or production without backend)
  if (!API_BASE_URL) {
    console.log('API_BASE_URL not configured, using mock product data');
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
      console.error('Products API error:', response.status);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products' },
        { status: response.status }
      );
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
