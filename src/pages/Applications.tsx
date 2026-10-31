import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Application, ApplicationStage, ApplicationStatus, ApplicationType } from '../types';
import { Badge } from '../components/common/Badge';
import { formatDate, formatDeadlineStatus } from '../utils/dateUtils';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ArrowUpDown, 
  AlertCircle, 
  Download,
  Building,
  UserCheck,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ApplicationsProps {
  onSelectApplication: (id: string) => void;
  onNavigateNew: () => void;
  initialFilters?: {
    stage?: ApplicationStage | null;
    status?: ApplicationStatus | null;
    region?: string | null;
    isOverdue?: boolean | null;
  };
}

export const Applications: React.FC<ApplicationsProps> = ({
  onSelectApplication,
  onNavigateNew,
  initialFilters
}) => {
  const { applications, currentUser } = useApp();

  // Search, filter, sorting, pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>(initialFilters?.stage || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilters?.status || 'ALL');
  const [regionFilter, setRegionFilter] = useState<string>(initialFilters?.region || 'ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [overdueOnly, setOverdueOnly] = useState<boolean>(initialFilters?.isOverdue || false);
  const [assignedFilter, setAssignedFilter] = useState<string>('ALL');

  const [sortField, setSortField] = useState<keyof Application>('submissionDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Clear filters
  const resetFilters = () => {
    setSearchTerm('');
    setStageFilter('ALL');
    setStatusFilter('ALL');
    setRegionFilter('ALL');
    setTypeFilter('ALL');
    setOverdueOnly(false);
    setAssignedFilter('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || stageFilter !== 'ALL' || statusFilter !== 'ALL' || regionFilter !== 'ALL' || typeFilter !== 'ALL' || overdueOnly || assignedFilter !== 'ALL';

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search
      const searchMatch = 
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Stage
      if (stageFilter !== 'ALL' && app.currentStage !== stageFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;

      // Region
      if (regionFilter !== 'ALL' && !app.region.includes(regionFilter)) return false;

      // Application Type
      if (typeFilter !== 'ALL' && app.applicationType !== typeFilter) return false;

      // Overdue
      if (overdueOnly && !app.isOverdue) return false;

      // Assigned Officer
      if (assignedFilter !== 'ALL' && !app.assignedOfficer.includes(assignedFilter)) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [applications, searchTerm, stageFilter, statusFilter, regionFilter, typeFilter, overdueOnly, assignedFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplications.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage]);

  const handleSort = (field: keyof Application) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Application Management Directory</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
              {filteredApplications.length} of {applications.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking, document scrutiny stages, and SLA monitoring across regional directorates.
          </p>
        </div>

        <button
          onClick={onNavigateNew}
          className="px-4 py-2 bg-aicte-navy hover:bg-navy-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>New AICTE Petition</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="portal-card p-4 space-y-3 bg-white">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Application ID, Institution Name, City or Officer..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Overdue Toggle */}
          <button
            onClick={() => { setOverdueOnly(!overdueOnly); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors shrink-0 ${
              overdueOnly 
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${overdueOnly ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>Overdue SLA Only</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Stage filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Workflow Stage
            </label>
            <select
              value={stageFilter}
              onChange={e => { setStageFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Stages</option>
              <option value="Submitted">Submitted</option>
              <option value="Scrutiny">Scrutiny</option>
              <option value="Re-Scrutiny">Re-Scrutiny</option>
              <option value="EVC">EVC</option>
              <option value="Final Decision">Final Decision</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Current Status
            </label>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Scrutiny">Pending Scrutiny</option>
              <option value="Scrutiny in Progress">Scrutiny in Progress</option>
              <option value="Deficiencies Noted">Deficiencies Noted</option>
              <option value="Awaiting Re-Scrutiny">Awaiting Re-Scrutiny</option>
              <option value="EVC Recommended">EVC Recommended</option>
              <option value="EVC Scheduled">EVC Scheduled</option>
              <option value="EVC Completed">EVC Completed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Region filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Regional Office
            </label>
            <select
              value={regionFilter}
              onChange={e => { setRegionFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Regions</option>
              <option value="ERO">Eastern (ERO)</option>
              <option value="WRO">Western (WRO)</option>
              <option value="NRO">Northern (NRO)</option>
              <option value="SRO">Southern (SRO)</option>
              <option value="CRO">Central (CRO)</option>
              <option value="NWRO">North-Western (NWRO)</option>
              <option value="SWRO">South-Western (SWRO)</option>
            </select>
          </div>

          {/* Application Type */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Petition Category
            </label>
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Types</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="New Technical Institution">New Technical Institution</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="Introduction of New Course">Introduction of New Course</option>
              <option value="Closure of Course/Institute">Closure of Course/Institute</option>
              <option value="Change of Site/Location">Change of Site/Location</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Filtered results: <strong>{filteredApplications.length}</strong> record(s)</span>
            <button
              onClick={resetFilters}
              className="text-teal-700 hover:text-teal-900 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="portal-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1.5">
                    <span>Application ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('institutionName')}>
                  <div className="flex items-center gap-1.5">
                    <span>Institution & Region</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Petition Type</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('currentStage')}>
                  <div className="flex items-center gap-1.5">
                    <span>Stage</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('dueDate')}>
                  <div className="flex items-center gap-1.5">
                    <span>SLA Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Building className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">No applications found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting search query or active filters</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 text-xs text-teal-700 font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedData.map(app => {
                  const deadline = formatDeadlineStatus(app.dueDate);

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-teal-50/20 transition-colors group"
                    >
                      {/* App ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="hover:underline flex items-center gap-1"
                        >
                          {app.id}
                        </button>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <p className="font-semibold text-slate-900 truncate" title={app.institutionName}>
                          {app.institutionName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {app.city}, {app.state} • <span className="font-medium text-slate-600">{app.region}</span>
                        </p>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-800 font-medium">{app.applicationType}</span>
                        <span className="block text-[10px] text-slate-400">AY {app.academicYear}</span>
                      </td>

                      {/* Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="stage">{app.currentStage}</Badge>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="status">{app.status}</Badge>
                      </td>

                      {/* Assigned Officer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[120px]">{app.assignedOfficer}</span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`block font-medium ${deadline.colorClass}`}>
                          {deadline.text}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Target: {formatDate(app.dueDate)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredApplications.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
            <div>
              Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(currentPage * pageSize, filteredApplications.length)}</span> of{' '}
              <span className="font-semibold">{filteredApplications.length}</span> applications
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

