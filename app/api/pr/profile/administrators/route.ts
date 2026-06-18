import { NextResponse } from 'next/server'

const parseJson = async (res: Response) => {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 })

    const cookieHeader = req.headers.get('cookie')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(`${BACKEND_URL}/provider/profile/administrators`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    })

    const data = await parseJson(backendRes)
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err: any) {
    // console.error('Provider profile administrators POST error', err?.message || err)
    return NextResponse.json({ success: false, error: 'Failed to create administrator' }, { status: 500 })
  }
}
