import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedRoadmap } from '@/lib/curriculum';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get('career') || searchParams.get('role') || 'frontend-developer';

    // Attempt to read current authenticated user session if available
    let userSkills: any[] = [];
    let assessmentScore: number | undefined = undefined;

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fake-project.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fake-anon-key',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server component / route handler cookie read
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Fetch latest assessment attempt
      const { data: attempts } = await supabase
        .from('assessment_attempts')
        .select('score')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (attempts && attempts.length > 0 && attempts[0].score !== null) {
        assessmentScore = Number(attempts[0].score);
      }

      // Fetch user skills
      const { data: dbSkills } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id);

      if (dbSkills && dbSkills.length > 0) {
        userSkills = dbSkills.map((s) => ({
          name: s.skill_id, // or lookup name
          currentLevel: s.current_level || 'L0',
          requiredLevel: 'L4',
          gap: 2,
          confidence: s.confidence_score || 0.8,
          evidenceCount: 1,
          priority: 'HIGH',
        }));
      }
    }

    // Generate authoritative personalized roadmap
    const roadmap = generatePersonalizedRoadmap(targetRole, userSkills, assessmentScore);

    return NextResponse.json({
      career: roadmap.targetRoleTitle,
      target_role: roadmap.targetRoleTitle,
      readiness: roadmap.readinessScore,
      is_assessed: roadmap.isAssessed,
      total_modules: roadmap.totalModules,
      completed_modules: roadmap.completedModules,
      estimated_hours: roadmap.estimatedTotalHours,
      critical_gaps: roadmap.criticalGapsCount,
      modules: roadmap.modules,
    });
  } catch (error: any) {
    console.error('Error generating personalized curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized curriculum', details: error.message },
      { status: 500 }
    );
  }
}
