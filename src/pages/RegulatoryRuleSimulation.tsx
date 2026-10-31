import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RegulatoryRule, RuleSimulationResult } from '../types';
import { simulateRuleImpact } from '../utils/ruleEngine';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  History, 
  ShieldAlert, 
  Info,
  Building2,
  Calendar,
  Layers,
  Check
} from 'lucide-react';

interface RegulatoryRuleSimulationProps {
  onSelectApplication: (id: string) => void;
}

export const RegulatoryRuleSimulation: React.FC<RegulatoryRuleSimulationProps> = ({ onSelectApplication }) => {
  const { rules, ruleHistory, applications, complianceItems, commitRuleUpdate, currentUser, addToast } = useApp();

  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const activeRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  // Parameter slider / input
  const [proposedValue, setProposedValue] = useState<number>(activeRule ? activeRule.currentValue : 7);
  const [ratificationReason, setRatificationReason] = useState<string>('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');

  // When changing rule selection, reset slider to rule's current value
  const handleSelectRule = (rule: RegulatoryRule) => {
    setSelectedRuleId(rule.id);
    setProposedValue(rule.currentValue);
  };

  // Run simulation in real-time (without modifying state)
  const simulationResult: RuleSimulationResult = useMemo(() => {
    if (!activeRule) {
      return {
        ruleId: '',
        ruleCode: '',
        originalParam: 0,
        simulatedParam: 0,
        totalApplicationsAnalyzed: 0,
        impactedApplications: [],
        newOverdueCount: 0,
        escalationIncreaseCount: 0,
        summaryExplanation: ''
      };
    }
    return simulateRuleImpact(activeRule, proposedValue, applications, complianceItems);
  }, [activeRule, proposedValue, applications, complianceItems]);

  const hasParameterChanged = activeRule && proposedValue !== activeRule.currentValue;

  const handleOpenConfirm = () => {
    if (currentUser.role !== 'System Administrator' && currentUser.role !== 'Competent Authority') {
      addToast(
        'Permission Restricted',
        `Ratifying regulatory rules requires [Competent Authority] or [System Administrator]. Your role is ${currentUser.role}. Use role switch to simulate approval.`,
        'warning'
      );
      return;
    }

    setRatificationReason(`Simulated adjustment of ${activeRule.title} from ${activeRule.currentValue} to ${proposedValue} ${activeRule.unit}`);
    setConfirmModalOpen(true);
  };

  const handleCommit = () => {
    if (!activeRule) return;
    commitRuleUpdate(activeRule.id, proposedValue, ratificationReason);
    setConfirmModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header with Innovation Badge */}
      <div className="portal-card p-6 bg-gradient-to-r from-purple-900 via-navy-900 to-aicte-navy text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-purple-500/30 text-purple-200 font-bold px-2.5 py-0.5 rounded-full border border-purple-400/40 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              KEY SIH INNOVATION: Explainable Regulatory Digital Twin
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">Zero-Risk Impact Analysis</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            AICTE Regulatory Rule Simulation Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Test proposed regulatory amendments, SLA turnaround windows, and escalation triggers against live institutional applications <em>before</em> ratifying into official gazette policy.
          </p>

          <div className="mt-3 p-2.5 bg-purple-950/60 rounded-xl border border-purple-700/50 text-[11px] text-purple-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-300 shrink-0" />
            <span>
              <strong>Demonstration Notice:</strong> All rules and parameters are sample simulation models for SIH 2026 Problem Statement 26262 and do not represent official AICTE council determinations.
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Simulator vs Rule Version History */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'border-purple-600 text-purple-900 font-bold bg-purple-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Interactive Parameter Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-purple-600 text-purple-900 font-bold bg-purple-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Version Comparison & Audit History ({ruleHistory.length})</span>
        </button>
      </div>

      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Rule Selector & Parameter Slider */}
          <div className="space-y-4">
            <div className="portal-card p-5 bg-white space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
                1. Select Regulatory Parameter to Simulate
              </h2>

              <div className="space-y-2">
                {rules.map(rule => {
                  const isSelected = rule.id === selectedRuleId;

                  return (
                    <div
                      key={rule.id}
                      onClick={() => handleSelectRule(rule)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50/40 ring-1 ring-purple-500 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rule.code}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          v{rule.version}.0
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mt-0.5 line-clamp-1">{rule.title}</p>
                      <span className="text-[10px] text-purple-700 font-semibold block mt-1">
                        Active Value: {rule.currentValue} {rule.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider / Value Adjuster */}
            {activeRule && (
              <div className="portal-card p-5 bg-white space-y-4 border-2 border-purple-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">2. Adjust Simulated Value</h3>
                  <span className="text-xs font-mono bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                    {proposedValue} {activeRule.unit}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {activeRule.description}
                </p>

                {/* Range Input */}
                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={2}
                    max={30}
                    step={1}
                    value={proposedValue}
                    onChange={e => setProposedValue(parseInt(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>2 days (Strict)</span>
                    <span className="text-purple-700 font-bold">Baseline: {activeRule.currentValue} {activeRule.unit}</span>
                    <span>30 days (Relaxed)</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-3 border-t flex items-center justify-between">
                  <button
                    onClick={() => setProposedValue(activeRule.currentValue)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Baseline</span>
                  </button>

                  <button
                    disabled={!hasParameterChanged}
                    onClick={handleOpenConfirm}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      hasParameterChanged
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Ratify & Apply to Live Dataset</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (2 cols): Real-Time Impact Analysis & Before-vs-After Comparison */}
          <div className="lg:col-span-2 space-y-4">
            {/* Impact Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="portal-card p-4 bg-white border-l-4 border-l-purple-500">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Applications Analyzed
                </span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {simulationResult.totalApplicationsAnalyzed}
                </span>
                <span className="text-[11px] text-slate-500">Across active national pipeline</span>
              </div>

              <div className={`portal-card p-4 bg-white border-l-4 ${
                simulationResult.newOverdueCount > 0 ? 'border-l-rose-500 bg-rose-50/20' : 'border-l-teal-500'
              }`}>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Newly Overdue Breaches
                </span>
                <span className={`text-2xl font-bold mt-1 block ${
                  simulationResult.newOverdueCount > 0 ? 'text-rose-600' : 'text-teal-700'
                }`}>
                  +{simulationResult.newOverdueCount}
                </span>
                <span className="text-[11px] text-slate-500">
                  {simulationResult.newOverdueCount > 0 ? 'Immediate SLA failures' : 'Zero new breaches'}
                </span>
              </div>

              <div className="portal-card p-4 bg-white border-l-4 border-l-amber-500">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Elevated Escalations
                </span>
                <span className="text-2xl font-bold text-amber-700 mt-1 block">
                  {simulationResult.escalationIncreaseCount}
                </span>
                <span className="text-[11px] text-slate-500">Shifted to Bureau Head / CA</span>
              </div>
            </div>

            {/* Natural Language Explanation Box */}
            <div className="portal-card p-4 bg-gradient-to-r from-purple-50/80 to-blue-50/80 border border-purple-200/80 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-950 text-xs">Simulated Policy Impact Assessment</h4>
                  <p className="text-purple-900 mt-1 leading-relaxed text-xs">
                    {simulationResult.summaryExplanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Affected Applications Comparison Table */}
            <div className="portal-card overflow-hidden bg-white">
              <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Before-vs-After Application Impact Table</h3>
                  <p className="text-[11px] text-slate-500">Applications sensitive to this regulatory parameter change</p>
                </div>
                <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  {simulationResult.impactedApplications.length} Affected
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {simulationResult.impactedApplications.length === 0 ? (
                  <p className="p-8 text-center text-slate-400">
                    No applications breach new thresholds under this simulated value.
                  </p>
                ) : (
                  simulationResult.impactedApplications.map(item => (
                    <div key={item.applicationId} className="p-4 space-y-2 hover:bg-slate-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectApplication(item.applicationId)}
                            className="font-mono font-bold text-teal-800 hover:underline"
                          >
                            {item.applicationId}
                          </button>
                          <span className="font-semibold text-slate-800">{item.institution}</span>
                          <Badge variant="stage">{item.currentStage}</Badge>
                        </div>

                        {/* Status Diff Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.currentOverdue ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Before: {item.currentOverdue ? 'OVERDUE' : 'ON TRACK'}
                          </span>
                          <span>→</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.simulatedOverdue ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            Simulated: {item.simulatedOverdue ? 'BREACHED' : 'COMPLIANT'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <strong>Deadline Shift:</strong> {formatDate(item.currentDueDate)} → <strong className="text-purple-800">{formatDate(item.simulatedDueDate)}</strong>
                        </div>
                        <div>
                          <strong>Escalation Tier:</strong> Level {item.alertLevelBefore} → <strong className="text-amber-700">Level {item.alertLevelAfter}</strong>
                        </div>
                        <div className="sm:col-span-2 text-slate-600 italic">
                          "{item.explanation}"
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Version Comparison & Audit History */}
      {activeTab === 'history' && (
        <div className="portal-card overflow-hidden bg-white">
          <div className="p-4 bg-slate-50 border-b">
            <h3 className="text-xs font-bold text-slate-900">Regulatory Rule Version History</h3>
            <p className="text-[11px] text-slate-500">Track modifications made to SLA timelines and escalation criteria</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {ruleHistory.map((ver, idx) => (
              <div key={idx} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-800">{ver.code}</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Version {ver.version}.0
                    </span>
                    <span className="font-semibold text-slate-900">{ver.title}</span>
                  </div>
                  <p className="text-slate-600">{ver.description}</p>
                  <p className="text-[11px] text-slate-500">
                    Ratified parameter: <strong className="text-slate-800">{ver.currentValue} {ver.unit}</strong> • Modified by: <strong>{ver.updatedBy}</strong>
                  </p>
                </div>
                <div className="text-right shrink-0 text-slate-400 text-[11px]">
                  {formatDateTime(ver.lastUpdated)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {activeRule && (
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title={`Ratify Regulatory Parameter: ${activeRule.code}`}
          subtitle={`Promoting simulated value ${proposedValue} ${activeRule.unit} into active system policy`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
              <p className="font-semibold">Statutory Impact Confirmation</p>
              <p className="text-[11px] mt-0.5">
                Applying this rule will advance its version to v{activeRule.version + 1}.0, recalculate active application SLA deadlines across {applications.length} institutions, and log an audit trail event.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ratification Justification / Reason *</label>
              <textarea
                rows={3}
                required
                value={ratificationReason}
                onChange={e => setRatificationReason(e.target.value)}
                placeholder="e.g. AICTE Executive Committee directive regarding expedited scrutiny SLA..."
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommit}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg font-bold shadow-xs hover:bg-purple-700"
              >
                Ratify & Save New Version
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

