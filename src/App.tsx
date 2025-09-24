import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Client, Case, AuditLog } from './types';
import * as api from './api';

// Import all components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddClient from './components/AddClient';
import ClientsList from './components/ClientsList';
import AddCase from './components/AddCase';
import CasesList from './components/CasesList';
import LegalTexts from './components/LegalTexts';
import Reports from './components/Reports';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import ClientDetailView from './components/ClientDetailView';
import EditClient from './components/EditClient';
import EditCase from './components/EditCase';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [, setAuditLogs] = useLocalStorage<AuditLog[]>('auditLogs', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const logAction = useCallback((action: 'create' | 'update' | 'delete', details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [setAuditLogs]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to load from API, fallback to empty arrays if server is not running
      try {
        const [clientsData, casesData] = await Promise.all([
          api.getClients(),
          api.getCases(),
        ]);
        setClients(clientsData);
        setCases(casesData);
      } catch (apiError) {
        console.log('API not available, using empty data');
        setClients([]);
        setCases([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('فشل في تحميل البيانات من الخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedClient(null);
    setSelectedCase(null);
  };

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      try {
        const newClient = await api.createClient(clientData);
        setClients(prev => [...prev, newClient]);
        logAction('create', `Client created: ${newClient.firstName} ${newClient.lastName}`);
      } catch (apiError) {
        // Fallback to local creation
        const newClient: Client = {
          ...clientData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setClients(prev => [...prev, newClient]);
        logAction('create', `Client created: ${newClient.firstName} ${newClient.lastName}`);
      }
      setCurrentPage('clients');
    } catch (error) {
      setError('فشل في إضافة الموكل');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Implemented the 'Save and Add Case' functionality.
  // This function saves the new client and then immediately navigates
  // to the 'Add Case' page for that newly created client.
  const handleSaveClientAndAddCase = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      let newClient: Client;
      try {
        newClient = await api.createClient(clientData);
        setClients(prev => [...prev, newClient]);
      } catch (apiError) {
        // Fallback to local creation
        newClient = {
          ...clientData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setClients(prev => [...prev, newClient]);
      }
      logAction('create', `Client created: ${newClient.firstName} ${newClient.lastName}`);
      setSelectedClient(newClient);
      setCurrentPage(`add-case-${newClient.id}`);
    } catch (error) {
      setError('فشل في إضافة الموكل');
    } finally {
      setLoading(false);
    }
  };


  // ✅ FIX: Refactored to accept a single object argument for consistency.
  // This makes the component prop easier to manage: `onUpdateClient={handleUpdateClient}`.
  const handleUpdateClient = async (client: Partial<Client> & { id: string }) => {
    const { id, ...updateData } = client;
    try {
      setLoading(true);
      try {
        const updatedClient = await api.updateClient(id, updateData);
        setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      } catch (apiError) {
        // Fallback to local update
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updateData, updatedAt: new Date().toISOString() } : c));
      }
      logAction('update', `Client updated: ${id}`);
      setCurrentPage('clients');
    } catch (error) {
      setError('فشل في تحديث بيانات الموكل');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموكل؟ سيتم حذف جميع القضايا المتعلقة به.')) {
      try {
        setLoading(true);
        try {
          await api.deleteClient(id);
        } catch (apiError) {
          // Fallback to local deletion
          console.log('API not available, deleting locally');
        }
        setClients(prev => prev.filter(c => c.id !== id));
        setCases(prev => prev.filter(c => c.clientId !== id));
        logAction('delete', `Client deleted: ${id}`);
        setCurrentPage('clients');
      } catch (error) {
        setError('فشل في حذف الموكل');
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ FIX: Added an optional 'redirectPage' parameter to improve navigation flow.
  // After adding a case, the user can be redirected to a more relevant page
  // (like the client's detail view) instead of always going to the main cases list.
  const handleAddCase = async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>, redirectPage: string = 'cases') => {
    try {
      setLoading(true);
      try {
        const newCase = await api.createCase(caseData);
        setCases(prev => [...prev, newCase]);
        logAction('create', `Case created: ${newCase.subject}`);
      } catch (apiError) {
        // Fallback to local creation
        const newCase: Case = {
          ...caseData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCases(prev => [...prev, newCase]);
        logAction('create', `Case created: ${newCase.subject}`);
      }
      setCurrentPage(redirectPage);
    } catch (error) {
      setError('فشل في إضافة القضية');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Refactored to accept a single object argument for consistency.
  const handleUpdateCase = async (caseData: Partial<Case> & { id: string }) => {
    const { id, ...updateData } = caseData;
    try {
      setLoading(true);
      try {
        const updatedCase = await api.updateCase(id, updateData);
        setCases(prev => prev.map(c => c.id === id ? updatedCase : c));
      } catch (apiError) {
        // Fallback to local update
        setCases(prev => prev.map(c => c.id === id ? { ...c, ...updateData, updatedAt: new Date().toISOString() } : c));
      }
      logAction('update', `Case updated: ${id}`);
      setCurrentPage('cases');
    } catch (error) {
      setError('فشل في تحديث بيانات القضية');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القضية؟')) {
      try {
        setLoading(true);
        try {
          await api.deleteCase(id);
        } catch (apiError) {
          // Fallback to local deletion
          console.log('API not available, deleting locally');
        }
        setCases(prev => prev.filter(c => c.id !== id));
        logAction('delete', `Case deleted: ${id}`);
      } catch (error) {
        setError('فشل في حذف القضية');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} cases={cases} onPageChange={handlePageChange} />;
      case 'add-client':
        // ✅ FIX: Passed the new handleSaveClientAndAddCase function to the component.
        return <AddClient onAddClient={handleAddClient} onSaveAndAddCase={handleSaveClientAndAddCase} />;
      case 'clients':
        return <ClientsList 
          clients={clients} 
          cases={cases}
          onEditClient={(client) => {
            setSelectedClient(client);
            setCurrentPage('edit-client');
          }}
          onDeleteClient={handleDeleteClient}
          onViewClient={(client) => {
            setSelectedClient(client);
            setCurrentPage('view-client');
          }}
          onPrintClient={(client) => {
            // TODO: Implement print functionality
            console.log('Print client:', client);
          }}
        />;
      case 'edit-client':
        // ✅ FIX: Simplified the onUpdateClient prop call.
        return selectedClient ? <EditClient client={selectedClient} onUpdateClient={handleUpdateClient} onClose={() => setCurrentPage('clients')} /> : <div>لم يتم اختيار موكل</div>;
      case 'view-client':
        return selectedClient ? <ClientDetailView 
          client={selectedClient} 
          cases={cases.filter(c => c.clientId === selectedClient.id)} 
          onAddCase={(clientId) => {
            setCurrentPage(`add-case-${clientId}`);
          }}
          onEditCase={(caseData) => {
            setSelectedCase(caseData);
            setCurrentPage('edit-case');
          }}
          onDeleteCase={handleDeleteCase}
        /> : <div>لم يتم اختيار موكل</div>;
      case 'add-case':
        return (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">إضافة قضية جديدة</h2>
              <p className="text-slate-600">اختر موكل لإضافة قضية له</p>
            </div>
            
            {clients.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setCurrentPage(`add-case-${client.id}`);
                      }}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-right"
                    >
                      <h3 className="font-medium text-slate-800">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="text-sm text-slate-600">{client.phoneNumber}</p>
                      <p className="text-xs text-slate-500">
                        {cases.filter(c => c.clientId === client.id).length} قضية
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-slate-500 mb-4">لا يوجد موكلون لإضافة قضية لهم</p>
                <button
                  onClick={() => setCurrentPage('add-client')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة موكل أولاً
                </button>
              </div>
            )}
          </div>
        );
      case 'cases':
        return <CasesList 
          cases={cases} 
          clients={clients}
          onViewClient={(client) => {
            setSelectedClient(client);
            setCurrentPage('view-client');
          }}
        />;
      case 'edit-case':
        // ✅ FIX: Simplified the onUpdateCase prop call.
        return selectedCase ? <EditCase caseData={selectedCase} onUpdateCase={handleUpdateCase} onClose={() => setCurrentPage('cases')} /> : <div>لم يتم اختيار قضية</div>;
      case 'legal-texts':
        return <LegalTexts />;
      case 'reports':
        return <Reports clients={clients} cases={cases} />;
      case 'export':
        return <ExportData clients={clients} cases={cases} />;
      case 'settings':
        return <Settings clients={clients} cases={cases} setClients={setClients} setCases={setCases} />;
      default:
        // Handle dynamic add-case with client ID
        if (currentPage.startsWith('add-case-')) {
          const clientId = currentPage.replace('add-case-', '');
          const clientForCase = clients.find(c => c.id === clientId);
          if (clientForCase) {
            return <AddCase 
              clientId={clientId} 
              // ✅ FIX: Improved navigation to return to the client detail view,
              // which is a more intuitive user experience.
              onClose={() => {
                setSelectedClient(clientForCase);
                setCurrentPage('view-client');
              }}
              onSaveCase={(data) => {
                setSelectedClient(clientForCase);
                handleAddCase(data, 'view-client');
              }}
            />;
          }
          return <div>Client not found</div>;
        }
        return <Dashboard clients={clients} cases={cases} onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>جاري التحميل...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;