import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationDocument } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/dateUtils';
import { 
  FolderLock, 
  Search, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  Download,
  Info
} from 'lucide-react';

interface DocumentVaultProps {
  onSelectApplication: (id: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ onSelectApplication }) => {
  const { applications, currentUser, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<(ApplicationDocument & { appName: string; appId: string }) | null>(null);

  // Flatten all documents across applications
  const allDocs = applications.flatMap(app => 
    app.documents.map(d => ({
      ...d,
      appName: app.institutionName,
      appId: app.id
    }))
  );

  const filteredDocs = allDocs.filter(d => {
    const matchSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && d.verificationStatus !== statusFilter) return false;
    return true;
  });

  const handleSimulateDownload = (doc: typeof allDocs[0]) => {
    addToast('Simulated Evidence Download', `Downloading secure verified manifest: ${doc.name}`, 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AICTE Document Checklist & Evidentiary Vault</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              {allDocs.length} Evidences Stored
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of institutional deeds, building plans, fire safety NOCs, and statutory stamp affidavits.
          </p>
        </div>

        {/* Security badge */}
        <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
          <FolderLock className="w-4 h-4 text-teal-600" />
          <span>AES-256 Simulated Cryptographic Metadata</span>
        </div>
      </div>

      {/* Honest Storage Disclaimer */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Prototype Storage Transparency:</span> This demonstration uses safe metadata records, document versions, and verification stamps. Production systems integrate AWS S3 / MinIO S3 object storage with server-side virus scanning and OCR verification.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="portal-card p-4 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Document Name, Type, Institution, or Application ID..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Verification States</option>
              <option value="Verified">Verified Compliant</option>
              <option value="Pending">Pending Scrutiny</option>
              <option value="Deficient">Deficient</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="portal-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Document Title & Version</th>
                <th className="py-3 px-4">Institution & ID</th>
                <th className="py-3 px-4">Document Category</th>
                <th className="py-3 px-4">Uploaded Date</th>
                <th className="py-3 px-4">Validity / Expiry</th>
                <th className="py-3 px-4">Scrutiny Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.map((doc, idx) => {
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <span className="font-bold text-slate-900 block truncate" title={doc.name}>
                        {doc.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span className="bg-slate-100 px-1 rounded">{doc.version}</span>
                        <span>{doc.fileSize}</span>
                        {doc.isSimulatedEvidence && (
                          <span className="text-teal-700 font-semibold">Simulated PDF</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[190px]">
                      <button
                        onClick={() => onSelectApplication(doc.appId)}
                        className="font-medium text-teal-800 hover:underline block truncate text-left"
                      >
                        {doc.appName}
                      </button>
                      <span className="font-mono text-[10px] text-slate-400 block">{doc.appId}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {doc.expiryDate ? (
                        <span className="font-medium text-slate-800">
                          {formatDate(doc.expiryDate)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Perpetual</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="status">
                        {doc.verificationStatus === 'Verified' ? 'Approved' : doc.verificationStatus === 'Deficient' ? 'Deficiencies Noted' : 'Pending Scrutiny'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleSimulateDownload(doc)}
                        className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title="Document Metadata & Verification Audit"
          subtitle={`Simulated Evidence Record: ${selectedDoc.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <p><strong>Title:</strong> {selectedDoc.name}</p>
              <p><strong>Institution:</strong> {selectedDoc.appName} ({selectedDoc.appId})</p>
              <p><strong>Type:</strong> {selectedDoc.type}</p>
              <p><strong>Version:</strong> {selectedDoc.version} ({selectedDoc.fileSize})</p>
              <p><strong>Uploaded At:</strong> {formatDate(selectedDoc.uploadedAt)}</p>
              <p><strong>Expiry:</strong> {selectedDoc.expiryDate ? formatDate(selectedDoc.expiryDate) : 'Not Applicable (Perpetual Title)'}</p>
              <p><strong>Status:</strong> <span className="font-semibold text-teal-800">{selectedDoc.verificationStatus}</span></p>
              {selectedDoc.verifiedBy && (
                <p><strong>Verified By:</strong> {selectedDoc.verifiedBy} ({formatDate(selectedDoc.verifiedAt)})</p>
              )}
            </div>

            {selectedDoc.reviewerRemarks && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900">
                <span className="font-bold block text-[11px]">Scrutiny Official Remarks:</span>
                <p className="mt-0.5">{selectedDoc.reviewerRemarks}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-aicte-navy text-white rounded-lg font-semibold text-xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

