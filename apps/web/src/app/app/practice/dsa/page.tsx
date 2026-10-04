'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DSAPracticePage() {
  const problems = [
    { id: 'dsa-01', title: 'Two Sum & Hash Map Lookup', difficulty: 'EASY', topic: 'Arrays & Hashing', source: 'LeetCode #1 / Learn-2-Hire Original' },
    { id: 'dsa-02', title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', topic: 'Sliding Window', source: 'LeetCode #3 / Learn-2-Hire Original' },
    { id: 'dsa-03', title: 'Merge K Sorted Linked Lists', difficulty: 'HARD', topic: 'Heap / Priority Queue', source: 'LeetCode #23 / Learn-2-Hire Original' },
    { id: 'dsa-04', title: 'Binary Tree Level Order Traversal', difficulty: 'MEDIUM', topic: 'BFS & Queues', source: 'LeetCode #102 / Learn-2-Hire Original' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Data Structures &amp; Algorithms</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          DSA Algorithmic Problem Sets
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Master core algorithmic paradigms—sliding window, two pointers, dynamic programming, and graph traversals.
        </p>
      </div>

      <div className="space-y-3">
        {problems.map((p) => (
          <div key={p.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={p.difficulty === 'EASY' ? 'yellow' : p.difficulty === 'MEDIUM' ? 'default' : 'rose'}>
                  {p.difficulty}
                </Badge>
                <span className="text-xs font-bold text-brand-ink/60">{p.topic}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {p.title}
              </h3>
              <div className="text-[11px] text-brand-ink/70">Source: {p.source}</div>
            </div>

            <Link href={ROUTES.app.practice.coding}>
              <Button variant="primary" size="sm">
                Solve Challenge →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
