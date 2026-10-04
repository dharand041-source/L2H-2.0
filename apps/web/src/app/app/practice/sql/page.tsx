'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, Play, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SQLPracticePage() {
  const [query, setQuery] = useState(`SELECT 
  u.id, 
  u.name, 
  COUNT(o.id) as total_orders, 
  SUM(o.amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.status = 'COMPLETED'
GROUP BY u.id, u.name
HAVING SUM(o.amount) > 500
ORDER BY total_spent DESC;`);

  const [results, setResults] = useState<any[] | null>(null);

  const handleExecute = () => {
    setResults([
      { id: '101', name: 'Elena Rostova', total_orders: 8, total_spent: '$1,420.00' },
      { id: '104', name: 'Marcus Vance', total_orders: 5, total_spent: '$890.50' },
      { id: '112', name: 'Priya Sharma', total_orders: 4, total_spent: '$640.00' }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <Badge variant="yellow">SQL Query Sandbox</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
          <Badge variant="yellow">Relational Queries</Badge>
          <h1 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Top Spenders with Conditional Aggregations
          </h1>
          <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
            Write a PostgreSQL query to retrieve users who have completed orders totaling over $500. Calculate total orders count and order descending by total amount spent.
          </p>
          <div className="p-3 bg-brand-cream border border-brand-ink/20 text-xs font-mono space-y-1">
            <div>Schema: users (id, name, email)</div>
            <div>Schema: orders (id, user_id, amount, status)</div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="border-[1.5px] border-brand-ink bg-brand-ink text-brand-paper shadow-editorial">
            <div className="p-3 bg-brand-cream border-b border-brand-ink flex items-center justify-between text-brand-ink">
              <span className="text-xs font-mono font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-orange" /> query.sql
              </span>
              <Button variant="accent" size="sm" onClick={handleExecute}>
                <Play className="w-3.5 h-3.5 mr-1.5 inline" /> Run Query
              </Button>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={8}
              className="w-full p-4 bg-brand-ink text-brand-paper font-mono text-xs focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {results && (
            <div className="border-[1.5px] border-brand-ink bg-brand-paper p-4 shadow-editorial space-y-3">
              <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> 3 Rows Returned (12ms) &bull; Query Satisfies Rubric
              </div>
              <table className="w-full text-xs font-mono border-collapse border border-brand-ink/30">
                <thead>
                  <tr className="bg-brand-cream text-brand-ink border-b border-brand-ink/30">
                    <th className="p-2 text-left">id</th>
                    <th className="p-2 text-left">name</th>
                    <th className="p-2 text-left">total_orders</th>
                    <th className="p-2 text-left">total_spent</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b border-brand-ink/10">
                      <td className="p-2">{r.id}</td>
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.total_orders}</td>
                      <td className="p-2 font-bold">{r.total_spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
