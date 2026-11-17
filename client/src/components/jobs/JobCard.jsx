import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Building2, MapPin, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

export const JobCard = ({ job, onSelect, onApply, hasApplied = false }) => {
  const company = job.companyId || {};
  const isVerified = company.verificationStatus === 'valid';

  return (
    <GlassCard className="flex flex-col justify-between h-full border border-slate-800/80 hover:border-blue-500/40 group relative overflow-hidden transition-all duration-300">
      {/* Top ambient highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Company Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                  {company.name || 'Verified Partner'}
                </span>
                <VerificationBadge status={company.verificationStatus || 'valid'} />
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
                {company.location || 'San Francisco, CA'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <JobTypeBadge type={job.type} />
          </div>
        </div>

        {/* Job Title */}
        <h3
          onClick={() => onSelect(job)}
          className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer mb-2 line-clamp-1"
        >
          {job.title}
        </h3>

        {/* Snippet / Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-400 truncate">{job.salary || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <WorkModeBadge mode={job.workMode} />
          {job.skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] text-slate-400 bg-slate-800/40">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelect(job)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          View Details
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <Button
          variant={hasApplied ? 'secondary' : 'primary'}
          size="sm"
          disabled={hasApplied}
          onClick={() => onApply(job)}
        >
          {hasApplied ? 'Applied ✔' : 'Apply Now'}
        </Button>
      </div>
    </GlassCard>
  );
};
