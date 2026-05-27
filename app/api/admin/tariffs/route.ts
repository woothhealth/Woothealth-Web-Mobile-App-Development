import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL for admin tariffs POST');
      return NextResponse.json({ success: true, data: { id: `mock-${Date.now()}`, ...body }, message: 'Mock tariffs created' }, { status: 201 });
    }

    const backendRes = await fetch(BACKEND_URL + '/admin/tariffs', {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await backendRes.json().catch(async () => {
      const text = await backendRes.text();
      return { text };
    });

    if (!backendRes.ok) {
      console.error('Backend admin/tariffs POST failed', backendRes.status, data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    return NextResponse.json(data || { success: true }, { status: backendRes.status || 200 });
  } catch (error: any) {
    console.error('Admin tariffs POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create tariffs' }, { status: 500 });
  }
}
