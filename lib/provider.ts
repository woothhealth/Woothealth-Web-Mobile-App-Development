import { NextResponse } from 'next/server';

export async function GET() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  if (!BACKEND_URL) throw new Error('Backend URL not configured');

  const res = await fetch(`${BACKEND_URL}/providers/`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data);
}