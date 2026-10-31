import React from 'react';
import { AlertCircle, Shield, Award } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-950 via-aicte-navy to-slate-900 text-white text-xs px-4 py-2 border-b border-navy-800/80 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-amber-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          SIH 2026 PROTOTYPE
        </span>
        <span className="text-slate-300 font-normal">
          Demonstration Only; Not an Official AICTE System.
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-slate-300">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          PS ID: <strong className="text-white font-mono">26262</strong> (Smart Automation)
        </span>
        <span className="inline-flex items-center gap-1 bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded border border-teal-700/50">
          <Award className="w-3 h-3 text-teal-300" />
          Team: <span className="font-semibold text-white ml-0.5">Catalyst</span>
        </span>
      </div>
    </div>
  );
};
