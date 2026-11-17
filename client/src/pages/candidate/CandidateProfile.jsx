import React, { useState, useEffect } from 'react';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { SkillsInput } from '../../components/candidate/SkillsInput';
import { ResumeUploadCard } from '../../components/candidate/ResumeUploadCard';
import { ProfileCompletionRing } from '../../components/candidate/ProfileCompletionRing';
import {
  User,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  Compass,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CandidateProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [education, setEducation] = useState([{ college: '', degree: '', gradYear: '' }]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([{ title: '', company: '', duration: '', description: '' }]);
  const [preferences, setPreferences] = useState({ preferredRole: '', location: '' });
  const [links, setLinks] = useState({ linkedin: '', github: '', portfolio: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeOriginalName, setResumeOriginalName] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await candidateService.getProfile();
      if (res && res.data) {
        const p = res.data.profile;
        setProfile(p);
        setCompleteness(res.data.completeness || 0);

        setName(p.name || '');
        setHeadline(p.headline || '');
        setEducation(p.education?.length ? p.education : [{ college: '', degree: '', gradYear: '' }]);
        setSkills(p.skills || []);
        setExperience(p.experience?.length ? p.experience : [{ title: '', company: '', duration: '', description: '' }]);
        setPreferences(p.preferences || { preferredRole: '', location: '' });
        setLinks(p.links || { linkedin: '', github: '', portfolio: '' });
        setResumeUrl(p.resumeUrl || '');
        setResumeOriginalName(p.resumeOriginalName || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setToast({ message: 'Failed to load candidate profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        headline,
        education: education.filter((e) => e.college || e.degree),
        skills,
        experience: experience.filter((e) => e.title || e.company),
        preferences,
        links
      };

      const res = await candidateService.updateProfile(payload);
      if (res?.data) {
        setProfile(res.data.profile);
        setCompleteness(res.data.completeness);
        await refreshUser();
        setToast({ message: 'Candidate profile saved successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Error saving profile',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file) => {
    const res = await candidateService.uploadResume(file);
    if (res?.data) {
      setResumeUrl(res.data.resumeUrl);
      setResumeOriginalName(file.name);
      setCompleteness(res.data.completeness);
      await refreshUser();
      setToast({ message: 'Resume uploaded and linked to profile!', type: 'success' });
    }
  };

  const addEducation = () => {
    setEducation([...education, { college: '', degree: '', gradYear: '' }]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, idx) => idx !== index));
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading candidate profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Candidate Profile</h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete your profile to unlock verified recruiter recommendations & 1-click apply.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. Personal Section */}
            <GlassCard className="p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. CS Junior @ Stanford | Full-Stack & Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>
            </GlassCard>

            {/* 2. Education Section */}
            <GlassCard className="p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Education</h3>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add School
                </button>
              </div>

              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 relative"
                >
                  {education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        value={edu.college}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx].college = e.target.value;
                          setEducation(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2025"
                        value={edu.gradYear}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx].gradYear = e.target.value;
                          setEducation(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Degree / Major
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.S. in Computer Science"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].degree = e.target.value;
                        setEducation(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* 3. Skills Section */}
            <GlassCard className="p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Technical Skills</h3>
              </div>
              <SkillsInput skills={skills} onChange={setSkills} />
            </GlassCard>

            {/* 4. Experience Section */}
            <GlassCard className="p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Experience & Projects</h3>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 relative"
                >
                  {experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        placeholder="Software Engineering Intern"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].title = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Company / Project Name
                      </label>
                      <input
                        type="text"
                        placeholder="HyperScale Cloud"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].company = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="Summer 2024"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].duration = e.target.value;
                          setExperience(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Key Highlights & Impact
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Built real-time telemetry dashboards in React & Node.js..."
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].description = e.target.value;
                        setExperience(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* 5. Preferences & Links */}
            <GlassCard className="p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Preferences & Links</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Intern or Full Stack"
                    value={preferences.preferredRole}
                    onChange={(e) =>
                      setPreferences({ ...preferences, preferredRole: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote or San Francisco"
                    value={preferences.location}
                    onChange={(e) =>
                      setPreferences({ ...preferences, location: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={links.linkedin}
                    onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={links.github}
                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://portfolio.dev"
                    value={links.portfolio}
                    onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>
            </GlassCard>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={saving}>
              Save Profile Updates
            </Button>
          </form>
        </div>

        {/* Right Column: Profile Ring & Resume Upload */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Progress Ring Card */}
          <GlassCard className="p-6 border border-slate-800 text-center">
            <h3 className="text-sm font-bold text-white mb-4">Profile Completeness</h3>
            <ProfileCompletionRing score={completeness} />
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              Completing your education, skills, and uploading a resume gets you verified by recruiters.
            </p>
          </GlassCard>

          {/* Resume Upload Card */}
          <GlassCard className="p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Verified Resume
            </h3>
            <ResumeUploadCard
              currentResumeUrl={resumeUrl}
              resumeOriginalName={resumeOriginalName}
              onUploadSuccess={handleResumeUpload}
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
