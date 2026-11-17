import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Compass,
  FileCheck,
  Zap,
  Eye,
  Award,
  DollarSign,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { VerificationBadge, WorkModeBadge } from '../components/common/Badge';

export const LandingPage = () => {
  const floatingCards = [
    {
      title: 'Frontend Intern',
      company: 'Linear Labs',
      badge: 'Verified',
      salary: '$3,800/mo',
      location: 'Remote',
      mode: 'remote',
      skills: ['React', 'TypeScript', 'Tailwind']
    },
    {
      title: 'Software Engineer',
      company: 'Vercel Cloud',
      badge: 'Verified',
      salary: '$140k - $175k',
      location: 'San Francisco, CA',
      mode: 'remote',
      skills: ['Next.js', 'Node.js', 'Go']
    },
    {
      title: 'AI Engineer',
      company: 'Anthropic Ecosystem',
      badge: 'Verified',
      salary: '$150k - $190k',
      location: 'Remote (US)',
      mode: 'remote',
      skills: ['Python', 'PyTorch', 'LLMs']
    },
    {
      title: 'Product Designer',
      company: 'Stripe Studios',
      badge: 'Verified',
      salary: '$4,200/mo',
      location: 'New York, NY',
      mode: 'hybrid',
      skills: ['Figma', 'Design Systems', 'UX']
    }
  ];

  const features = [
    {
      title: 'Verified Employer Network',
      description:
        'Every company profile is manually scrutinized by our trust team. We verify corporate identity, business domains, and legit recruitment contacts.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'One-Click Profile Creation',
      description:
        'Build a professional developer profile in seconds. Add your GitHub, Stanford/MIT education, skill tags, and experience without friction.',
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Fast Job Applications',
      description:
        'No 15-page repetitive workday forms. Apply directly with your verified profile with a single tap and personalized note.',
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Transparent Hiring Status',
      description:
        'Real-time application stages. Know exactly whether your resume is under review, shortlisted, or accepted. Zero ghosting.',
      icon: Eye,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Privacy Focused Resume Storage',
      description:
        'Your resume and personal details are encrypted and disclosed exclusively to verified recruiters whose listings you explicitly applied to.',
      icon: Lock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Admin Moderation & Trust Layer',
      description:
        'Automated quarantine protects candidates. If an unverified company posts an opportunity, it remains completely invisible until human approval.',
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="ambient-glow w-[500px] h-[500px] bg-blue-600 top-[-100px] left-1/2 -translate-x-1/2" />
      <div className="ambient-glow w-[400px] h-[400px] bg-purple-600 top-[20%] right-[-100px]" />
      <div className="ambient-glow w-[350px] h-[350px] bg-cyan-500 top-[40%] left-[-100px]" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Live Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trust-First Early Career Marketplace</span>
            </div>

            {/* Large Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Discover Opportunities From{' '}
              <span className="gradient-text-brand">Verified Companies</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Apply to internships and jobs from trusted employers. No scams, no fake listings, only verified opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow">
                  Explore Jobs
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <Link to="/register/recruiter" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Recruit Talent
                  <Building2 className="w-4 h-4 ml-1 text-slate-400" />
                </Button>
              </Link>
            </div>

            {/* Micro stats counter */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div>
                <span className="font-extrabold text-white text-base block">100%</span>
                Verified Companies
              </div>
              <div>
                <span className="font-extrabold text-emerald-400 text-base block">0</span>
                Scams or Ghost Listings
              </div>
              <div>
                <span className="font-extrabold text-blue-400 text-base block">&lt; 24h</span>
                Moderation Turnaround
              </div>
            </div>
          </motion.div>

          {/* Right Floating Job Cards Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-2xl p-4 border border-slate-700/80 hover:border-blue-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {card.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{card.company}</h4>
                        <p className="text-[10px] text-slate-400">{card.location}</p>
                      </div>
                    </div>
                    <VerificationBadge status="valid" />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-slate-100">{card.title}</p>
                    <span className="text-xs font-semibold text-emerald-400">{card.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    <WorkModeBadge mode={card.mode} />
                    {card.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-slate-800/80 bg-navy-900/60 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Verified Companies
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              Admin Reviewed
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-200">
              <Lock className="w-5 h-5 text-indigo-400" />
              Secure Applications
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-200">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Student Friendly
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Enterprise Architecture & Trust
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered to Solve Job Board Fraud
          </h3>
          <p className="text-sm text-slate-400">
            Traditional job boards prioritize ad clicks over authenticity. Our platform is architected with a mandatory cryptographic and administrative verification firewall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={i}
                className="p-6 border border-slate-800 hover:border-slate-700 space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.bg}`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-navy-950 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to launch your career with verified teams?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Join students and top graduates who apply only to approved, verified positions without ghosting.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/register/candidate">
              <Button variant="primary" size="lg">
                Create Candidate Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
