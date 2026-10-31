import React from 'react';
import { Application, ApplicationStage } from '../../types';

interface StageDistributionChartProps {
  applications: Application[];
  onSelectStage?: (stage: ApplicationStage) => void;
  selectedStage?: ApplicationStage | null;
}

export const StageDistributionChart: React.FC<StageDistributionChartProps> = ({
  applications,
  onSelectStage,
  selectedStage
}) => {
  const stages: { stage: ApplicationStage; label: string; color: string; hoverBg: string }[] = [
    { stage: 'Submitted', label: '1. Submitted', color: 'bg-blue-500', hoverBg: 'hover:bg-blue-600' },
    { stage: 'Scrutiny', label: '2. Scrutiny', color: 'bg-indigo-500', hoverBg: 'hover:bg-indigo-600' },
    { stage: 'Re-Scrutiny', label: '3. Re-Scrutiny', color: 'bg-purple-500', hoverBg: 'hover:bg-purple-600' },
    { stage: 'EVC', label: '4. EVC Visit', color: 'bg-teal-500', hoverBg: 'hover:bg-teal-600' },
    { stage: 'Final Decision', label: '5. Decision', color: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-600' }
  ];

  const total = applications.length;

  return (
    <div className="space-y-4">
      {/* Visual horizontal stacked pipeline */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {stages.map(st => {
          const count = applications.filter(a => a.currentStage === st.stage).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          if (pct === 0) return null;

          return (
            <div
              key={st.stage}
              style={{ width: `${pct}%` }}
              title={`${st.label}: ${count} applications (${Math.round(pct)}%)`}
              className={`${st.color} h-full transition-all duration-300 relative group cursor-pointer`}
              onClick={() => onSelectStage && onSelectStage(st.stage)}
            />
          );
        })}
      </div>

      {/* Grid of interactive stage bars */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {stages.map(st => {
          const count = applications.filter(a => a.currentStage === st.stage).length;
          const isSelected = selectedStage === st.stage;

          return (
            <div
              key={st.stage}
              onClick={() => onSelectStage && onSelectStage(st.stage)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected 
                  ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500' 
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between sm:justify-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${st.color} shrink-0`} />
                <span className="text-xs font-semibold text-slate-700 truncate">{st.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
              <p className="text-[10px] text-slate-400">
                {total > 0 ? Math.round((count / total) * 100) : 0}% of active
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
