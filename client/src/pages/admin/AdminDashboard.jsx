import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { VerificationBadge } from '../../components/common/Badge';
import { CompanyReviewModal } from '../../components/admin/CompanyReviewModal';
import { Toast } from '../../components/common/Toast';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  ExternalLink,
  Search,
  Filter,
  Eye,
  FileText,
  Briefcase
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'valid' | 'invalid'
  const [companies, setCompanies] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesRes, metricsRes] = await Promise.all([
        adminService.getCompanies(activeTab),
        adminService.getDashboard()
      ]);

      if (companiesRes && companiesRes.data) {
        setCompanies(companiesRes.data);
      }
      if (metricsRes && metricsRes.data) {
        setDashboardMetrics(metricsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setToast({ message: 'Error loading admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = async (companyId, payload) => {
    try {
      await adminService.verifyCompany(companyId, payload);
      setToast({
        message: `Company successfully marked as '${payload.status}'!`,
        type: payload.status === 'valid' ? 'success' : 'warning'
      });
      setSelectedCompany(null);
      fetchData();
    } catch (err) {
      throw err;
    }
  };

  const stats = dashboardMetrics?.stats || {};
  const auditLogs = dashboardMetrics?.auditLogs || [];

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ownerUserId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trust & Safety Moderation Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review company registrations, legal legitimacy, and control public job board visibility.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Queue */}
        <GlassCard
          onClick={() => setActiveTab('pending')}
          className={`p-5 cursor-pointer border transition-all ${
            activeTab === 'pending'
              ? 'border-amber-500/50 bg-amber-500/5 shadow-glow'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Pending Queue
            </p>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">
            {stats.pendingCount ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting verification</p>
        </GlassCard>

        {/* Valid / Verified */}
        <GlassCard
          onClick={() => setActiveTab('valid')}
          className={`p-5 cursor-pointer border transition-all ${
            activeTab === 'valid'
              ? 'border-emerald-500/50 bg-emerald-500/5 shadow-glow-green'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Valid Companies
            </p>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">
            {stats.validCount ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Live on public job board</p>
        </GlassCard>

        {/* Invalid / Rejected */}
        <GlassCard
          onClick={() => setActiveTab('invalid')}
          className={`p-5 cursor-pointer border transition-all ${
            activeTab === 'invalid'
              ? 'border-rose-500/50 bg-rose-500/5'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Invalid / Blocked
            </p>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">
            {stats.invalidCount ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Automatically quarantined</p>
        </GlassCard>

        {/* Total Jobs Moderated */}
        <GlassCard className="p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Total Openings
            </p>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats.totalJobs ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Platform listings</p>
        </GlassCard>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Modern Status Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Review ({stats.pendingCount ?? 0})
          </button>

          <button
            onClick={() => setActiveTab('valid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'valid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid ({stats.validCount ?? 0})
          </button>

          <button
            onClick={() => setActiveTab('invalid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'invalid'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Invalid ({stats.invalidCount ?? 0})
          </button>
        </div>

        {/* Filter Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Companies Moderation Table */}
      <GlassCard className="p-0 overflow-hidden border border-slate-800">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading moderation queue...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No companies found in this section</p>
            <p className="text-xs text-slate-400">All caught up with queue reviews!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Company Entity</th>
                  <th className="py-3 px-4">Recruiter Email</th>
                  <th className="py-3 px-4">Industry / HQ</th>
                  <th className="py-3 px-4">Jobs Waiting</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCompanies.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          {c.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">No website provided</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      {c.ownerUserId?.email || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>{c.industry || 'Tech'}</div>
                      <div className="text-[11px] text-slate-500">{c.location || 'Remote'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">{c.jobsCount || 0}</span> positions
                      {c.verificationStatus !== 'valid' && (
                        <span className="block text-[10px] text-amber-400 font-medium">
                          (Hidden from public)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <VerificationBadge status={c.verificationStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedCompany(c)}
                        icon={Eye}
                      >
                        Audit & Decide
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Audit Timeline Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Recent Trust Verification Audit Logs
        </h3>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 text-center">
              No review decisions recorded yet.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log._id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.verificationStatus === 'valid' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white mr-2">{log.name}</span>
                    <span className="text-slate-400">
                      audited by <span className="text-slate-200">{log.reviewedBy?.email || 'Admin'}</span>
                    </span>
                    {log.adminNote && (
                      <span className="block text-[11px] text-slate-400 italic mt-0.5">
                        Note: "{log.adminNote}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <VerificationBadge status={log.verificationStatus} />
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.reviewedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Company Review Modal */}
      {selectedCompany && (
        <CompanyReviewModal
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
};
