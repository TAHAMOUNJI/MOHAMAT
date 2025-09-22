import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('auditLogs', []);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClientId, setViewingClientId] = useState<string | null>(null);
  const [addingCaseForClientId, setAddingCaseForClientId] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [clientToPrint, setClientToPrint] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API base URL
  const API_BASE = 'http://localhost:3001/api';

  // Load data on component mount
  useEffect(() => {
    loadClients();
    loadCases();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
      setError('فشل في تحميل بيانات الموكلين');
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cases`);
      setCases(response.data);
    } catch (error) {
      console.error('Error loading cases:', error);
      setError('فشل في تحميل بيانات القضايا');
    }
  };
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
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/clients`, clientData);
      const newClient = response.data;
      setClients(prev => [newClient, ...prev]);
      addAuditLog('create', 'client', newClient.id, `تم إنشاء موكل جديد: ${newClient.firstName} ${newClient.lastName}`);
      setError(null);
    } catch (error) {
      console.error('Error adding client:', error);
      setError('فشل في إضافة الموكل');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE}/clients/${updatedClient.id}`, updatedClient);
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
      addAuditLog('update', 'client', updatedClient.id, `تم تحديث بيانات الموكل: ${updatedClient.firstName} ${updatedClient.lastName}`);
      setEditingClient(null);
      setError(null);
    } catch (error) {
      console.error('Error updating client:', error);
      setError('فشل في تحديث بيانات الموكل');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client && window.confirm(`هل أنت متأكد من حذف الموكل ${client.firstName} ${client.lastName}؟`)) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/clients/${id}`);
        setClients(prev => prev.filter(c => c.id !== id));
        setCases(prev => prev.filter(c => c.clientId !== id));
        addAuditLog('delete', 'client', id, `تم حذف الموكل: ${client.firstName} ${client.lastName}`);
        setError(null);
      } catch (error) {
        console.error('Error deleting client:', error);
        setError('فشل في حذف الموكل');
      } finally {
        setLoading(false);
      }
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

  const handleSaveCase = async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/cases`, caseData);
      const newCase = response.data;
      setCases(prev => [newCase, ...prev]);
      const client = clients.find(c => c.id === newCase.clientId);
      addAuditLog('create', 'case', newCase.id, `تمت إضافة قضية جديدة "${newCase.subject}" للموكل ${client?.firstName} ${client?.lastName}`);
      setAddingCaseForClientId(null);
      setError(null);
    } catch (error) {
      console.error('Error adding case:', error);
      setError('فشل في إضافة القضية');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCase = (caseData: Case) => {
    setEditingCase(caseData);
  };

  const handleUpdateCase = async (updatedCase: Case) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE}/cases/${updatedCase.id}`, updatedCase);
      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
      addAuditLog('update', 'case', updatedCase.id, `تم تحديث قضية "${updatedCase.subject}"`);
      setEditingCase(null);
      setError(null);
    } catch (error) {
      console.error('Error updating case:', error);
      setError('فشل في تحديث القضية');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    const caseToDelete = cases.find(c => c.id === caseId);
    if (caseToDelete && window.confirm(`هل أنت متأكد من حذف قضية "${caseToDelete.subject}"؟`)) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/cases/${caseId}`);
        setCases(prev => prev.filter(c => c.id !== caseId));
        addAuditLog('delete', 'case', caseId, `تم حذف قضية "${caseToDelete.subject}"`);
        setError(null);
      } catch (error) {
        console.error('Error deleting case:', error);
        setError('فشل في حذف القضية');
      } finally {
        setLoading(false);
      }
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
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>جاري التحميل...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      )}

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