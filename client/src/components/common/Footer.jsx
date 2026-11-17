import React from 'react';
import { Sparkles, ShieldCheck, Lock, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-navy-950 text-slate-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-lg text-white font-sans">
                True<span className="text-blue-500">Hire</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              "Verified opportunities. Real careers." The trust-first recruitment platform where every company is human-reviewed before public job distribution.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                100% Admin Moderated
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                <Lock className="w-4 h-4" />
                Zero Spam Guarantee
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">
                  Verified Job Board
                </Link>
              </li>
              <li>
                <Link to="/register/candidate" className="hover:text-blue-400 transition-colors">
                  Candidate Registration
                </Link>
              </li>
              <li>
                <Link to="/register/recruiter" className="hover:text-blue-400 transition-colors">
                  Recruiter Verification
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Platform Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Principles */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-slate-200 tracking-wider mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Company Verification Protocol
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Privacy-Preserving Resumes
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Direct Recruiter Inboxes
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Scam & Ghosting Shield
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TrueHire Technologies Inc. Built with MERN Stack.</p>
          <p className="flex items-center gap-1">
            Engineered for elite students and modern teams
          </p>
        </div>
      </div>
    </footer>
  );
};
