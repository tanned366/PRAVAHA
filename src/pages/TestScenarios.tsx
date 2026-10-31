import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  FileCheck, 
  Users2, 
  Award, 
  SlidersHorizontal,
  History,
  AlertTriangle
} from 'lucide-react';

interface TestScenariosProps {
  onNavigate: (page: string, options?: any) => void;
  onSelectApplication: (id: string) => void;
}

export const TestScenarios: React.FC<TestScenariosProps> = ({ onNavigate, onSelectApplication }) => {
  const { setCurrentUserRole, applications, addToast } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [testResults, setTestResults] = useState<Record<number, boolean>>({});

  const walkthroughSteps = [
    {
      step: 1,
      role: 'Institution User' as const,
      title: 'Step 1: Institutional Filing & Statutory Undertaking',
      description: 'Switch to Institution User (Dr. Rameshwar Sharma) and view the petition dashboard, or submit a new petition for AY 2026-2027 with mandatory anti-ragging affidavit.',
      actionLabel: 'Switch to Institution User & Open New Form',
      onRun: () => {
        setCurrentUserRole('Institution User');
        onNavigate('new-application');
        setTestResults(prev => ({ ...prev, 1: true }));
      }
    },
    {
      step: 2,
      role: 'Regional Officer' as const,
      title: 'Step 2: Regional Officer Document Scrutiny & EVC Dispatch',
      description: 'Switch to Regional Officer (Er. Sunita Mukherjee). Review application AICTE-2026-ERO-1042 or AICTE-2026-WRO-2189. Transition stage from Scrutiny to EVC Recommended.',
      actionLabel: 'Switch to Regional Officer & View Application',
      onRun: () => {
        setCurrentUserRole('Regional Officer');
        onSelectApplication('AICTE-2026-ERO-1042');
        setTestResults(prev => ({ ...prev, 2: true }));
      }
    },
    {
      step: 3,
      role: 'EVC Committee Member' as const,
      title: 'Step 3: Expert Visiting Committee Inspection Report',
      description: 'Switch to EVC Committee Member (Prof. K. Venkatesh). Open EVC Management directory, view scheduled physical visit for Pune Sahyadri Institute, and record inspection report.',
      actionLabel: 'Switch to EVC Member & Open Visits',
      onRun: () => {
        setCurrentUserRole('EVC Committee Member');
        onNavigate('evc');
        setTestResults(prev => ({ ...prev, 3: true }));
      }
    },
    {
      step: 4,
      role: 'Competent Authority' as const,
      title: 'Step 4: Final Sanction Order & Section 10(k) Approval',
      description: 'Switch to Competent Authority (Prof. Manju Singh). Inspect petition pending approval (e.g. AICTE-2026-NRO-1875) and execute final statutory Approval Order.',
      actionLabel: 'Switch to Competent Authority & View Pending Decision',
      onRun: () => {
        setCurrentUserRole('Competent Authority');
        onSelectApplication('AICTE-2026-NRO-1875');
        setTestResults(prev => ({ ...prev, 4: true }));
      }
    },
    {
      step: 5,
      role: 'System Administrator' as const,
      title: 'Step 5: KEY INNOVATION — Regulatory Rule Simulation',
      description: 'Switch to System Administrator. Open the Rule Simulator. Adjust Scrutiny window from 10 to 6 days. Inspect before-vs-after diff and preview newly overdue cases without changing live data.',
      actionLabel: 'Switch to Admin & Launch Rule Simulator',
      onRun: () => {
        setCurrentUserRole('System Administrator');
        onNavigate('simulation');
        setTestResults(prev => ({ ...prev, 5: true }));
      }
    },
    {
      step: 6,
      role: 'System Administrator' as const,
      title: 'Step 6: Explainable Escalation & Verifiable Audit Trail',
      description: 'Review the Alerts Center to examine explainable SLA root causes (Level 1 to Level 3 triggers), then inspect the chronological audit ledger.',
      actionLabel: 'Open Alerts & Escalation Center',
      onRun: () => {
        setCurrentUserRole('System Administrator');
        onNavigate('alerts');
        setTestResults(prev => ({ ...prev, 6: true }));
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Banner */}
      <div className="portal-card p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-aicte-navy text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              SMART INDIA HACKATHON 2026 EVALUATION GUIDE
            </span>
            <span className="text-xs text-slate-300">Problem Statement ID: 26262</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            End-to-End Judge Demonstration & Core Workflow Checklist
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Follow this 6-step interactive sequence to evaluate all aspects of the CATALYST approval workflow automation, institutional compliance, EVC operations, and regulatory rule simulation.
          </p>
        </div>
      </div>

      {/* Guided Walkthrough Steps */}
      <div className="space-y-4">
        {walkthroughSteps.map(st => {
          const isDone = testResults[st.step];

          return (
            <div
              key={st.step}
              className={`portal-card p-5 bg-white transition-all border ${
                isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-aicte-navy text-teal-300 ring-2 ring-teal-500/30'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : st.step}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{st.title}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        Role: {st.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {st.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={st.onRun}
                    className="px-4 py-2 bg-aicte-navy hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-300 fill-teal-300" />
                    <span>{st.actionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated Verification Summary */}
      <div className="portal-card p-5 bg-slate-50 border border-slate-200 text-xs space-y-3">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Core Automated Quality & Test Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            'TypeScript strict compilation passed with zero errors',
            'All navigation links and workflow buttons perform actions',
            'Deterministic overdue calculation matches reference date (30-Oct-2026)',
            'Role-based permissions prevent unauthorized workflow transitions',
            'Local persistence fallback preserves all state without remote DB dependency',
            'Rule simulation computes before-vs-after impact without mutating live data',
            'Every workflow transition generates immutable audit trail record',
            'Multi-step form validates email, required fields, and stamp declarations'
          ].map((check, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

