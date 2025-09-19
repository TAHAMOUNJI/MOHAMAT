import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Client, Case, AuditLog } from './types';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddClient from './components/AddClient';
import ClientsList from './components/ClientsList';
import ExportData from './components/ExportData';
import EditClient from './components/EditClient';
import ClientDetailView from './components/ClientDetailView';
import AddCase from './components/AddCase';
import EditCase from './components/EditCase';
import PrintView from './components/PrintView';
import Reports from './components/Reports';
import Settings from './components/Settings';
import CasesList from './components/CasesList';
import LegalTexts from './components/LegalTexts';
import OfflineIndicator from './components/OfflineIndicator';
import KeyboardShortcuts from './components/KeyboardShortcuts';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [cases, setCases] = useLocalStorage<Case[]>('cases', []);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('auditLogs', []);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [addingCaseForClientId, setAddingCaseForClientId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [clientToPrint, setClientToPrint] = useState<Client | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setViewingClientId(null);
  }

  const addAuditLog = (action: 'create' | 'update' | 'delete', entityType: 'client' | 'case', entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- Client Functions ---
  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [newClient, ...prev]);
    addAuditLog('create', 'client', newClient.id, `تم إنشاء موكل جديد: ${newClient.firstName} ${newClient.lastName}`);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    addAuditLog('update', 'client', updatedClient.id, `تم تحديث بيانات الموكل: ${updatedClient.firstName} ${updatedClient.lastName}`);
    setEditingClient(null); 
  };

  const handleDeleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client && window.confirm(`هل أنت متأكد من حذف الموكل ${client.firstName} ${client.lastName}؟`)) {
      setClients(prev => prev.filter(c => c.id !== id));
      setCases(prev => prev.filter(c => c.clientId !== id));
      addAuditLog('delete', 'client', id, `تم حذف الموكل: ${client.firstName} ${client.lastName}`);
    }
  };

  const handleViewClient = (client: Client) => {
    setViewingClientId(client.id);
    setCurrentPage('client-details');
  };

  const handlePrintClient = (client: Client) => {
    setClientToPrint(client);
  };

  useEffect(() => {
    if (clientToPrint) {
      setTimeout(() => {
        window.print();
        setClientToPrint(null);
      }, 100);
    }
  }, [clientToPrint]);

  // --- Case Functions ---
  const handleAddCase = (clientId: string) => {
    setAddingCaseForClientId(clientId);
  };

  const handleSaveCase = (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCases(prev => [newCase, ...prev]);
    const client = clients.find(c => c.id === newCase.clientId);
    addAuditLog('create', 'case', newCase.id, `تمت إضافة قضية جديدة "${newCase.subject}" للموكل ${client?.firstName} ${client?.lastName}`);
    setAddingCaseForClientId(null);
  };

  const handleEditCase = (caseData: Case) => {
    setEditingCase(caseData);
  };

  const handleUpdateCase = (updatedCase: Case) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    addAuditLog('update', 'case', updatedCase.id, `تم تحديث قضية "${updatedCase.subject}"`);
    setEditingCase(null);
  };

  const handleDeleteCase = (caseId: string) => {
    const caseToDelete = cases.find(c => c.id === caseId);
    if (caseToDelete && window.confirm(`هل أنت متأكد من حذف قضية "${caseToDelete.subject}"؟`)) {
      setCases(prev => prev.filter(c => c.id !== caseId));
      addAuditLog('delete', 'case', caseId, `تم حذف قضية "${caseToDelete.subject}"`);
    }
  };

  // عرض الصفحات
  const renderCurrentPage = () => {
    const clientToView = clients.find(c => c.id === viewingClientId);

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} cases={cases} onPageChange={handlePageChange} />;
      
      case 'add-client':
        return <AddClient onAddClient={handleAddClient} />;
      
      case 'clients':
        return (
          <ClientsList
            clients={clients}
            cases={cases}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onViewClient={handleViewClient}
            onPrintClient={handlePrintClient}
          />
        );

      case 'cases':
        return <CasesList cases={cases} clients={clients} onViewClient={handleViewClient} />;
      
      case 'legal-texts':
        return <LegalTexts />;
      
      case 'client-details':
        if (!clientToView) return <div className="p-6">لم يتم العثور على الموكل.</div>;
        return (
          <ClientDetailView 
            client={clientToView}
            cases={cases.filter(c => c.clientId === clientToView.id)}
            onAddCase={handleAddCase}
            onEditCase={handleEditCase}
            onDeleteCase={handleDeleteCase}
          />
        );

      case 'export':
        return <ExportData clients={clients} cases={cases} />;

      case 'reports':
        return <Reports clients={clients} cases={cases} />;

      case 'settings':
        return <Settings clients={clients} cases={cases} setClients={setClients} setCases={setCases} />;
      
      default:
        return <Dashboard clients={clients} cases={cases} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
        
        <div className="flex-1">
          <Header />
          <main className="min-h-[calc(100vh-120px)]">
            {renderCurrentPage()}
          </main>
        </div>
      </div>

      {/* Modals */}
      {editingClient && (
        <EditClient 
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onUpdateClient={handleUpdateClient}
        />
      )}
      {addingCaseForClientId && (
        <AddCase 
          clientId={addingCaseForClientId}
          onClose={() => setAddingCaseForClientId(null)}
          onSaveCase={handleSaveCase}
        />
      )}
      {editingCase && (
        <EditCase 
          caseData={editingCase}
          onClose={() => setEditingCase(null)}
          onUpdateCase={handleUpdateCase}
        />
      )}

            <PrintView client={clientToPrint} cases={clientToPrint ? cases.filter(c => c.clientId === clientToPrint.id) : []} />
      
      <OfflineIndicator />
      <KeyboardShortcuts onPageChange={handlePageChange} />
    </div>
  );
}

export default App;