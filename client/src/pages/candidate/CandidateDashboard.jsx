import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { ProfileCompletionRing } from '../../components/candidate/ProfileCompletionRing';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../../components/common/Badge';
import { JobDetailModal } from '../../components/jobs/JobDetailModal';
import { Toast } from '../../components/common/Toast';
import {
  FileText,
  Clock,
  CheckCircle2,
  Briefcase,
  Compass,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await candidateService.getDashboard();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Accepted 🎉</span>;
      case 'shortlisted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Shortlisted ⚡</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Under Review ⏳</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Submitted</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading candidate dashboard...
      </div>
    );
  }

  const profile = data?.profile || {};
  const completeness = data?.completeness || 0;
  const applications = data?.applications || [];
  const recommendedJobs = data?.recommendedJobs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {profile.name || user?.email?.split('@')[0]}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Verified Candidate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {profile.headline || 'Complete your profile to unlock verified recruiter recommendations'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/candidate/profile">
            <Button variant="secondary" size="sm">
              Edit Profile
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="primary" size="sm" icon={Compass}>
              Browse Verified Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Completion Card */}
        <GlassCard className="p-6 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Profile Score</p>
            <p className="text-2xl font-extrabold text-white mt-1">{completeness}%</p>
            <Link
              to="/candidate/profile"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-2 inline-flex items-center gap-1"
            >
              Update Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ProfileCompletionRing score={completeness} size={84} strokeWidth={8} />
        </GlassCard>

        {/* Resume Status Card */}
        <GlassCard className="p-6 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Resume Status</p>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${profile.resumeUrl ? 'text-emerald-400' : 'text-amber-400'}`}>
                {profile.resumeUrl ? 'Verified & Stored' : 'Resume Missing'}
              </span>
            </div>
            {profile.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                Inspect PDF <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <Link to="/candidate/profile" className="text-xs text-amber-400 hover:underline pt-1 block font-medium">
                Upload PDF / DOCX (5MB) →
              </Link>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* Active Applications Count */}
        <GlassCard className="p-6 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Tracked Applications</p>
            <p className="text-2xl font-extrabold text-white">{applications.length}</p>
            <p className="text-xs text-slate-400">Direct to verified team leads</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Application Tracking Timeline & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Application Tracking Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Application Tracking Timeline
            </h2>
            <span className="text-xs text-slate-400">{applications.length} submitted</span>
          </div>

          {applications.length === 0 ? (
            <GlassCard className="p-8 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No applications submitted yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore verified opportunities from approved companies and submit with 1-click.
              </p>
              <Link to="/jobs">
                <Button variant="primary" size="sm">
                  Explore Opportunities
                </Button>
              </Link>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const job = app.jobId || {};
                const company = app.companyId || {};
                return (
                  <GlassCard
                    key={app._id}
                    className="p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{job.title || 'Opportunity'}</h4>
                        <VerificationBadge status="valid" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {company.name || 'Verified Company'} • {job.location || 'Remote'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{job.salary || 'Competitive'}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      {getStatusBadge(app.status)}
                      <span className="text-[10px] text-slate-400">Zero Ghosting Protocol</span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Recommended Jobs Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Recommended For You
            </h2>
            <Link to="/jobs" className="text-xs text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.length === 0 ? (
              <GlassCard className="p-6 border border-slate-800 text-center text-xs text-slate-400">
                No recommended jobs at this moment. Check back soon!
              </GlassCard>
            ) : (
              recommendedJobs.map((recJob) => (
                <GlassCard
                  key={recJob._id}
                  onClick={() => setSelectedJob(recJob)}
                  className="p-4 border border-slate-800 hover:border-blue-500/40 cursor-pointer space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">
                      {recJob.companyId?.name}
                    </span>
                    <JobTypeBadge type={recJob.type} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{recJob.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">{recJob.salary}</span>
                    <span>{recJob.location}</span>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Job Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={async (job) => {
            try {
              await candidateService.applyJob(job._id);
              setToast({ message: 'Application submitted successfully!', type: 'success' });
              setSelectedJob(null);
              fetchDashboard();
            } catch (err) {
              setToast({
                message: err.response?.data?.message || err.message || 'Application failed',
                type: 'error'
              });
            }
          }}
        />
      )}
    </div>
  );
};
