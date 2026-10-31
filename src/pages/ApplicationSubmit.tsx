import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  InstitutionType, 
  ApplicationType, 
  Application 
} from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  FileCheck, 
  Upload, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface ApplicationSubmitProps {
  onSuccess: (newAppId: string) => void;
  onCancel: () => void;
}

export const ApplicationSubmit: React.FC<ApplicationSubmitProps> = ({ onSuccess, onCancel }) => {
  const { addApplication, currentUser } = useApp();

  // Wizard steps: 1. Institutional Details, 2. Academic & Programme Specs, 3. Mandatory Documents, 4. Final Verification
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    institutionName: currentUser.institutionName || 'Saraswati Institute of Engineering & Technology',
    institutionCode: '1-99882211',
    institutionType: 'Self-Financing / Private' as InstitutionType,
    region: (currentUser.region || 'Western (WRO)') as Application['region'],
    state: 'Maharashtra',
    city: 'Nagpur',
    contactPerson: currentUser.name || 'Dr. Ananya Joshi',
    contactEmail: currentUser.email || 'ananya.joshi@saraswati-engg.edu.in.demo',
    contactPhone: '+91 98221 45091',
    applicationType: 'Extension of Approval (EoA)' as ApplicationType,
    academicYear: '2026-2027',
    programmesInput: 'Computer Science and Engineering, Electronics and Communication Engineering',
    totalIntakeProposed: 360,
    evcRequired: false,
    assignedOfficer: 'Dr. Anand Deshmukh',
    assignedOfficerId: 'USR-RO-02',
    dueDate: '2026-11-12T18:00:00Z',
    notes: 'Submitted for annual extension with full compliance on faculty cadre ratio and lab apparatus.'
  });

  // Document checklist state
  const [docChecklist, setDocChecklist] = useState({
    landDoc: true,
    fireSafety: true,
    stabilityCert: true,
    antiRaggingAffidavit: true,
    bankLien: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.institutionName.trim()) errs.institutionName = 'Institution name is required';
      if (!formData.institutionCode.trim()) errs.institutionCode = 'Institution AICTE permanent code is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.state.trim()) errs.state = 'State is required';
      if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact official name is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.contactEmail.trim()) {
        errs.contactEmail = 'Email is required';
      } else if (!emailRegex.test(formData.contactEmail)) {
        errs.contactEmail = 'Please provide a valid official email address';
      }

      if (!formData.contactPhone.trim()) {
        errs.contactPhone = 'Phone number is required';
      }
    }

    if (step === 2) {
      if (formData.totalIntakeProposed <= 0) {
        errs.totalIntakeProposed = 'Proposed intake must be greater than zero';
      }
      if (!formData.programmesInput.trim()) {
        errs.programmesInput = 'Specify at least one academic discipline / programme';
      }
    }

    if (step === 3) {
      if (!docChecklist.antiRaggingAffidavit) {
        errs.antiRagging = 'Mandatory AICTE Statutory Anti-Ragging Affidavit must be declared and checked';
      }
      if (!docChecklist.landDoc) {
        errs.landDoc = 'Land ownership / conversion deed must be confirmed';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const programmesList = formData.programmesInput.split(',').map(s => s.trim()).filter(Boolean);

    const initialDocs = [
      {
        id: 'DOC-NEW-1',
        name: 'Land Conversion & Approved Building Master Plan',
        type: 'Land Documents',
        fileSize: '4.8 MB',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'Pending' as const,
        version: 'v1.0',
        isSimulatedEvidence: true
      },
      {
        id: 'DOC-NEW-2',
        name: 'Fire & Life Safety Clearance NOC',
        type: 'Safety Compliance',
        fileSize: '2.1 MB',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'Pending' as const,
        version: 'v1.0',
        isSimulatedEvidence: true
      },
      {
        id: 'DOC-NEW-3',
        name: 'AICTE Mandatory Statutory Affidavit & Undertakings (AY 26-27)',
        type: 'Statutory Undertaking',
        fileSize: '1.5 MB',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'Pending' as const,
        version: 'v1.0',
        isSimulatedEvidence: true
      }
    ];

    const created = addApplication({
      institutionName: formData.institutionName,
      institutionCode: formData.institutionCode,
      institutionType: formData.institutionType,
      region: formData.region,
      state: formData.state,
      city: formData.city,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      applicationType: formData.applicationType,
      academicYear: formData.academicYear,
      currentStage: 'Submitted',
      status: 'Pending Scrutiny',
      assignedOfficer: formData.assignedOfficer,
      assignedOfficerId: formData.assignedOfficerId,
      dueDate: formData.dueDate,
      evcRequired: formData.evcRequired,
      programmes: programmesList,
      totalIntakeProposed: Number(formData.totalIntakeProposed),
      scrutinyRemarks: formData.notes
    }, initialDocs);

    onSuccess(created.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>AICTE Approval Petition Submission Portal</span>
          <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
            AY 2026-2027
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the multi-section regulatory filing form. Applications are validated against AICTE APH provisions and immediately enrolled into the automated scrutiny pipeline.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="portal-card p-4 bg-white">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Institution & Legal Profile' },
            { step: 2, label: 'Disciplines & Capacity' },
            { step: 3, label: 'Mandatory Compliance Checklist' },
            { step: 4, label: 'Verification & Submission' }
          ].map((item, idx) => {
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div key={item.step} className="flex-1 flex items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone 
                      ? 'bg-teal-600 text-white' 
                      : isCurrent 
                      ? 'bg-aicte-navy text-teal-300 ring-2 ring-teal-500' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400">Step {item.step} of 4</p>
                  </div>
                </div>
                {idx < 3 && <div className="flex-1 h-0.5 bg-slate-200 mx-3 hidden sm:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="portal-card p-6 bg-white">
        {/* Step 1: Institution & Legal Profile */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Section 1: Technical Institution & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institution Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="e.g. Saraswati Institute of Engineering & Technology"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.institutionName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.institutionName}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  AICTE Permanent Institute ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  onChange={e => setFormData({ ...formData, institutionCode: e.target.value })}
                  placeholder="1-99882211"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 font-mono"
                />
                {errors.institutionCode && <p className="text-[11px] text-rose-500 mt-0.5">{errors.institutionCode}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institution Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.institutionType}
                  onChange={e => setFormData({ ...formData, institutionType: e.target.value as InstitutionType })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                >
                  <option value="Self-Financing / Private">Self-Financing / Private</option>
                  <option value="Government / University Dept">Government / University Dept</option>
                  <option value="Govt-Aided">Govt-Aided</option>
                  <option value="Autonomous">Autonomous</option>
                  <option value="Deemed University">Deemed University</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Regional Office (RO) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value as Application['region'] })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                >
                  <option value="Western (WRO)">Western (WRO) — Mumbai</option>
                  <option value="Eastern (ERO)">Eastern (ERO) — Kolkata</option>
                  <option value="Northern (NRO)">Northern (NRO) — Kanpur</option>
                  <option value="Southern (SRO)">Southern (SRO) — Chennai</option>
                  <option value="Central (CRO)">Central (CRO) — Bhopal</option>
                  <option value="North-Western (NWRO)">North-Western (NWRO) — Chandigarh</option>
                  <option value="South-Western (SWRO)">South-Western (SWRO) — Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Nagpur"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.city && <p className="text-[11px] text-rose-500 mt-0.5">{errors.city}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  State / UT <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.state && <p className="text-[11px] text-rose-500 mt-0.5">{errors.state}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Principal / Authorized Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Dr. Ananya Joshi"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.contactPerson && <p className="text-[11px] text-rose-500 mt-0.5">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="principal@saraswati-engg.edu.in.demo"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.contactEmail && <p className="text-[11px] text-rose-500 mt-0.5">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Contact Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+91 98221 45091"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.contactPhone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.contactPhone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic & Programme Specs */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>Section 2: Petition Category & Academic Programmes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  AICTE Petition Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.applicationType}
                  onChange={e => setFormData({ ...formData, applicationType: e.target.value as ApplicationType })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                >
                  <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                  <option value="New Technical Institution">New Technical Institution</option>
                  <option value="Increase in Intake">Increase in Intake</option>
                  <option value="Introduction of New Course">Introduction of New Course</option>
                  <option value="Closure of Course/Institute">Closure of Course/Institute</option>
                  <option value="Change of Site/Location">Change of Site/Location</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Academic Approval Year
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  disabled
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Proposed Programmes / Courses (Comma-separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.programmesInput}
                  onChange={e => setFormData({ ...formData, programmesInput: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science, B.Tech AI & Data Science, MBA"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.programmesInput && <p className="text-[11px] text-rose-500 mt-0.5">{errors.programmesInput}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Total Student Intake Proposed <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.totalIntakeProposed}
                  onChange={e => setFormData({ ...formData, totalIntakeProposed: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
                {errors.totalIntakeProposed && <p className="text-[11px] text-rose-500 mt-0.5">{errors.totalIntakeProposed}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  EVC Requirement Expected
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="evcCheck"
                    checked={formData.evcRequired}
                    onChange={e => setFormData({ ...formData, evcRequired: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <label htmlFor="evcCheck" className="text-xs text-slate-700">
                    Mandate Expert Visiting Committee (EVC) field physical inspection
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Institutional Justification / Submission Remarks
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Mandatory Documents & Undertakings */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Section 3: Statutory Undertakings & Evidence Checklist</span>
            </h3>

            <p className="text-xs text-slate-500">
              In this prototype demonstration, simulated digital evidence metadata is verified against statutory AICTE guidelines. Confirm declaration of mandatory instruments below:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk1"
                  checked={docChecklist.antiRaggingAffidavit}
                  onChange={e => setDocChecklist({ ...docChecklist, antiRaggingAffidavit: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300"
                />
                <label htmlFor="chk1" className="cursor-pointer">
                  <span className="font-semibold text-slate-900 block">
                    Statutory Anti-Ragging & Non-Encumbrance Affidavit (Mandatory)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Executed on Rs. 100 Non-Judicial Stamp Paper with sworn notary declaration pursuant to Supreme Court & AICTE Regulations 2009.
                  </span>
                </label>
              </div>
              {errors.antiRagging && <p className="text-[11px] text-rose-500 font-semibold">{errors.antiRagging}</p>}

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk2"
                  checked={docChecklist.landDoc}
                  onChange={e => setDocChecklist({ ...docChecklist, landDoc: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300"
                />
                <label htmlFor="chk2" className="cursor-pointer">
                  <span className="font-semibold text-slate-900 block">
                    Land Title Deed & Competent Town Planner Conversion Order (Mandatory)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Valid registered conveyance deed and approved building blueprints without encumbrance.
                  </span>
                </label>
              </div>
              {errors.landDoc && <p className="text-[11px] text-rose-500 font-semibold">{errors.landDoc}</p>}

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk3"
                  checked={docChecklist.fireSafety}
                  onChange={e => setDocChecklist({ ...docChecklist, fireSafety: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300"
                />
                <label htmlFor="chk3" className="cursor-pointer">
                  <span className="font-semibold text-slate-900 block">
                    Fire Safety & Occupancy Certificate NOC
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Issued by State Fire Service Authority under National Building Code (NBC).
                  </span>
                </label>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk4"
                  checked={docChecklist.stabilityCert}
                  onChange={e => setDocChecklist({ ...docChecklist, stabilityCert: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300"
                />
                <label htmlFor="chk4" className="cursor-pointer">
                  <span className="font-semibold text-slate-900 block">
                    Structural Stability Certificate (Form B)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Endorsed by chartered structural engineer confirming seismic zone compliance.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review Screen before Submission */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-teal-900 text-xs">Pre-Submission Regulatory Verification</h4>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  Review the petition details below. Upon final submission, the system will allocate a unique AICTE tracking ID, initiate SLA countdown, and record an immutable audit event.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Institution</span>
                <span className="font-bold text-slate-800">{formData.institutionName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Permanent ID</span>
                <span className="font-mono text-slate-700">{formData.institutionCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                <span className="font-semibold text-slate-800">{formData.applicationType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Regional Office</span>
                <span className="text-slate-700">{formData.region}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="text-slate-700">{formData.city}, {formData.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Proposed Intake</span>
                <span className="font-bold text-slate-800">{formData.totalIntakeProposed} Seats</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Academic Disciplines</span>
                <span className="text-slate-700">{formData.programmesInput}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Contact</span>
                <span className="text-slate-700">{formData.contactPerson} ({formData.contactPhone})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Email</span>
                <span className="text-slate-700">{formData.contactEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Initial Stage</span>
                <span className="font-bold text-teal-700">Submitted (Pending Scrutiny)</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-800">
              <span className="font-semibold">Notice:</span> By clicking "Submit AICTE Petition", you certify that the information entered is true to institutional records.
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : handlePrev}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-xs font-semibold bg-aicte-navy text-white hover:bg-navy-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit AICTE Petition</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

