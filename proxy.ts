import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const session = req.cookies.get('session');
  const role = req.cookies.get('role')?.value;
  const path = req.nextUrl.pathname;

  if (!session && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (role === 'retail' && path.startsWith('/dashboard/business')) {
    return NextResponse.redirect(new URL('/dashboard/retail', req.url));
  }

  if (role === 'business' && path.startsWith('/dashboard/retail')) {
    return NextResponse.redirect(new URL('/dashboard/business', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
