import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function getSafeRedirectUrl(request: NextRequest, targetPath: string, searchParams?: Record<string, string>): URL {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  let url: URL;
  if (forwardedHost && !forwardedHost.includes('localhost')) {
    const host = forwardedHost.split(',')[0].trim();
    url = new URL(targetPath, `${forwardedProto}://${host}`);
  } else if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    url = new URL(targetPath, process.env.NEXT_PUBLIC_APP_URL);
  } else {
    url = request.nextUrl.clone();
    url.pathname = targetPath;
  }

  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
  }
  return url;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  
  // Fast-path: internal Next.js RSC requests (client-side tab switching)
  // Skip remote cloud round-trips to achieve instant (<100ms) tab routing
  const isRSC =
    request.headers.get('rsc') === '1' ||
    request.nextUrl.searchParams.has('_rsc') ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('next-router-state-tree') !== null;

  if (isRSC) {
    return supabaseResponse;
  }

  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith('sb-') && c.name.includes('-auth-token')
  );

  // Protected application routes
  const isProtectedPath = pathname.startsWith('/app') || pathname.startsWith('/onboarding');
  const isAuthPath = pathname === '/auth/login' || pathname === '/auth/signup';

  // If no auth cookie exists, skip remote Supabase request
  if (!hasAuthCookie) {
    // In dev mode, allow navigating freely without kicking out candidate session
    if (process.env.NODE_ENV !== 'production' && isProtectedPath) {
      return supabaseResponse;
    }

    if (isProtectedPath) {
      return NextResponse.redirect(getSafeRedirectUrl(request, '/auth/login', { next: pathname }));
    }
    return supabaseResponse;
  }

  // Active auth cookie exists: verify session with Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isProtectedPath && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(getSafeRedirectUrl(request, '/auth/login', { next: pathname }));
    }

    if (user && isAuthPath) {
      return NextResponse.redirect(getSafeRedirectUrl(request, '/app/dashboard'));
    }
  } catch (err) {
    console.error('Supabase middleware auth error:', err);
  }

  return supabaseResponse;
}
