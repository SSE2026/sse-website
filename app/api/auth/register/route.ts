import { NextResponse } from 'next/server';

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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return NextResponse.json(
        { message: 'API not configured' },
        { status: 503 }
      );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/register`, {
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

// Bootstrap admin endpoint - call after deployment
export async function PUT() {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return NextResponse.json(
        { message: 'API not configured' },
        { status: 503 }
      );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/bootstrap-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ssebatt.com',
        password: 'SSEadmin2026!',
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Bootstrap failed' },
      { status: 500 }
    );
  }
}
