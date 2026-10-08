'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Lock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Code2,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Calendar,
  Network,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import {
  generateCareerRoadmap,
  CareerRoadmap,
  RoadmapNode,
  RoadmapPhase,
  RoadmapNodeStatus,
  RoadmapNodeType,
  RoadmapResource
} from '@/lib/roadmap';
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ViewMode = 'PHASES' | 'GRAPH' | 'WEEKLY';

export default function LearningRoadmapPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const activeRoleSlug = state.targetCareerSlug || 'full-stack-developer';

  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('PHASES');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    PHASE_01_FOUNDATIONS: true,
    PHASE_02_CORE_SKILLS: true,
    PHASE_03_APPLIED_PRACTICE: true,
    PHASE_04_ADVANCED_SKILLS: true,
    PHASE_05_PROJECT_PROOF: true,
    PHASE_06_INTERVIEW_READINESS: true,
    PHASE_07_JOB_READINESS: true,
    PHASE_08_CONTINUOUS_IMPROVEMENT: true
  });
  const [isPending, startTransition] = useTransition();
  const [lastLoadedSlug, setLastLoadedSlug] = useState(activeRoleSlug);

  // Hydrate completed learning steps from localStorage and Supabase on mount & role change
  useEffect(() => {
    setLastLoadedSlug(activeRoleSlug);
    try {
      const stored = localStorage.getItem(`l2h_completed_nodes_${activeRoleSlug}`);
      if (stored) {
        setCompletedNodeIds(JSON.parse(stored));
      } else {
        setCompletedNodeIds([]);
      }
    } catch {
      // ignore
    }

    const loadRemote = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: paths } = await supabase
            .from('learning_paths')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (paths && paths.length > 0) {
            const { data: items } = await supabase
              .from('learning_path_items')
              .select('node_id, sequence_order, is_completed')
              .eq('learning_path_id', paths[0].id)
              .eq('is_completed', true);

            if (items && items.length > 0) {
              const remoteNodeIds = items
                .map((i) => i.node_id || String(i.sequence_order).padStart(2, '0'))
                .filter(Boolean);
              setCompletedNodeIds((prev) => Array.from(new Set([...prev, ...remoteNodeIds])));
            }
          }
        }
      } catch (err) {
        console.warn('Load remote learning progress note:', err);
      }
    };

    loadRemote();
  }, [activeRoleSlug]);

  // Dynamically synthesize role-specific, gap-driven personalized roadmap
  const roadmap: CareerRoadmap = useMemo(() => {
    return generateCareerRoadmap({
      targetRoleSlug: activeRoleSlug,
      userSkills: state.skills || [],
      assessmentScore: state.assessmentScore,
      completedNodeIds,
      searchQuery,
      statusFilter,
      typeFilter
    });
  }, [activeRoleSlug, state.skills, state.assessmentScore, completedNodeIds, searchQuery, statusFilter, typeFilter]);

  // Toggle completion of a roadmap node
  const toggleComplete = async (nodeId: string) => {
    const isCompleted = completedNodeIds.includes(nodeId);
    const nextCompleted = isCompleted
      ? completedNodeIds.filter((id) => id !== nodeId)
      : [...completedNodeIds, nodeId];

    setCompletedNodeIds(nextCompleted);

    try {
      localStorage.setItem(`l2h_completed_nodes_${activeRoleSlug}`, JSON.stringify(nextCompleted));
    } catch {
      // ignore
    }

    // Persist to Supabase learning_paths & learning_path_items
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const totalNodes = Math.max(roadmap.totalNodes, 1);
        const { data: pathRow } = await supabase
          .from('learning_paths')
          .upsert(
            {
              user_id: user.id,
              target_role_id: roadmap.careerRoleId,
              title: `${roadmap.targetRoleTitle} Personalized Roadmap`,
              description: `Career-specific curriculum path for ${roadmap.targetRoleTitle}`,
              progress_percent: Math.round((nextCompleted.length / totalNodes) * 100),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,target_role_id' }
          )
          .select();

        const pathId = pathRow && pathRow[0]?.id;
        if (pathId) {
          const targetNode = roadmap.phases
            .flatMap((p) => p.nodes)
            .find((n) => n.id === nodeId);

          await supabase.from('learning_path_items').upsert(
            {
              learning_path_id: pathId,
              node_id: nodeId,
              sequence_order: targetNode?.stageOrder || 1,
              topic: targetNode?.title || 'Roadmap Stage',
              is_completed: !isCompleted,
              completed_at: !isCompleted ? new Date().toISOString() : null,
              node_type: targetNode?.nodeType || 'LEARN',
              node_status: !isCompleted ? 'COMPLETED' : 'AVAILABLE',
              phase_id: targetNode?.phaseId || 'PHASE_01_FOUNDATIONS',
              estimated_hours: targetNode?.estimatedHours || 4.0,
              why_reason: targetNode?.why || '',
            },
            { onConflict: 'learning_path_id,sequence_order' }
          );
        }
      }
    } catch (err) {
      console.warn('Persist learning node progress note:', err);
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Step 31 & 33: Stale response protection during role switching
  if (lastLoadedSlug !== activeRoleSlug || roadmap.careerRoleSlug !== activeRoleSlug) {
    return (
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-12 text-center shadow-editorial space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
        <span className="font-mono text-sm uppercase tracking-wider font-bold text-brand-orange block">
          LOADING CAREER ROADMAP...
        </span>
        <p className="text-xs text-brand-ink/70">
          Synthesizing calibrated prerequisites and competency blueprint for {currentRole?.title || activeRoleSlug}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. EDITORIAL HEADER */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Career Roadmap Engine
              </span>
              <span className="editorial-badge bg-brand-ink text-brand-paper">
                Role: {roadmap.targetRoleTitle}
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Ver: {roadmap.roadmapVersion} ({roadmap.userMode} MODE)
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              {roadmap.targetRoleTitle} Roadmap
            </h1>
            <p className="text-sm text-brand-ink/80 max-w-2xl font-medium leading-relaxed">
              Dynamically synthesized curriculum from your verified skills, role prerequisites, diagnostic gaps, and industry benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={ROUTES.app.practice.home}>
              <Button variant="accent" size="sm">
                <Code2 className="w-4 h-4 mr-1 inline" /> Practice Arena →
              </Button>
            </Link>
            <Link href={ROUTES.app.assessments.baseline}>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-1 inline" /> Reassessment Diagnostic
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS TELEMETRY BAR & CANDIDATE MODE INDICATOR */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                Roadmap Progress:
              </span>
              <span className="font-display text-2xl font-bold text-brand-orange">
                {roadmap.progressPercent}%
              </span>
              <span className="text-xs text-brand-ink/60 font-mono">
                ({roadmap.completedNodes} of {roadmap.totalNodes} milestones)
              </span>
            </div>
            <div className="w-full sm:w-72 h-2.5 bg-brand-cream border border-brand-ink overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300"
                style={{ width: `${roadmap.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-ink/80">
            <div>
              <span className="text-brand-ink/50 uppercase block text-[10px]">Current Level</span>
              <span className="font-bold text-brand-ink">{roadmap.currentLevelSummary}</span>
            </div>
            <div className="h-6 w-[1px] bg-brand-ink/20 hidden sm:block" />
            <div>
              <span className="text-brand-ink/50 uppercase block text-[10px]">Target Level</span>
              <span className="font-bold text-brand-orange">{roadmap.targetLevelSummary}</span>
            </div>
            <div className="h-6 w-[1px] bg-brand-ink/20 hidden sm:block" />
            <div>
              <span className="text-brand-ink/50 uppercase block text-[10px]">Estimated Effort</span>
              <span className="font-bold text-brand-ink">{roadmap.estimatedTotalHours} Hours</span>
            </div>
            <div className="h-6 w-[1px] bg-brand-ink/20 hidden sm:block" />
            <div>
              <span className="text-brand-ink/50 uppercase block text-[10px]">Critical Gaps</span>
              <span className="font-bold text-brand-rose">{roadmap.criticalGapsCount} Domains</span>
            </div>
          </div>
        </div>

        {/* Candidate Mode Notice (Step 41, 42, 43) */}
        <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between text-xs">
          <span className="text-brand-ink/70">
            {roadmap.userMode === 'BEGINNER' && (
              <span className="text-brand-ink">
                🌱 <strong>Beginner Pathway:</strong> Starting from foundational internet and computer basics without assuming prior technical background.
              </span>
            )}
            {roadmap.userMode === 'AMATEUR' && (
              <span className="text-brand-ink">
                ⚡ <strong>Amateur Pathway:</strong> Baseline fundamentals verified. Accelerated to applied components and real-world implementations.
              </span>
            )}
            {roadmap.userMode === 'PROFESSIONAL' && (
              <span className="text-brand-ink">
                🏆 <strong>Professional Pathway:</strong> Core skills mastered. Focused on advanced scalability, capstone synthesis, and interview defense.
              </span>
            )}
          </span>
          <span className="text-[10px] font-mono text-brand-ink/50">
            Source: {roadmap.sourceVersion}
          </span>
        </div>
      </div>

      {/* 3. DAILY NEXT BEST ACTION SPOTLIGHT CARD (Step 25 & 58) */}
      {roadmap.nextBestAction && (() => {
        const nextBest = roadmap.nextBestAction;
        const primary = nextBest.primaryAction;

        return (
          <div className="bg-brand-yellow/15 border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange">
                  Recommended Daily Next Best Action
                </span>
              </div>
              <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Estimated {primary.estimatedHours} Hours
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="rose">{primary.nodeType}</Badge>
                  <span className="editorial-badge bg-brand-paper text-brand-ink text-[10px]">
                    {primary.skillName}
                  </span>
                  <span className="text-xs font-bold text-brand-orange">
                    {primary.levelUpgrade}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                  {primary.title}
                </h2>

                <p className="text-xs font-semibold text-brand-ink/90 leading-relaxed bg-brand-cream/60 p-2.5 border border-brand-ink/20">
                  💡 <strong>Why this action?</strong> {nextBest.whyThisAction}
                </p>

                <p className="text-xs text-brand-ink/80 leading-relaxed font-medium">
                  {primary.description}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2 items-start lg:items-end justify-between h-full pt-1">
                <div className="w-full space-y-2">
                  {primary.resources[0] && (
                    <a
                      href={primary.resources[0].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button variant="accent" size="sm" fullWidth className="text-xs font-bold">
                        Open Free Curriculum → <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                      </Button>
                    </a>
                  )}

                  {primary.practiceUrl && (
                    <Link href={primary.practiceUrl} className="w-full block">
                      <Button variant="outline" size="sm" fullWidth className="text-xs">
                        <Code2 className="w-3.5 h-3.5 mr-1 inline" /> Practice Challenge in Arena
                      </Button>
                    </Link>
                  )}

                  <button
                    onClick={() => toggleComplete(primary.id)}
                    className="w-full py-2 px-3 text-xs font-semibold border border-brand-ink bg-brand-paper hover:bg-brand-cream text-brand-ink flex items-center justify-center gap-1.5 transition-all"
                  >
                    {completedNodeIds.includes(primary.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-brand-orange" /> Mark Incomplete
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-brand-ink/40" /> Mark Milestone Complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. TOOLBAR: VIEW TOGGLES, SEARCH & FILTERS (Step 56 & 57) */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 border border-brand-ink bg-brand-cream p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('PHASES')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'PHASES' ? 'bg-brand-orange text-white' : 'text-brand-ink hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Curriculum Phases
            </button>
            <button
              onClick={() => setViewMode('GRAPH')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'GRAPH' ? 'bg-brand-orange text-white' : 'text-brand-ink hover:bg-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Dependency Graph
            </button>
            <button
              onClick={() => setViewMode('WEEKLY')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                viewMode === 'WEEKLY' ? 'bg-brand-orange text-white' : 'text-brand-ink hover:bg-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Weekly Plan
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/50" />
            <input
              type="text"
              placeholder="Search skills, topics, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-cream border border-brand-ink placeholder:text-brand-ink/40 font-medium focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-ink/10 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/60 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['ALL', 'AVAILABLE', 'COMPLETED', 'LOCKED', 'SKILL_GAP'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 border text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream/50 border-brand-ink/30 text-brand-ink hover:bg-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}

          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/60 mx-1 ml-3">
            Type:
          </span>
          {['ALL', 'LEARN', 'PRACTICE', 'CODE', 'PROJECT', 'INTERVIEW', 'REASSESSMENT'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-2 py-0.5 border text-[11px] font-semibold transition-all ${
                typeFilter === tp
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-brand-cream/50 border-brand-ink/30 text-brand-ink hover:bg-white'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* 5. VIEW MODE: PHASES VIEW (Canonical 8 Phases) */}
      {viewMode === 'PHASES' && (
        <div className="space-y-6">
          {roadmap.phases.map((phase) => {
            if (phase.nodes.length === 0) return null;
            const isExpanded = expandedPhases[phase.id] ?? true;

            return (
              <div key={phase.id} className="border-[1.5px] border-brand-ink bg-brand-paper shadow-editorial">
                {/* Phase Accordion Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full p-4 bg-brand-cream border-b-[1.5px] border-brand-ink flex items-center justify-between text-left hover:bg-brand-yellow/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl font-bold text-brand-orange">
                      {String(phase.phaseNumber).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
                        {phase.title}
                      </h3>
                      <p className="text-xs text-brand-ink/70 font-medium">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-brand-ink">
                      {phase.completedCount} / {phase.totalCount} Complete
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-brand-ink" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-brand-ink" />
                    )}
                  </div>
                </button>

                {/* Phase Nodes Grid */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6">
                    {phase.nodes.map((node: RoadmapNode) => {
                      const isDone = completedNodeIds.includes(node.id) || node.status === 'COMPLETED';
                      const isLocked = node.status === 'LOCKED';
                      const isRecommended = node.status === 'RECOMMENDED';

                      return (
                        <div
                          key={node.id}
                          className={`border-[1.5px] border-brand-ink p-5 transition-all ${
                            isDone
                              ? 'bg-brand-cream/50 opacity-80'
                              : isRecommended
                              ? 'bg-brand-yellow/10 border-brand-orange shadow-editorial-sm'
                              : isLocked
                              ? 'bg-brand-paper/40 border-brand-ink/40'
                              : 'bg-brand-paper shadow-editorial-sm'
                          }`}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Step Order & Status Icon */}
                            <div className="lg:col-span-1 flex lg:flex-col items-center gap-2">
                              <span className="font-display text-2xl font-bold text-brand-ink/80">
                                {String(node.stageOrder).padStart(2, '0')}
                              </span>

                              {isLocked ? (
                                <div
                                  className="p-1 border border-brand-ink/30 bg-brand-cream text-brand-ink/40"
                                  title="Locked: Prerequisite skills must be satisfied first"
                                >
                                  <Lock className="w-5 h-5" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => toggleComplete(node.id)}
                                  className="p-1 border border-brand-ink bg-brand-cream hover:bg-brand-yellow/40 transition-all"
                                  title={isDone ? 'Mark Incomplete' : 'Mark Milestone Complete'}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-brand-ink/40" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Node Core Content */}
                            <div className="lg:col-span-8 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant={
                                    isDone
                                      ? 'paper'
                                      : isRecommended
                                      ? 'orange'
                                      : isLocked
                                      ? 'paper'
                                      : 'yellow'
                                  }
                                >
                                  {node.status}
                                </Badge>

                                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                                  {node.nodeType}
                                </span>

                                <span className="editorial-badge bg-brand-ink text-white text-[10px]">
                                  {node.skillName}
                                </span>

                                <span className="text-xs font-bold text-brand-orange font-mono">
                                  {node.levelUpgrade}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-display text-xl font-bold uppercase text-brand-ink">
                                  {node.title}
                                </h4>
                                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed mt-0.5">
                                  {node.description}
                                </p>
                              </div>

                              {/* 6-Question Framework (Step 50) */}
                              <div className="bg-brand-cream/40 border border-brand-ink/20 p-3 space-y-2 text-xs">
                                <div>
                                  <span className="font-bold text-brand-orange uppercase text-[10px] block">
                                    Why it matters:
                                  </span>
                                  <span className="text-brand-ink/90 font-medium">{node.why}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-brand-ink/10">
                                  <div>
                                    <span className="font-bold text-brand-ink/70 uppercase text-[10px] block">
                                      What you learn:
                                    </span>
                                    <span className="text-brand-ink/80 text-[11px] font-medium">{node.what}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold text-brand-ink/70 uppercase text-[10px] block">
                                      How to prove:
                                    </span>
                                    <span className="text-brand-ink/80 text-[11px] font-medium">{node.prove}</span>
                                  </div>
                                </div>

                                {node.prerequisites && node.prerequisites.length > 0 && (
                                  <div className="pt-1 border-t border-brand-ink/10 flex items-center gap-1.5 text-[11px]">
                                    <span className="font-bold text-brand-ink/70">Prerequisites:</span>
                                    {node.prerequisites.map((p) => (
                                      <span
                                        key={p}
                                        className="px-1.5 py-0.2 bg-brand-paper border border-brand-ink/30 text-brand-ink text-[10px] font-mono"
                                      >
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Verified Free Learning Resources (Step 26 & 27) */}
                              {node.resources && node.resources.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/60 block">
                                    Verified Free Educational Resources:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {node.resources.map((res: RoadmapResource) => (
                                      <a
                                        key={res.id}
                                        href={res.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 border border-brand-ink/30 bg-brand-cream/60 hover:bg-white transition-all block text-left group"
                                      >
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                          <span className="text-[10px] font-bold text-brand-orange group-hover:underline">
                                            {res.sourceName}
                                          </span>
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-600">
                                            {res.isFree ? '100% FREE' : 'PAID'}
                                          </span>
                                        </div>
                                        <p className="text-xs font-semibold text-brand-ink line-clamp-1">
                                          {res.description}
                                        </p>
                                        <span className="text-[10px] text-brand-ink/50 mt-1 block font-mono">
                                          Verified: {res.lastVerifiedAt} • {res.difficulty}
                                        </span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Direct Actions & CTAs */}
                            <div className="lg:col-span-3 flex flex-col gap-2 items-start lg:items-end justify-between h-full pt-1">
                              <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5" /> {node.estimatedHours} hrs effort
                              </span>

                              <div className="space-y-2 w-full">
                                {node.resources[0] && (
                                  <a
                                    href={node.resources[0].sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block"
                                  >
                                    <Button
                                      variant={isRecommended ? 'accent' : 'primary'}
                                      size="sm"
                                      fullWidth
                                      className="text-xs font-bold"
                                      disabled={isLocked}
                                    >
                                      Learn Free <ExternalLink className="ml-1 w-3.5 h-3.5 inline" />
                                    </Button>
                                  </a>
                                )}

                                {node.practiceUrl && (
                                  <Link href={node.practiceUrl} className="w-full block">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      fullWidth
                                      className="text-xs"
                                      disabled={isLocked}
                                    >
                                      <Code2 className="mr-1 w-3.5 h-3.5 inline" /> Practice Challenge
                                    </Button>
                                  </Link>
                                )}

                                {node.projectUrl && (
                                  <Link href={node.projectUrl} className="w-full block">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      fullWidth
                                      className="text-xs border-brand-orange text-brand-orange font-bold hover:bg-brand-orange/10"
                                      disabled={isLocked}
                                    >
                                      <FolderGit2 className="mr-1 w-3.5 h-3.5 inline" /> Build Capstone
                                    </Button>
                                  </Link>
                                )}

                                <button
                                  onClick={() => toggleComplete(node.id)}
                                  disabled={isLocked}
                                  className="w-full py-1.5 px-3 text-xs font-semibold border border-brand-ink bg-brand-cream hover:bg-white text-brand-ink flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {isDone ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange" /> Completed
                                    </>
                                  ) : (
                                    <>
                                      <Circle className="w-3.5 h-3.5 text-brand-ink/40" /> Mark Complete
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. VIEW MODE: SKILL DEPENDENCY GRAPH (Step 46) */}
      {viewMode === 'GRAPH' && (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
          <div className="border-b border-brand-ink/20 pb-4">
            <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
              Prerequisite Skill Dependency Graph
            </h3>
            <p className="text-xs text-brand-ink/70 font-medium mt-1">
              Data-driven Directed Acyclic Graph (DAG) visualizing strict skill prerequisites and milestone unlock progression.
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.phases.map((phase) => (
              <div key={phase.id} className="border border-brand-ink/30 bg-brand-cream/30 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
                  {phase.title}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {phase.nodes.map((node) => {
                    const isDone = completedNodeIds.includes(node.id) || node.status === 'COMPLETED';
                    const isLocked = node.status === 'LOCKED';

                    return (
                      <div
                        key={node.id}
                        className={`p-3 border-[1.5px] border-brand-ink text-left space-y-2 ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-700'
                            : isLocked
                            ? 'bg-brand-paper/50 opacity-60 border-brand-ink/30'
                            : 'bg-brand-paper shadow-editorial-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase font-mono text-brand-ink/70">
                            Stage {node.stageOrder}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 border ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                                : isLocked
                                ? 'bg-brand-cream text-brand-ink/60 border-brand-ink/20'
                                : 'bg-brand-yellow/30 text-brand-ink border-brand-orange'
                            }`}
                          >
                            {node.status}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-brand-ink uppercase line-clamp-1">
                          {node.skillName}
                        </p>

                        <div className="text-[10px] text-brand-ink/70 space-y-1 font-mono">
                          <div>Target: {node.targetLevel}</div>
                          {node.prerequisites.length > 0 && (
                            <div className="text-brand-orange">
                              Requires: {node.prerequisites.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. VIEW MODE: WEEKLY PLAN VIEW (Step 24) */}
      {viewMode === 'WEEKLY' && (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
          <div className="border-b border-brand-ink/20 pb-4">
            <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
              Calculated Weekly Study Schedule
            </h3>
            <p className="text-xs text-brand-ink/70 font-medium mt-1">
              Dynamic pace breakdown mapping curriculum milestones into structured ~12-hour weekly study increments.
            </p>
          </div>

          <div className="space-y-4">
            {roadmap.weeklyPlan.map((week) => (
              <div key={week.weekNumber} className="border border-brand-ink bg-brand-cream/30 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-brand-ink/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-brand-orange">
                      Week {week.weekNumber}
                    </span>
                    <span className="text-xs font-bold uppercase text-brand-ink">
                      {week.focusDomain}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-brand-ink/70 font-mono">
                    Target: {week.targetHours} Hours
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {week.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-2.5 border border-brand-ink/30 bg-brand-paper space-y-1"
                    >
                      <span className="text-[10px] font-bold text-brand-orange uppercase">
                        {node.nodeType} • {node.estimatedHours}h
                      </span>
                      <p className="text-xs font-bold text-brand-ink line-clamp-1">
                        {node.skillName}
                      </p>
                      <p className="text-[10px] text-brand-ink/70 line-clamp-1">
                        {node.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
