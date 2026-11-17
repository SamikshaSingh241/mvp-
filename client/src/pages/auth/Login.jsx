import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck, Building2, GraduationCap, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      // Redirect logic based on role & profile completeness
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (loggedUser.role === 'candidate') {
        if (loggedUser.profile && loggedUser.profile.profileComplete === false) {
          navigate('/candidate/profile');
        } else {
          navigate('/candidate/dashboard');
        }
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // trigger immediate login
    setIsLoading(true);
    login(demoEmail, demoPassword)
      .then((loggedUser) => {
        if (loggedUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (loggedUser.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Login failed');
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 mx-auto shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="text-xs text-slate-400">Sign in to your verified account</p>
        </div>

        <GlassCard className="border border-slate-800 p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu or name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              ⚡ 1-Click Instant Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@truehire.io', 'admin@123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin (admin@123)
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('recruiter@linear.app', 'recruiter@123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-blue-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                Recruiter Valid
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('founder@thebrowser.company', 'recruiter@123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                Recruiter Pending
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alex.dev@stanford.edu', 'candidate@123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Candidate
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Register Links */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>
            New candidate?{' '}
            <Link to="/register/candidate" className="text-blue-400 hover:underline font-semibold">
              Create Candidate Account
            </Link>
          </p>
          <p>
            Hiring talent?{' '}
            <Link to="/register/recruiter" className="text-indigo-400 hover:underline font-semibold">
              Register as Recruiter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
