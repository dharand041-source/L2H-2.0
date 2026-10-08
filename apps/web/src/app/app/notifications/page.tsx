'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  Award,
  Briefcase,
  AlertTriangle,
  FileText,
  Filter,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NotificationStore,
  CareerNotification,
  NotificationType
} from '@/lib/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<CareerNotification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'UNREAD' | NotificationType>('ALL');

  useEffect(() => {
    setNotifications(NotificationStore.getNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    NotificationStore.markAsRead(id);
    setNotifications(NotificationStore.getNotifications());
  };

  const handleMarkAllRead = () => {
    NotificationStore.markAllAsRead();
    setNotifications(NotificationStore.getNotifications());
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'UNREAD') return !n.isRead;
    return n.type === selectedFilter;
  });

  const filterTabs: Array<{ label: string; value: 'ALL' | 'UNREAD' | NotificationType }> = [
    { label: 'All Updates', value: 'ALL' },
    { label: `Unread (${unreadCount})`, value: 'UNREAD' },
    { label: 'Jobs', value: 'JOB' },
    { label: 'Resume', value: 'RESUME' },
    { label: 'Roadmap & Learning', value: 'LEARNING' },
    { label: 'Assessment', value: 'ASSESSMENT' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="editorial-badge bg-brand-orange text-white">
              Action Center
            </span>
            <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
              Career &amp; Opportunity Feeds
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Notification Center
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Real-time updates regarding verified job matches, milestone evidence evaluations, and actionable resume optimization opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="w-3.5 h-3.5 mr-1.5" /> Mark All as Read
            </Button>
          )}
          <Link href={ROUTES.app.settings}>
            <Button variant="ghost" size="sm">
              Notification Preferences →
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedFilter(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all shadow-editorial-sm ${
              selectedFilter === tab.value
                ? 'bg-brand-ink text-white border-brand-ink'
                : 'bg-brand-paper text-brand-ink border-brand-ink hover:bg-brand-orange hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 text-center space-y-2">
            <Bell className="w-8 h-8 text-brand-ink/40 mx-auto" />
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              No Notifications Found
            </h3>
            <p className="text-xs text-brand-ink/70">
              You are completely caught up with your career action items.
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                !n.isRead ? 'border-brand-orange bg-brand-cream/40' : ''
              }`}
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={!n.isRead ? 'yellow' : 'default'}>
                    {n.type}
                  </Badge>
                  {n.priority === 'HIGH' && (
                    <Badge variant="rose">HIGH PRIORITY</Badge>
                  )}
                  <span className="text-[11px] font-mono text-brand-ink/60">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  )}
                </div>

                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  {n.title}
                </h3>

                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold uppercase"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    Mark Read
                  </Button>
                )}
                <Link href={n.actionUrl}>
                  <Button variant="primary" size="sm" className="text-xs font-bold uppercase">
                    {n.actionLabel} →
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
