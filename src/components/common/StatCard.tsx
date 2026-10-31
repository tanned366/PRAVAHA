import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
  trend?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-slate-100 text-slate-700',
  accentColor = 'text-teal-600 bg-teal-50',
  trend,
  onClick,
  isActive = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`portal-card p-5 relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-teal-400 hover:shadow-md active:scale-[0.99]' : ''
      } ${isActive ? 'ring-2 ring-teal-500 border-teal-500 shadow-md bg-teal-50/20' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
              <span>↑</span> {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {onClick && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-medium group">
          <span>View filtered records</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      )}
    </div>
  );
};
