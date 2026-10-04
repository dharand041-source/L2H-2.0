import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const mode = requestUrl.searchParams.get('mode'); // 'signin' | 'signup'
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('OAuth provider error:', error, errorDescription);
    const redirectUrl = new URL(mode === 'signup' ? '/auth/signup' : '/auth/login', request.url);
    redirectUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    const supabase = createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Failed to exchange OAuth code for session:', exchangeError.message);
      const redirectUrl = new URL(mode === 'signup' ? '/auth/signup' : '/auth/login', request.url);
      redirectUrl.searchParams.set('error', exchangeError.message);
      return NextResponse.redirect(redirectUrl);
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

        // Determine if account is an existing registered user
        // An account is existing if a profile exists OR user was created in auth prior to this handshake
        const accountAgeMs = Date.now() - new Date(user.created_at).getTime();
        const hasExistingAccount = !!existingProfile || accountAgeMs > 90000;

        // =========================================================================
        // CONDITION 1: SIGN IN MODE (from /auth/login)
        // "if the user dont have signup they must signup"
        // If user does not have an account, block signin and require them to signup!
        // =========================================================================
        if (mode === 'signin' && !hasExistingAccount) {
          await supabase.auth.signOut();
          const redirectUrl = new URL('/auth/signup', request.url);
          redirectUrl.searchParams.set(
            'error',
            'No registered account found with this Google email. You must sign up first before signing in.'
          );
          return NextResponse.redirect(redirectUrl);
        }

        // =========================================================================
        // CONDITION 2: SIGN UP MODE (from /auth/signup)
        // "and the user signin they already have the signup account set the condition"
        // If user ALREADY has an account, redirect them to sign in!
        // =========================================================================
        if (mode === 'signup' && hasExistingAccount) {
          await supabase.auth.signOut();
          const redirectUrl = new URL('/auth/login', request.url);
          redirectUrl.searchParams.set(
            'message',
            'An account already exists with this Google email. Please sign in to your account.'
          );
          return NextResponse.redirect(redirectUrl);
        }

        // =========================================================================
        // NEW SIGN UP: Create profile in public.profiles
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

        // 2. Brand new signups or uncalibrated candidates go to onboarding
        if (mode === 'signup' || !existingProfile?.target_role_id) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        // 3. Returning candidate with target role goes to dashboard
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
      } catch (profileErr) {
        console.error('Profile verification or creation error:', profileErr);
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
      }
    }
  }

  // If no code was provided
  const redirectUrl = new URL('/auth/login', request.url);
  redirectUrl.searchParams.set('error', 'Authentication authorization code was not received.');
  return NextResponse.redirect(redirectUrl);
}
