import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('OAuth provider error:', error, errorDescription);
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    const supabase = createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Failed to exchange OAuth code for session:', exchangeError.message);
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('error', exchangeError.message);
      return NextResponse.redirect(redirectUrl);
    }

    const user = data.user;
    if (user) {
      // Ensure user profile exists in public.profiles (avoid duplicates)
      try {
        const { data: existingProfile, error: profileSelectError } = await supabase
          .from('profiles')
          .select('id, target_role_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileSelectError) {
          console.warn('Profile select warning:', profileSelectError.message);
        }

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

          await supabase.from('profiles').upsert(
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
        }

        // Determine destination:
        // 1. Explicit next param takes priority
        if (next) {
          return NextResponse.redirect(new URL(next, request.url));
        }

        // 2. Returning user with target role goes to dashboard, brand new user goes to onboarding
        if (existingProfile?.target_role_id) {
          return NextResponse.redirect(new URL('/app/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      } catch (profileErr) {
        console.error('Profile verification or creation error:', profileErr);
        // User session is valid; continue to dashboard
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
      }
    }
  }

  // If no code was provided
  const redirectUrl = new URL('/auth/login', request.url);
  redirectUrl.searchParams.set('error', 'Authentication authorization code was not received.');
  return NextResponse.redirect(redirectUrl);
}
