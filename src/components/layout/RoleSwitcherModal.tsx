import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types';
import { 
  Building2, 
  FileCheck, 
  UserCheck, 
  Award, 
  ShieldAlert, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleConfig {
  role: UserRole;
  title: string;
  demoName: string;
  demoDesignation: string;
  icon: React.ElementType;
  color: string;
  permissions: string[];
  description: string;
}

const ROLES_INFO: RoleConfig[] = [
  {
    role: 'Institution User',
    title: 'Technical Institution / Principal',
    demoName: 'Dr. Rameshwar Sharma',
    demoDesignation: 'Principal, Kalinga Institute of Advanced Technology',
    icon: Building2,
    color: 'from-blue-600 to-indigo-700',
    permissions: [
      'Submit new AICTE approval petitions (EoA / New Institute)',
      'Upload statutory affidavits, undertakings & compliance evidence',
      'Track real-time scrutiny timeline and respond to defect memos'
    ],
    description: 'Represents colleges and polytechnic institutes filing compliance records and petitions.'
  },
  {
    role: 'Regional Officer',
    title: 'AICTE Regional Office (RO)',
    demoName: 'Er. Sunita Mukherjee',
    demoDesignation: 'Regional Officer, Eastern Regional Office (ERO)',
    icon: FileCheck,
    color: 'from-teal-600 to-emerald-700',
    permissions: [
      'Scrutinize institutional submissions against APH checklists',
      'Issue deficiency requisitions & conduct re-scrutiny',
      'Recommend applications for Expert Visiting Committee (EVC)',
      'Verify compliance evidence & manage regional backlog'
    ],
    description: 'Key regulatory scrutinizer responsible for document audit and EVC dispatch.'
  },
  {
    role: 'EVC Committee Member',
    title: 'Expert Visiting Committee',
    demoName: 'Prof. K. Venkatesh',
    demoDesignation: 'Retd. Professor, IIT / AICTE EVC Chairman',
    icon: UserCheck,
    color: 'from-cyan-600 to-blue-700',
    permissions: [
      'Inspect physical labs, computing centers, barrier-free access',
      'Schedule on-site / hybrid expert committee visits',
      'Submit digital EVC observation reports and flag deficiencies',
      'Mark visit completion or record official postponement reasons'
    ],
    description: 'Senior peer review academics tasked with ground-truth verification of infrastructure.'
  },
  {
    role: 'Competent Authority',
    title: 'Approval Bureau / Member Secretary',
    demoName: 'Prof. (Dr.) Manju Singh',
    demoDesignation: 'Competent Authority & Advisor (Approval Bureau)',
    icon: Award,
    color: 'from-purple-600 to-pink-700',
    permissions: [
      'Issue final statutory approval or rejection decisions under Section 10(k)',
      'Review high-priority escalated cases and EVC summary findings',
      'Enforce mandatory show-cause procedures before adverse decisions',
      'Executive dashboard view across all national regional directorates'
    ],
    description: 'Highest decision-making statutory authority authorizing sanction orders.'
  },
  {
    role: 'System Administrator',
    title: 'System & Policy Administrator',
    demoName: 'Catalyst System Admin',
    demoDesignation: 'Technical Administrator, SIH Catalyst Daemon',
    icon: ShieldAlert,
    color: 'from-slate-700 to-slate-900',
    permissions: [
      'Configure regulatory SLA windows, scrutiny turnarounds & thresholds',
      'Simulate regulatory rule changes on sample cases before ratifying',
      'View immutable audit log trail across all entities and actors',
      'Reset demonstration dataset to original seed baseline'
    ],
    description: 'Oversees rule parameters, system configuration, rule simulation and system integrity.'
  }
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUserRole } = useApp();

  const handleSelectRole = (role: UserRole) => {
    setCurrentUserRole(role);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Demonstration Role"
      subtitle="Select a persona to experience role-specific dashboards, workflow permissions, and actions."
      maxWidth="2xl"
    >
      <div className="space-y-3.5 my-1">
        {ROLES_INFO.map(item => {
          const isSelected = currentUser.role === item.role;
          const Icon = item.icon;

          return (
            <div
              key={item.role}
              onClick={() => handleSelectRole(item.role)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected 
                  ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-lg text-white bg-gradient-to-br ${item.color} shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">{item.role}</h4>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Demo Persona:</strong> {item.demoName} <span className="text-slate-400">({item.demoDesignation})</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.permissions.map((p, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-100/80 px-2.5 py-1 rounded-full border border-teal-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      Active
                    </span>
                  ) : (
                    <button className="text-xs text-slate-500 font-medium group-hover:text-teal-700 flex items-center gap-1 px-3 py-1.5 rounded-lg group-hover:bg-teal-50 transition-colors">
                      Switch <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
