import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Briefcase, CheckCircle, FileEdit, Users } from 'lucide-react';

export const JobStatsCards = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Listings',
      value: stats.totalJobs ?? 0,
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Active / Published',
      value: stats.activeJobs ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Draft Positions',
      value: stats.draftJobs ?? 0,
      icon: FileEdit,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications ?? 0,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <GlassCard key={i} className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">{card.title}</p>
              <p className="text-2xl font-extrabold text-white">{card.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.bg}`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
