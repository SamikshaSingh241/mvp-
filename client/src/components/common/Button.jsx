import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variants = {
    // Gradient primary button
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 focus:ring-blue-500 border border-blue-400/30',
    // Ghost secondary button
    ghost:
      'bg-transparent hover:bg-slate-800/60 dark:hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent hover:border-slate-700 focus:ring-slate-500',
    // Glass card outline
    secondary:
      'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:border-slate-600 focus:ring-slate-500 shadow-sm backdrop-blur-md',
    // Danger / rejection
    danger:
      'bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:shadow-rose-600/35 border border-rose-500/30 focus:ring-rose-500',
    // Success / verification
    success:
      'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 border border-emerald-500/30 focus:ring-emerald-500'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
