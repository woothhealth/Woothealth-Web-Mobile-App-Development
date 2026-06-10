import { NextResponse } from 'next/server';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const target = `${BACKEND_URL}/provider/pa-codes`;

    const backendRes = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('pr/pa-code POST proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr pa-code POST' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const target = `${BACKEND_URL}/provider/pa-codes`;
    console.log('[route] forwarding GET to backend', { target });

    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    const text = await backendRes.text();
    try {
      const json = JSON.parse(text);
      try {
        console.log('[route] backend response for pr/pa-codes GET', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('[route] backend response for pr/pa-codes GET (inspect fallback)', json);
      }
      return NextResponse.json(json, { status: backendRes.status });
    } catch {
      try {
        console.log('[route] backend response for pr/pa-codes GET (text)', text);
      } catch (e) {
        console.log('[route] backend response for pr/pa-codes GET (text fallback)');
      }
      return NextResponse.json({ data: text }, { status: backendRes.status });
    }
  } catch (err: any) {
    console.error('pr/pa-code GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr pa-code GET' }, { status: 500 });
  }
}
