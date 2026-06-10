import { NextResponse } from 'next/server'

const parseJson = async (res: Response) => {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

const UPSTREAM = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_URL || process.env.API_BASE_URL || '';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const upstreamUrl = new URL('/provider/tariffs', UPSTREAM || 'http://localhost')
    // forward all query params
    url.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value))

    const res = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') || '',
        accept: 'application/json',
      },
    })

    const data = await res.text()
    if (!res.ok) {
      console.error('Upstream /provider/tariffs error', {
        upstream: upstreamUrl.toString(),
        status: res.status,
        body: data,
        forwardedCookie: !!request.headers.get('cookie'),
      })
    }

    const headers: Record<string, string> = { 'content-type': res.headers.get('content-type') || 'application/json' }
    return new NextResponse(data, { status: res.status, headers })
  } catch (err: any) {
    console.error('GET /api/pr/tariffs proxy error', err)
    return NextResponse.json({ error: err?.message || 'Proxy error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!UPSTREAM) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 })

    const cookieHeader = req.headers.get('cookie')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(`${UPSTREAM}/provider/tariffs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    })

    const data = await parseJson(backendRes)
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err: any) {
    console.error('Provider tariffs POST error', err?.message || err)
    return NextResponse.json({ success: false, error: 'Failed to create tariffs' }, { status: 500 })
  }
}