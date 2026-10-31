import React from 'react';
import { ComplianceItem } from '../../types';

interface ComplianceHealthDonutProps {
  complianceItems: ComplianceItem[];
  onFilterClick?: (filterKey: string) => void;
}

export const ComplianceHealthDonut: React.FC<ComplianceHealthDonutProps> = ({
  complianceItems,
  onFilterClick
}) => {
  const verifiedCount = complianceItems.filter(c => c.verificationStatus === 'Verified Compliant').length;
  const deficientCount = complianceItems.filter(c => c.verificationStatus === 'Non-Compliant / Deficient').length;
  const pendingCount = complianceItems.filter(c => c.verificationStatus === 'Pending Verification').length;
  const total = complianceItems.length;

  const verifiedPct = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;
  const deficientPct = total > 0 ? Math.round((deficientCount / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 0;

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // approx 238.76

  const verifiedOffset = circumference * (1 - verifiedPct / 100);
  const deficientOffset = circumference * (1 - deficientPct / 100);
  const pendingOffset = circumference * (1 - pendingPct / 100);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-2">
      {/* Visual Ring */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Verified slice */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-teal-500 transition-all duration-700 ease-out"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (verifiedPct / 100) * circumference}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-900">{verifiedPct}%</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Compliant</span>
        </div>
      </div>

      {/* Legend & quick filters */}
      <div className="flex-1 w-full space-y-2">
        <div 
          onClick={() => onFilterClick && onFilterClick('Verified Compliant')}
          className="flex items-center justify-between p-2 rounded-lg bg-teal-50/60 border border-teal-100 text-xs cursor-pointer hover:bg-teal-100/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="font-medium text-slate-700">Verified Compliant</span>
          </div>
          <span className="font-bold text-teal-800">{verifiedCount} items</span>
        </div>

        <div 
          onClick={() => onFilterClick && onFilterClick('Pending Verification')}
          className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs cursor-pointer hover:bg-blue-100/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-medium text-slate-700">Pending Review</span>
          </div>
          <span className="font-bold text-blue-800">{pendingCount} items</span>
        </div>

        <div 
          onClick={() => onFilterClick && onFilterClick('Non-Compliant / Deficient')}
          className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-100 text-xs cursor-pointer hover:bg-rose-100/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="font-medium text-slate-700">Deficient / Action Required</span>
          </div>
          <span className="font-bold text-rose-800">{deficientCount} items</span>
        </div>
      </div>
    </div>
  );
};
