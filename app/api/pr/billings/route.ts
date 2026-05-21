import { NextResponse } from 'next/server'

const parseJson = async (res: Response) => {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || ''

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 })

    const cookieHeader = req.headers.get('cookie') || ''
    const headers: Record<string, string> = {}
    if (cookieHeader) headers['Cookie'] = cookieHeader

    const backendRes = await fetch(
      `${BACKEND_URL}/provider/billings${type ? `?type=${type}` : ''}`,
      {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store',
      }
    )

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for provider billings`)
      // fallback mock data
      const mockBillings = [
        {
          id: 'bill-001',
          date: '2024-04-15',
          invoiceNo: 'INV-2024-001',
          status: 'paid',
          hmoId: 'HMO-2103',
          dueDate: '2024-05-15',
          amount: 150000,
          billTo: { name: 'Ada Lovelace', address: '123 Health St, Lagos', email: 'ada@example.com', tel: '+234 123 456 7890' },
          billFrom: { name: 'Woot Health Clinic', address: '456 Medical Ave, Abuja', email: 'billing@woothealth.com', tel: '+234 987 654 3210' },
          treatments: [],
          subtotal: 150000,
          taxPercent: 7.5,
          taxAmount: 11250,
          totalAmount: 161250,
          paymentInfo: { method: 'Bank Transfer', transactionId: 'TXN-123456789', paymentDate: '2024-04-20' }
        }
      ]
      return NextResponse.json(mockBillings, { status: 200 })
    }

    const data = await parseJson(backendRes)
    if (data && typeof data === 'object' && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 })
    }
    return NextResponse.json(data || [], { status: 200 })
  } catch (err: any) {
    console.error('Provider billings GET error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to fetch billings' }, { status: 500 })
  }
}
