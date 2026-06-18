import { NextResponse } from 'next/server'

const parseJson = async (res: Response) => {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 })

    const cookieHeader = req.headers.get('cookie') || ''
    const headers: Record<string, string> = { 'accept': 'application/json' }
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(`${BACKEND_URL}/provider/notifications`, {
      method: 'GET',
      headers,
      credentials: 'include',
      cache: 'no-store',
    })

    const data = await parseJson(backendRes)

    // normalize envelope { success, data }
    if (data && typeof data === 'object' && data.success && data.data) {
      return NextResponse.json(data.data, { status: backendRes.status })
    }
    return NextResponse.json(data || [], { status: backendRes.status })
  } catch (err: any) {
    // console.error('Provider notifications GET error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
