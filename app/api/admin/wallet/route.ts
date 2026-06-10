import { NextResponse } from 'next/server';

const UPSTREAM = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const page = url.searchParams.get('page') || '1';

    const upstreamUrl = new URL('/admin/wallet', UPSTREAM || 'http://localhost');
    upstreamUrl.searchParams.set('search', search);
    upstreamUrl.searchParams.set('page', page);

    const res = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        // forward auth cookie if present
        cookie: request.headers.get('cookie') || '',
        accept: 'application/json',
      },
    });

    const data = await res.text();
    const headers: Record<string, string> = { 'content-type': res.headers.get('content-type') || 'application/json' };
    return new NextResponse(data, { status: res.status, headers });
  } catch (err: any) {
    // console.error('GET /api/admin/wallet proxy error', err);
    return NextResponse.json({ error: err?.message || 'Proxy error' }, { status: 500 });
  }
}
