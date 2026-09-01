import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'info' | 'neutral';
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  badgeText,
  badgeVariant = 'neutral',
  accentColor = 'text-indigo-400',
}) => {
  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'info':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {badgeText && (
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getBadgeClasses()}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${accentColor}`}>
        {value}
      </div>

      {subtext && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
