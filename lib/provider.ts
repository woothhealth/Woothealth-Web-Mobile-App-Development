import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://backend.woothealth.com/providers/', {
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data);
}