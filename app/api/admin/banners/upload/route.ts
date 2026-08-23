import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// POST /api/admin/banners/upload - Upload banner media file
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, MP4, WebM' },
        { status: 400 }
      );
    }

    // Max file sizes (in bytes)
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    const maxSize = allowedImageTypes.includes(file.type) ? maxImageSize : maxVideoSize;

    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${maxMB}MB` },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/banners/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to upload file' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Banner Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
