import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/admin/banners/upload/signature - Get Cloudinary upload signature
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'image';

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
    const response = await fetch(
      `${API_BASE_URL}/v1/admin/banners/upload/signature?type=${type}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to get signature' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Banner Upload Signature API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
