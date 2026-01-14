import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function proxy(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const role = req.cookies.get('role')?.value;
  const path = req.nextUrl.pathname;

  if (!sessionCookie && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
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
