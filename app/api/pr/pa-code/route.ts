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
    // enrich body: map requestedBy -> assignedAgent, ensure careType, and add providerTier from provider profile if missing
    const enriched = { ...body };
    if (!enriched.assignedAgent && enriched.requestedBy) enriched.assignedAgent = enriched.requestedBy;
    if (!enriched.careType && body.careType) enriched.careType = body.careType;

    // populate providerTier from provider profile when not provided
    if (!enriched.providerTier) {
      try {
        const profileRes = await fetch(`${BACKEND_URL}/provider/profile/`, { headers: cookieHeader ? { Cookie: cookieHeader } : {}, credentials: 'include' });
        const profileText = await profileRes.text();
        try {
          const profileJson = JSON.parse(profileText);
          const tier = profileJson?.data?.tier || profileJson?.tier || profileJson?.data?.planTier || profileJson?.planTier || profileJson?.data?.providerTier || profileJson?.providerTier;
          if (tier) enriched.providerTier = tier;
        } catch {}
      } catch (e) {
        // ignore profile fetch errors; providerTier will remain unset
      }
    }
    // console.info('pr/pa-code POST proxying to backend', target);
    // console.debug('pr/pa-code POST original body', body);
    // console.debug('pr/pa-code POST enriched body', enriched);
    // console.debug('pr/pa-code POST outbound headers', headers);

    const backendRes = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(enriched),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    // console.debug('pr/pa-code POST backend response body', data);
    if (!backendRes.ok) {
      // console.error('pr/pa-code POST backend error', backendRes.status, data);
    }
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

    // forward query string if present so backend can filter by paCode or code
    const url = new URL(req.url);
    const qs = url.search ? `?${url.searchParams.toString()}` : '';
    const target = `${BACKEND_URL}/provider/pa-codes${qs}`;

    // console.info('pr/pa-code GET proxying to backend', target);
    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    const text = await backendRes.text();
    // console.debug('pr/pa-code GET backend response body', text);
    if (!backendRes.ok) {
      // console.error('pr/pa-code GET backend error', backendRes.status, text);
    }
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: backendRes.status });
    } catch {
      return NextResponse.json({ data: text }, { status: backendRes.status });
    }
    } catch (err: any) {
    // console.error('pr/pa-code GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr pa-code GET' }, { status: 500 });
  }
}
