import { NextResponse } from 'next/server';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const target = `${BACKEND_URL}/provider/enrollees`;

    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const text = await backendRes.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: backendRes.status });
    } catch {
      return NextResponse.json({ data: text }, { status: backendRes.status });
    }
  } catch (err: any) {
    console.error('pr/enrollees GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr enrollees GET' }, { status: 500 });
  }
}
