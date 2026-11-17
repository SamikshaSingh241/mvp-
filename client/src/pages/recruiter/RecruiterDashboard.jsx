import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterService } from '../../services/recruiterService';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { CompanyStatusBanner } from '../../components/recruiter/CompanyStatusBanner';
import { JobStatsCards } from '../../components/recruiter/JobStatsCards';
import { CreateJobModal } from '../../components/recruiter/CreateJobModal';
import { Toast } from '../../components/common/Toast';
import { VerificationBadge, WorkModeBadge, JobTypeBadge } from '../../components/common/Badge';
import {
  Building2,
  Plus,
  Briefcase,
  Users,
  Eye,
  Edit,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileText
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await recruiterService.getDashboard();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreatedOrUpdated = async (jobData) => {
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, jobData);
        setToast({ message: 'Opportunity listing updated!', type: 'success' });
      } else {
        await jobService.createJob(jobData);
        setToast({ message: 'New opportunity created successfully!', type: 'success' });
      }
      setIsCreateModalOpen(false);
      setEditingJob(null);
      fetchDashboard();
    } catch (err) {
      throw err;
    }
  };

  const toggleJobStatus = async (job, newStatus) => {
    try {
      await jobService.updateJob(job._id, { status: newStatus });
      setToast({ message: `Job status changed to ${newStatus}`, type: 'success' });
      fetchDashboard();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading employer workspace...
      </div>
    );
  }

  const company = data?.company || {};
  const stats = data?.stats || {};
  const jobs = data?.jobs || [];
  const recentApplications = data?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Special Notice & Verification Banner */}
      <CompanyStatusBanner company={company} />

      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {company.name || 'Recruiter Workspace'}
            </h1>
            <VerificationBadge status={company.verificationStatus} />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your open roles, interview pipeline, and enterprise verification credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/recruiter/company">
            <Button variant="secondary" size="sm" icon={Building2}>
              Company Profile
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingJob(null);
              setIsCreateModalOpen(true);
            }}
          >
            Post Job / Internship
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <JobStatsCards stats={stats} />

      {/* Main Section: My Jobs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            My Positions ({jobs.length})
          </h2>
          <span className="text-xs text-slate-400">
            {company.verificationStatus === 'valid'
              ? '✅ Visible on public job board'
              : '⏳ Hidden until company verification approved'}
          </span>
        </div>

        <GlassCard className="p-0 overflow-hidden border border-slate-800">
          {jobs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No job openings created yet</h3>
              <p className="text-xs text-slate-400">Create your first role to start receiving student applications.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingJob(null);
                  setIsCreateModalOpen(true);
                }}
              >
                Create Job
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title & Category</th>
                    <th className="py-3 px-4">Work Mode</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Visibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{job.title}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <JobTypeBadge type={job.type} />
                          <span className="text-slate-500">•</span>
                          <span className="text-[11px] text-slate-400">{job.duration}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <WorkModeBadge mode={job.workMode} />
                        <div className="text-[11px] text-slate-500 mt-0.5">{job.location}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-400">
                        {job.salary || 'Not Disclosed'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            job.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : job.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {company.verificationStatus === 'valid' && job.status === 'published' ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Public Live
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">
                            {company.verificationStatus === 'pending'
                              ? 'Pending Company Approval'
                              : company.verificationStatus === 'invalid'
                              ? 'Hidden (Company Rejected)'
                              : 'Private Draft'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setIsCreateModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {job.status === 'published' ? (
                            <button
                              onClick={() => toggleJobStatus(job, 'draft')}
                              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/20 cursor-pointer"
                            >
                              Make Draft
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleJobStatus(job, 'published')}
                              className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-semibold border border-blue-500/30 cursor-pointer"
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Candidate Pipeline Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Recent Candidate Submissions ({recentApplications.length})
        </h2>

        {recentApplications.length === 0 ? (
          <GlassCard className="p-8 border border-slate-800 text-center text-xs text-slate-400">
            No candidate applications received yet. Once your jobs are verified and public, applications will flow directly into this inbox.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentApplications.map((app) => (
              <GlassCard key={app._id} className="p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {app.candidateId?.email}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Applied for: <span className="text-slate-200">{app.jobId?.title}</span>
                </p>
                {app.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                    "{app.notes}"
                  </p>
                )}
                <p className="text-[10px] text-slate-500">
                  Submitted {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <CreateJobModal
          isOpen={isCreateModalOpen}
          initialData={editingJob}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingJob(null);
          }}
          onJobCreated={handleJobCreatedOrUpdated}
        />
      )}
    </div>
  );
};
