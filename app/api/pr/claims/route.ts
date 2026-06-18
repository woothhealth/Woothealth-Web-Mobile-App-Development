import { NextResponse } from 'next/server';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const target = `${BACKEND_URL}/provider/claims`;

    // console.info('pr/claims POST proxying to backend', target);
    // console.debug('pr/claims POST proxy body', body);

    // If a paCode was provided, fetch the full paCode object from the backend
    // and merge its data into the payload we send to the claims backend. The UI
    // only needs the treatment items visible, but the backend expects the
    // full pacode structure when creating a claim.
    let payloadToSend: any = { ...(body || {}) };
    try {
      if (body?.paCode) {
        const getUrl = `${BACKEND_URL}/provider/claims?paCode=${encodeURIComponent(body.paCode)}`;
        // console.debug('pr/claims POST fetching paCode data from backend', getUrl);
        const getRes = await fetch(getUrl, { method: 'GET', headers, credentials: 'include' });
        const getData = await parseJson(getRes);
        // normalize paCode object from possible response shapes
        let paObj: any = null;
        if (getData) {
          if (getData.data) {
            paObj = Array.isArray(getData.data) ? getData.data[0] : getData.data;
          } else if (Array.isArray(getData)) {
            paObj = getData[0];
          } else {
            paObj = getData;
          }
        }

        if (paObj) {
          // prefer paObj values for backend, but keep hmoId and any explicit items
          const paTreatment = paObj.treatment ?? paObj.treatmentItems ?? paObj.items ?? [];
          payloadToSend = {
            ...paObj,
            hmoId: body.hmoId ?? paObj.hmoId,
            paCode: body.paCode ?? paObj.paCode ?? paObj.code,
            // keep UI-chosen/normalized items if provided, otherwise use paTreatment
            items: Array.isArray(body.items) && body.items.length ? body.items : paTreatment,
          };
        }
      }
    } catch (errGet: any) {
      // console.error('pr/claims POST failed to fetch paCode data, falling back to original body', errGet?.message || errGet);
      payloadToSend = { ...(body || {}) };
    }

    const backendRes = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(payloadToSend),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    if (!backendRes.ok) {
      // console.error('pr/claims POST backend error', backendRes.status, data);
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('pr/claims POST proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr claims POST' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    // forward query string if present
    const url = new URL(req.url);
    const qs = url.search ? `?${url.searchParams.toString()}` : '';
    const target = `${BACKEND_URL}/provider/claims${qs}`;

    // console.info('pr/claims GET proxying to backend', target);
    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const text = await backendRes.text();
    // console.debug('pr/claims GET backend response body', text);
    if (!backendRes.ok) {
      // console.error('pr/claims GET backend error', backendRes.status, text);
    }
    try { return NextResponse.json(JSON.parse(text), { status: backendRes.status }); } catch { return NextResponse.json({ data: text }, { status: backendRes.status }); }
  } catch (err: any) {
    // console.error('pr/claims GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr claims GET' }, { status: 500 });
  }
}
