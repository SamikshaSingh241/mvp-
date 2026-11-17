import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${glow ? 'shadow-glow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
