import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_COURSE_PREFIXES, DEFAULT_COURSE_PREFIX, getCoursePrefixFromPathname } from '@/lib/routing/curricula';

const SKIP_PREFIXES = ['/_next', '/api', '/auth'];
const SKIP_PATHS = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];

function isPublicFile(pathname: string) {
  const lastSegment = pathname.split('/').pop() ?? '';
  return lastSegment.includes('.') && lastSegment !== '.well-known';
}

function getPrefixFromReferer(req: NextRequest) {
  const referer = req.headers.get('referer');
  if (!referer) return DEFAULT_COURSE_PREFIX;

  try {
    const refererPathname = new URL(referer).pathname;
    return getCoursePrefixFromPathname(refererPathname);
  } catch {
    return DEFAULT_COURSE_PREFIX;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/') return NextResponse.next();
  if (SKIP_PATHS.includes(pathname)) return NextResponse.next();
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return NextResponse.next();
  if (isPublicFile(pathname)) return NextResponse.next();

  for (const prefix of SUPPORTED_COURSE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const stripped = pathname.slice(prefix.length) || '/';
      const url = req.nextUrl.clone();
      url.pathname = stripped;
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-course-prefix', prefix);
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  const prefix = getPrefixFromReferer(req);
  const url = req.nextUrl.clone();
  url.pathname = `${prefix}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/',
    '/2365/:path*',
    '/gcse/science/physics/:path*',
    '/learn/:path*',
    '/quiz/:path*',
    '/generate/:path*',
    '/generate-quiz/:path*',
    '/test-generation/:path*',
    '/admin/:path*',
    '/electron-simulation/:path*',
  ],
};
