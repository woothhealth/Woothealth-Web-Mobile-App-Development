import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reference = body?.reference;

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    const data = await verifyRes.json();

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Verification failed', details: data }, { status: verifyRes.status });
    }

    // Return Paystack response for client-side handling
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('Paystack verify error:', err?.message || err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
