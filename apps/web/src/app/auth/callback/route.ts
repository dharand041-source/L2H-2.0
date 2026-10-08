import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getOrigin(request: Request): string {
  // 1. Check x-forwarded-host (standard for reverse proxies like Vercel, AWS, Cloudflare, Nginx)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    const host = forwardedHost.split(',')[0].trim();
    return `${forwardedProto}://${host}`;
  }

  // 2. Check NEXT_PUBLIC_APP_URL environment variable if set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }

  // 3. Fall back to host header
  const host = request.headers.get('host');
  if (host) {
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const proto = isLocal ? 'http' : (request.headers.get('x-forwarded-proto') || 'https');
    return `${proto}://${host}`;
  }

  // 4. Default to request.url origin
  return new URL(request.url).origin;
}

function createRedirectUrl(origin: string, path: string, params?: Record<string, string | null | undefined>): URL {
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : `/${path.replace(/^(\/)+/, '')}`;
  const redirectUrl = new URL(safePath, origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        redirectUrl.searchParams.set(key, value);
      }
    });
  }
  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const mode = requestUrl.searchParams.get('mode'); // 'signin' | 'signup'
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const origin = getOrigin(request);

  if (error) {
    console.error('OAuth provider error:', error, errorDescription);
    const target = mode === 'signup' ? '/auth/signup' : '/auth/login';
    return NextResponse.redirect(createRedirectUrl(origin, target, { error: errorDescription || error }));
  }

  if (code) {
    const supabase = createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Failed to exchange OAuth code for session:', exchangeError.message);
      const target = mode === 'signup' ? '/auth/signup' : '/auth/login';
      return NextResponse.redirect(createRedirectUrl(origin, target, { error: exchangeError.message }));
    }

    const user = data.user;
    if (user) {
      try {
        // Query if profile already exists in public.profiles
        const { data: existingProfile, error: profileSelectError } = await supabase
          .from('profiles')
          .select('id, target_role_id, full_name, created_at')
          .eq('id', user.id)
          .maybeSingle();

        if (profileSelectError) {
          console.warn('Profile select warning:', profileSelectError.message);
        }

        // =========================================================================
        // PROFILE INITIALIZATION & PERSISTENCE
        // =========================================================================
        if (!existingProfile) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Candidate';

          const avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null;

          const { error: insertError } = await supabase.from('profiles').upsert(
            {
              id: user.id,
              full_name: fullName,
              avatar_url: avatarUrl,
              career_track: 'TECHNICAL',
              readiness_score: 0,
              is_public_profile: false,
              preferred_work_modes: ['REMOTE', 'HYBRID'],
            },
            { onConflict: 'id' }
          );

          if (insertError) {
            console.warn('Profile initialization upsert notice:', insertError.message);
          }
        }

        // Determine destination:
        // 1. Explicit next param takes priority (validated to be safe relative path)
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          return NextResponse.redirect(createRedirectUrl(origin, next));
        }

        // 2. Explicit sign-up mode for new candidate without target role goes to onboarding
        if (mode === 'signup' && !existingProfile?.target_role_id) {
          return NextResponse.redirect(createRedirectUrl(origin, '/onboarding'));
        }

        // 3. Post-authentication destination: default to dashboard or onboarding
        const defaultDest = mode === 'signup' && !existingProfile?.target_role_id ? '/onboarding' : '/app/dashboard';
        return NextResponse.redirect(createRedirectUrl(origin, defaultDest));
      } catch (profileErr) {
        console.error('Profile verification or creation error:', profileErr);
        return NextResponse.redirect(createRedirectUrl(origin, '/app/dashboard'));
      }
    }
  }

  // If no code was provided
  return NextResponse.redirect(
    createRedirectUrl(origin, '/auth/login', {
      error: 'Authentication authorization code was not received.',
    })
  );
}
