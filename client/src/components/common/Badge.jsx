import React from 'react';
import { CheckCircle2, Clock, XCircle, Globe, Briefcase, GraduationCap } from 'lucide-react';

export const VerificationBadge = ({ status, size = 'sm' }) => {
  const normalized = (status || 'pending').toLowerCase();

  if (normalized === 'valid' || normalized === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Verified
      </span>
    );
  }

  if (normalized === 'invalid' || normalized === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/10">
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/10">
      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      Pending Review
    </span>
  );
};

export const WorkModeBadge = ({ mode }) => {
  const normalized = (mode || 'remote').toLowerCase();
  if (normalized === 'remote') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <Globe className="w-3 h-3 text-blue-400" />
        Remote 🌎
      </span>
    );
  }

  if (normalized === 'hybrid') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
        Hybrid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
      Onsite
    </span>
  );
};

export const JobTypeBadge = ({ type }) => {
  const isIntern = (type || '').toLowerCase() === 'internship';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isIntern
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
      }`}
    >
      {isIntern ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
      {isIntern ? 'Internship' : 'Full Time'}
    </span>
  );
};
