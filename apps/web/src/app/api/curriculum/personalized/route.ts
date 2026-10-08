import { NextRequest, NextResponse } from 'next/server';
import { generateCareerRoadmap } from '@/lib/roadmap';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get('career') || searchParams.get('role') || 'full-stack-developer';

    // Attempt to read current authenticated user session if available
    let userSkills: any[] = [];
    let assessmentScore: number | undefined = undefined;
    let completedNodeIds: string[] = [];

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
          name: s.skill_id,
          currentLevel: s.current_level || 'L0',
          requiredLevel: 'L4',
          gap: 2,
          confidence: s.confidence_score || 0.8,
          evidenceCount: 1,
          priority: 'HIGH',
        }));
      }

      // Fetch completed path items
      const { data: paths } = await supabase
        .from('learning_paths')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (paths && paths.length > 0) {
        const { data: items } = await supabase
          .from('learning_path_items')
          .select('node_id, sequence_order')
          .eq('learning_path_id', paths[0].id)
          .eq('is_completed', true);

        if (items) {
          completedNodeIds = items.map((i) => i.node_id || String(i.sequence_order));
        }
      }
    }

    // Generate authoritative personalized roadmap
    const roadmap = generateCareerRoadmap({
      targetRoleSlug: targetRole,
      userSkills,
      assessmentScore,
      completedNodeIds,
    });

    const response = NextResponse.json({
      career_role_slug: roadmap.careerRoleSlug,
      career_role_id: roadmap.careerRoleId,
      career: roadmap.targetRoleTitle,
      target_role: roadmap.targetRoleTitle,
      roadmap_version: roadmap.roadmapVersion,
      source_version: roadmap.sourceVersion,
      user_mode: roadmap.userMode,
      readiness: roadmap.readinessScore,
      progress_percent: roadmap.progressPercent,
      is_assessed: roadmap.isAssessed,
      total_nodes: roadmap.totalNodes,
      completed_nodes: roadmap.completedNodes,
      estimated_hours: roadmap.estimatedTotalHours,
      critical_gaps: roadmap.criticalGapsCount,
      next_best_action: roadmap.nextBestAction,
      phases: roadmap.phases,
      weekly_plan: roadmap.weeklyPlan,
      dependency_graph: roadmap.dependencyGraph,
    });

    // Role-scoped caching headers with stale validation protection
    response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=120');
    response.headers.set('X-Career-Role-Id', roadmap.careerRoleId);
    response.headers.set('X-Career-Role-Slug', roadmap.careerRoleSlug);

    return response;
  } catch (error: any) {
    console.error('Error generating personalized roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized roadmap', details: error.message },
      { status: 500 }
    );
  }
}
