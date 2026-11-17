import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileCompletionRing = ({ score = 0, size = 110, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isComplete = score >= 70;
  const strokeColor = isComplete ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-white">{score}%</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {isComplete ? 'Complete' : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {isComplete ? (
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Ready to Apply
          </span>
        ) : (
          <span className="text-amber-400 flex items-center gap-1 font-medium">
            <AlertCircle className="w-4 h-4" /> Reach 70% to unlock priority matching
          </span>
        )}
      </div>
    </div>
  );
};
