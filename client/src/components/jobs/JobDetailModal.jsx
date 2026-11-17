import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../common/Badge';
import { Button } from '../common/Button';

export const JobDetailModal = ({ job, isOpen, onClose, onApply, hasApplied = false, isApplying = false }) => {
  const [note, setNote] = useState('');

  if (!isOpen || !job) return null;

  const company = job.companyId || {};

  const handleApply = () => {
    onApply(job, note);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-navy-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl my-8 overflow-hidden"
        >
          {/* Header ambient gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Company & Role Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-blue-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{job.title}</h2>
                <VerificationBadge status={company.verificationStatus} />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                <span className="font-medium text-blue-400">{company.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location || 'Remote'}
                </span>
                {company.website && (
                  <>
                    <span>•</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 text-xs">
            <div>
              <p className="text-slate-400 mb-1">Role Type</p>
              <JobTypeBadge type={job.type} />
            </div>
            <div>
              <p className="text-slate-400 mb-1">Work Mode</p>
              <WorkModeBadge mode={job.workMode} />
            </div>
            <div>
              <p className="text-slate-400 mb-1">Compensation</p>
              <p className="font-semibold text-emerald-400 text-sm">{job.salary || 'Not Disclosed'}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Duration</p>
              <p className="font-semibold text-slate-200">{job.duration || 'Flexible'}</p>
            </div>
          </div>

          {/* Verification Trust Box */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-400">Verified Entity: </span>
              <span className="text-slate-300">
                {company.adminNote || 'Company legal entity and recruitment credentials have been thoroughly audited and approved by the Platform Moderation Board.'}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              About the Role
            </h4>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto pr-2">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Required Skills & Tech
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Note Input for Application */}
          {!hasApplied && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Add a quick note / intro to the recruiter (optional)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your GitHub project, portfolio link, or why you're interested..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              variant={hasApplied ? 'secondary' : 'primary'}
              disabled={hasApplied}
              isLoading={isApplying}
              onClick={handleApply}
              icon={hasApplied ? CheckCircle : Sparkles}
            >
              {hasApplied ? 'Application Submitted' : 'Submit 1-Click Application'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
