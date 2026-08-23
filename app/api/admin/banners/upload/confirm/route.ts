import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// POST /api/admin/banners/upload/confirm - Confirm Cloudinary upload
export async function POST(request: NextRequest) {
  // Skip if no API URL configured (e.g., during build)
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, error: 'API not configured' },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { publicId, url } = body;

    if (!publicId || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing publicId or url' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/banners/upload/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ publicId, url }),
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to confirm upload' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Banner Upload Confirm API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
