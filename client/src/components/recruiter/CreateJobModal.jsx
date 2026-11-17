import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { SkillsInput } from '../candidate/SkillsInput';

export const CreateJobModal = ({ isOpen, onClose, onJobCreated, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    skills: [],
    salary: '',
    duration: '',
    workMode: 'remote',
    location: '',
    deadline: '',
    status: 'published'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        type: initialData.type || 'internship',
        description: initialData.description || '',
        skills: initialData.skills || [],
        salary: initialData.salary || '',
        duration: initialData.duration || '',
        workMode: initialData.workMode || 'remote',
        location: initialData.location || '',
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
        status: initialData.status || 'published'
      });
    } else {
      setFormData({
        title: '',
        type: 'internship',
        description: '',
        skills: ['React', 'TypeScript'],
        salary: '$3,500 / month',
        duration: '3 Months (Summer)',
        workMode: 'remote',
        location: 'Remote',
        deadline: '',
        status: 'published'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations required by prompt
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.duration.trim()) {
      setError('Duration is required');
      return;
    }
    if (!formData.salary.trim()) {
      setError('Salary / Stipend is required (or specify "Not Disclosed")');
      return;
    }

    setIsLoading(true);
    try {
      await onJobCreated(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-navy-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white">
                {initialData ? 'Edit Opportunity Listing' : 'Post New Opportunity'}
              </h3>
              <p className="text-xs text-slate-400">
                Jobs become publicly discoverable once your company status is verified.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto py-4 flex-1 pr-1">
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job / Internship Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineering Intern"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                >
                  <option value="internship">Internship</option>
                  <option value="job">Full-time Job</option>
                </select>
              </div>
            </div>

            {/* Work Mode & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Mode *
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                >
                  <option value="remote">Remote 🌎</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location (City / State / Remote)
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                />
              </div>
            </div>

            {/* Salary & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Salary / Stipend *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $4,000 / month or $120k / yr"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Months, 6 Months, or Full-time"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Required Skills
              </label>
              <SkillsInput
                skills={formData.skills}
                onChange={(skills) => setFormData({ ...formData, skills })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Description & Qualifications *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe role responsibilities, what the candidate will learn, and expectations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-semibold text-slate-300">Listing Status:</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={() => setFormData({ ...formData, status: 'published' })}
                  />
                  Published (Live when verified)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={() => setFormData({ ...formData, status: 'draft' })}
                  />
                  Draft (Private)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {initialData ? 'Save Changes' : 'Create Opportunity'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
