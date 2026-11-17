import React from 'react';
import { ShieldCheck, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { VerificationBadge } from '../common/Badge';

export const CompanyStatusBanner = ({ company }) => {
  if (!company) return null;

  const status = company.verificationStatus || 'pending';

  if (status === 'valid') {
    return (
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{company.name}</span>
              <VerificationBadge status="valid" />
            </div>
            <p className="text-xs text-slate-300">
              Your company is fully verified. All published job listings are live on the public job board.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{company.name}</span>
            <VerificationBadge status="invalid" />
          </div>
          <p className="text-xs text-rose-300">
            Company verification was not approved. All jobs from this company are currently hidden from public discovery.
          </p>
          {company.adminNote && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/20 text-xs text-rose-200">
              <span className="font-semibold text-rose-300">Admin Feedback: </span>
              {company.adminNote}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pending status
  return (
    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <Clock className="w-5 h-5 animate-pulse" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-white text-sm">{company.name}</span>
          <VerificationBadge status="pending" />
        </div>
        <p className="text-xs text-amber-200 font-semibold">
          Special Notice: Jobs will only be visible after company verification.
        </p>
        <p className="text-xs text-slate-300 mt-0.5">
          Our administrative compliance team reviews company websites, corporate registrations, and business email domains within 24 hours. You can draft and publish jobs now, and they will automatically go live once approved!
        </p>
      </div>
    </div>
  );
};
