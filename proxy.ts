import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const session = req.cookies.get('session');
  const role = req.cookies.get('role');

  const pathname = req.nextUrl.pathname;

  // ✅ Allow auth routes always
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next();
  }

  // ✅ Allow first dashboard hit after login
  if (!session || !role) {
    const referer = req.headers.get('referer');

    if (referer?.includes('/login')) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ✅ Role-based protection
  if (
    pathname.startsWith('/dashboard/retail') &&
    role.value !== 'retail'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (
    pathname.startsWith('/dashboard/business') &&
    role.value !== 'business'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};