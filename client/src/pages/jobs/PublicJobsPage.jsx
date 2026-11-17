import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { JobCard } from '../../components/jobs/JobCard';
import { JobDetailModal } from '../../components/jobs/JobDetailModal';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';
import {
  Search,
  MapPin,
  Filter,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const PublicJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [isApplying, setIsApplying] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');
  const [workMode, setWorkMode] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getPublicJobs({
        search,
        location,
        type,
        workMode,
        skills: selectedSkill
      });
      if (res && res.data) {
        setJobs(res.data.jobs || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setToast({ message: 'Failed to load verified jobs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate applied jobs if logged in
  useEffect(() => {
    if (isAuthenticated && role === 'candidate') {
      candidateService
        .getApplications()
        .then((res) => {
          if (res?.data) {
            const ids = res.data.map((app) => app.jobId?._id || app.jobId);
            setAppliedJobIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    fetchJobs();
  }, [type, workMode, selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyClick = async (job, note = '') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role !== 'candidate') {
      setToast({
        message: 'Only candidates can apply to positions. Switch or create a candidate account.',
        type: 'warning'
      });
      return;
    }

    setIsApplying(true);
    try {
      await candidateService.applyJob(job._id, note);
      setAppliedJobIds((prev) => [...prev, job._id]);
      setToast({
        message: `Application submitted successfully to ${job.companyId?.name || 'company'}!`,
        type: 'success'
      });
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Application failed',
        type: 'error'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setLocation('');
    setType('all');
    setWorkMode('all');
    setSelectedSkill('');
    setTimeout(fetchJobs, 50);
  };

  const POPULAR_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Figma', 'Next.js'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Verified Employers
          </span>
          <span className="text-xs text-slate-400">
            Unverified companies and flagged listings are automatically filtered out.
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Verified Opportunities
        </h1>
        <p className="text-sm text-slate-400">
          Showing <span className="font-bold text-white">{total}</span> approved internships and full-time positions from vetted organizations.
        </p>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 border border-slate-800 space-y-4">
        {/* Search bar row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, keyword, or company..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative sm:w-64">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. San Francisco, Remote)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Search
          </Button>

          {(search || location || type !== 'all' || workMode !== 'all' || selectedSkill) && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={clearAllFilters}
              icon={X}
            >
              Reset
            </Button>
          )}
        </form>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          {/* Type toggles */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold mr-1">Role:</span>
            {['all', 'internship', 'job'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                  type === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t === 'all' ? 'All Roles' : t === 'internship' ? 'Internships' : 'Full Time'}
              </button>
            ))}
          </div>

          {/* Work Mode toggles */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold mr-1">Work Mode:</span>
            {['all', 'remote', 'hybrid', 'onsite'].map((m) => (
              <button
                key={m}
                onClick={() => setWorkMode(m)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                  workMode === m
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m === 'all' ? 'Any Mode' : m === 'remote' ? 'Remote 🌎' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Skills row */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
          <span className="text-slate-400 font-semibold">Popular Skills:</span>
          {POPULAR_SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              className={`px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                  : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Job Grid or Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-10 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No verified positions match your filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, location, or skills filter. Remember that listings only appear when their company is verified by our admin team.
          </p>
          <Button variant="secondary" size="sm" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              hasApplied={appliedJobIds.includes(job._id)}
              onSelect={(selected) => {
                setSelectedJob(selected);
                setIsModalOpen(true);
              }}
              onApply={(selected) => {
                setSelectedJob(selected);
                handleApplyClick(selected);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          hasApplied={appliedJobIds.includes(selectedJob._id)}
          isApplying={isApplying}
          onApply={handleApplyClick}
        />
      )}
    </div>
  );
};
