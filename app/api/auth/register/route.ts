import { NextResponse } from 'next/server';
import { getApiBaseUrl, getConfiguredApiBaseUrl } from '@/lib/api/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Skip if no API URL configured (e.g., during build)
    if (!getConfiguredApiBaseUrl()) {
      return NextResponse.json(
        { message: 'API not configured' },
        { status: 503 }
      );
    }

    const res = await fetch(`${getApiBaseUrl()}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
