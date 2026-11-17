import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'Tailwind CSS',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'Next.js',
  'GraphQL',
  'AWS',
  'Figma'
];

export const SkillsInput = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type skill & press Enter (e.g. React, Python, Go)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => addSkill(inputValue)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 min-h-[38px] p-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
        {skills.length === 0 ? (
          <span className="text-xs text-slate-500 italic p-1">No skills added yet.</span>
        ) : (
          skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Quick suggestions */}
      <div>
        <p className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quick add popular skills:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addSkill(suggestion)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
