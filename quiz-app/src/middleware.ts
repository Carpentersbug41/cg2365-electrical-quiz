import { NextRequest, NextResponse } from 'next/server';

const COURSE_PREFIX = '/2365';

const SKIP_PREFIXES = ['/_next', '/api', '/auth'];
const SKIP_PATHS = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];

function isPublicFile(pathname: string) {
  const lastSegment = pathname.split('/').pop() ?? '';
  return lastSegment.includes('.') && lastSegment !== '.well-known';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (SKIP_PATHS.includes(pathname)) return NextResponse.next();
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return NextResponse.next();
  if (isPublicFile(pathname)) return NextResponse.next();

  if (pathname === COURSE_PREFIX || pathname.startsWith(`${COURSE_PREFIX}/`)) {
    const stripped = pathname.slice(COURSE_PREFIX.length) || '/';
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.rewrite(url);
  }

  const url = req.nextUrl.clone();
  url.pathname = `${COURSE_PREFIX}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/', '/2365/:path*', '/learn/:path*', '/quiz/:path*', '/electron-simulation/:path*'],
};
