import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_COURSE_PREFIXES, DEFAULT_COURSE_PREFIX, getCoursePrefixFromPathname } from '@/lib/routing/curricula';

const SKIP_PREFIXES = ['/_next', '/api', '/auth'];
const SKIP_PATHS = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];
const SURFACE_MODE = (
  process.env.APP_SURFACE_MODE ??
  process.env.NEXT_PUBLIC_APP_SURFACE_MODE ??
  'all'
)
  .trim()
  .toLowerCase();

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

function isAllowedInV2Mode(pathname: string) {
  if (pathname === '/' || pathname.startsWith('/v2')) return true;
  if (pathname.startsWith('/api/v2') || pathname.startsWith('/api/admin/v2')) return true;
  if (pathname.startsWith('/api/onboarding')) return true;
  if (pathname.startsWith('/auth')) return true;
  if (pathname.startsWith('/_next')) return true;
  if (SKIP_PATHS.includes(pathname)) return true;
  if (isPublicFile(pathname)) return true;
  return false;
}

function isAllowedInV1Mode(pathname: string) {
  if (pathname.startsWith('/v2') || pathname.startsWith('/api/v2') || pathname.startsWith('/api/admin/v2')) {
    return false;
  }
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (SURFACE_MODE === 'v2') {
    if (pathname === '/') {
      const url = req.nextUrl.clone();
      url.pathname = '/v2';
      return NextResponse.redirect(url);
    }
    if (!isAllowedInV2Mode(pathname)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return new NextResponse('Not found', { status: 404 });
    }
    return NextResponse.next();
  }

  if (SURFACE_MODE === 'v1' && !isAllowedInV1Mode(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return new NextResponse('Not found', { status: 404 });
  }

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
    '/v2',
    '/v2/:path*',
    '/api',
    '/api/:path*',
    '/2365',
    '/2365/:path*',
    '/gcse/science/biology',
    '/gcse/science/biology/:path*',
    '/gcse/science/physics',
    '/gcse/science/physics/:path*',
    '/learn',
    '/learn/:path*',
    '/quiz',
    '/quiz/:path*',
    '/generate',
    '/generate/:path*',
    '/generate-quiz',
    '/generate-quiz/:path*',
    '/test-generation',
    '/test-generation/:path*',
    '/admin',
    '/admin/:path*',
    '/simulations',
    '/simulations/:path*',
  ],
};
