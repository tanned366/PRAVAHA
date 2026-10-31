import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { ApplicationSubmit } from './pages/ApplicationSubmit';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { ComplianceMonitoring } from './pages/ComplianceMonitoring';
import { EVCManagement } from './pages/EVCManagement';
import { AlertsEscalation } from './pages/AlertsEscalation';
import { RegulatoryRuleSimulation } from './pages/RegulatoryRuleSimulation';
import { DocumentVault } from './pages/DocumentVault';
import { AuditTrail } from './pages/AuditTrail';
import { AdminSettings } from './pages/AdminSettings';
import { TestScenarios } from './pages/TestScenarios';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [appFilters, setAppFilters] = useState<any>(null);

  const handleNavigate = (page: string, filterOptions?: any) => {
    setSelectedAppId(null);
    setCurrentPage(page);
    if (filterOptions) {
      setAppFilters(filterOptions);
    } else {
      setAppFilters(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApplication = (id: string) => {
    setSelectedAppId(id);
    setCurrentPage('application-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Statutory SIH 2026 Disclaimer Top Banner */}
      <DisclaimerBanner />

      {/* Main Top Header Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex">
        {/* Collapsible Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'applications' && (
            <Applications
              onSelectApplication={handleSelectApplication}
              onNavigateNew={() => handleNavigate('new-application')}
              initialFilters={appFilters}
            />
          )}

          {currentPage === 'new-application' && (
            <ApplicationSubmit
              onSuccess={(newAppId: string) => handleSelectApplication(newAppId)}
              onCancel={() => handleNavigate('applications')}
            />
          )}

          {currentPage === 'application-detail' && selectedAppId && (
            <ApplicationDetail
              applicationId={selectedAppId}
              onBack={() => handleNavigate('applications')}
              onNavigateToEVC={() => handleNavigate('evc')}
            />
          )}

          {currentPage === 'compliance' && (
            <ComplianceMonitoring
              onSelectApplication={handleSelectApplication}
              initialFilter={appFilters?.verificationStatus}
            />
          )}

          {currentPage === 'evc' && (
            <EVCManagement
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsEscalation
              onSelectApplication={handleSelectApplication}
              initialSeverityFilter={appFilters?.severity}
            />
          )}

          {currentPage === 'simulation' && (
            <RegulatoryRuleSimulation
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'documents' && (
            <DocumentVault
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'audit' && (
            <AuditTrail
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'settings' && (
            <AdminSettings
              onNavigateToSimulation={() => handleNavigate('simulation')}
            />
          )}

          {currentPage === 'walkthrough' && (
            <TestScenarios
              onNavigate={handleNavigate}
              onSelectApplication={handleSelectApplication}
            />
          )}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
