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

    const url = new URL(req.url);
    const qs = url.searchParams.toString();
    let target = `${BACKEND_URL}/provider/enrollees`;
    if (qs) target += `?${qs}`;
    // console.debug('pr/enrollees proxy target=', target);

    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    const parsed = await parseJson(backendRes as any);
    // Log a concise preview of the parsed JSON (max 10 items) to aid debugging
    try {
        if (typeof parsed === 'string') {
        // console.debug('pr/enrollees backend non-json response text=', parsed.slice(0, 2000));
      } else {
        // Try to extract an items array from common envelope shapes
        const items = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.data)
          ? parsed.data
          : parsed?.data
          ? Array.isArray(parsed.data)
            ? parsed.data
            : [parsed.data]
          : [];

        const preview = Array.isArray(items) ? items.slice(0, 10) : [];
        // console.debug('pr/enrollees backend parsed json preview=', {
        //   status: backendRes.status,
        //   total: Array.isArray(items) ? items.length : undefined,
        //   preview,
        //   raw: parsed,
        // });
      }
    } catch (logErr) {
      // console.debug('pr/enrollees backend parsed logging failed', logErr);
    }

    return NextResponse.json(parsed, { status: backendRes.status });
  } catch (err: any) {
    // console.error('pr/enrollees GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr enrollees GET' }, { status: 500 });
  }
}
