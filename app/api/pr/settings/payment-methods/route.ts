import { NextResponse } from 'next/server'

const parseJson = async (res: Response) => {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
    if (!BACKEND_URL) return NextResponse.json([], { status: 200 })

    const cookieHeader = req.headers.get('cookie')
    const headers: Record<string, string> = {}
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(`${BACKEND_URL}/provider/settings/payment-methods`, {
      headers,
      credentials: 'include',
    })
    const data = await parseJson(backendRes)
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err: any) {
    // console.error('Provider settings payment-methods GET error', err?.message || err)
    return NextResponse.json({ success: false, error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 })

    const cookieHeader = req.headers.get('cookie')
    const headers: Record<string, string> = {}
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(`${BACKEND_URL}/provider/settings/payment-methods/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    })

    const data = await parseJson(backendRes)
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err: any) {
    // console.error('Provider settings payment-methods DELETE error', err?.message || err)
    return NextResponse.json({ success: false, error: 'Failed to delete payment method' }, { status: 500 })
  }
}
