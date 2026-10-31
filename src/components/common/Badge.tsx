import React from 'react';
import { ApplicationStatus, ApplicationStage, AlertSeverity } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'stage' | 'severity' | 'role' | 'outline' | 'custom';
  color?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'status', 
  color, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];

  let styleClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'status') {
    const status = children as ApplicationStatus;
    switch (status) {
      case 'Approved':
        styleClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
        break;
      case 'Rejected':
        styleClass = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
        break;
      case 'Pending Scrutiny':
        styleClass = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
        break;
      case 'Scrutiny in Progress':
        styleClass = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
        break;
      case 'Deficiencies Noted':
        styleClass = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
        break;
      case 'Awaiting Re-Scrutiny':
        styleClass = 'bg-purple-50 text-purple-700 border-purple-200 font-medium';
        break;
      case 'EVC Recommended':
        styleClass = 'bg-teal-50 text-teal-700 border-teal-200 font-medium';
        break;
      case 'EVC Scheduled':
        styleClass = 'bg-cyan-50 text-cyan-800 border-cyan-200 font-medium';
        break;
      case 'EVC Completed':
        styleClass = 'bg-sky-50 text-sky-800 border-sky-200 font-medium';
        break;
      case 'Pending Approval':
        styleClass = 'bg-orange-50 text-orange-800 border-orange-200 font-medium';
        break;
      default:
        styleClass = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (variant === 'stage') {
    const stage = children as ApplicationStage;
    switch (stage) {
      case 'Submitted':
        styleClass = 'bg-blue-100/70 text-blue-800 border-blue-200';
        break;
      case 'Scrutiny':
        styleClass = 'bg-indigo-100/70 text-indigo-800 border-indigo-200';
        break;
      case 'Re-Scrutiny':
        styleClass = 'bg-purple-100/70 text-purple-800 border-purple-200';
        break;
      case 'EVC':
        styleClass = 'bg-teal-100/70 text-teal-800 border-teal-200';
        break;
      case 'Final Decision':
        styleClass = 'bg-slate-200 text-slate-800 border-slate-300';
        break;
    }
  } else if (variant === 'severity') {
    const sev = children as AlertSeverity;
    switch (sev) {
      case 'CRITICAL':
        styleClass = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
        break;
      case 'HIGH':
        styleClass = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
        break;
      case 'MEDIUM':
        styleClass = 'bg-blue-100 text-blue-800 border-blue-300';
        break;
      case 'LOW':
        styleClass = 'bg-slate-100 text-slate-700 border-slate-300';
        break;
    }
  } else if (color) {
    styleClass = color;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${styleClass} ${className}`}>
      {children}
    </span>
  );
};
