import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const defaultData = {
  clients: [],
  cases: [],
  legalTexts: [],
  auditLogs: []
};

const db = new Low(adapter, defaultData);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
async function initializeDatabase() {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
}

// Helper function to generate ID
const generateId = () => Date.now().toString();

// Helper function to add timestamps
const addTimestamps = (data) => ({
  ...data,
  id: data.id || generateId(),
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Clients routes
app.get('/api/clients', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.clients || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    await db.read();
    const newClient = addTimestamps(req.body);
    db.data.clients.push(newClient);
    await db.write();
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    await db.read();
    const clientId = req.params.id;
    const clientIndex = db.data.clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const updatedClient = {
      ...db.data.clients[clientIndex],
      ...req.body,
      id: clientId,
      updatedAt: new Date().toISOString()
    };
    
    db.data.clients[clientIndex] = updatedClient;
    await db.write();
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    await db.read();
    const clientId = req.params.id;
    const clientIndex = db.data.clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Also delete related cases
    db.data.cases = db.data.cases.filter(c => c.clientId !== clientId);
    db.data.clients.splice(clientIndex, 1);
    await db.write();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// Cases routes
app.get('/api/cases', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.cases || []);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

app.post('/api/cases', async (req, res) => {
  try {
    await db.read();
    const newCase = addTimestamps(req.body);
    db.data.cases.push(newCase);
    await db.write();
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

app.put('/api/cases/:id', async (req, res) => {
  try {
    await db.read();
    const caseId = req.params.id;
    const caseIndex = db.data.cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    const updatedCase = {
      ...db.data.cases[caseIndex],
      ...req.body,
      id: caseId,
      updatedAt: new Date().toISOString()
    };
    
    db.data.cases[caseIndex] = updatedCase;
    await db.write();
    res.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ error: 'Failed to update case' });
  }
});

app.delete('/api/cases/:id', async (req, res) => {
  try {
    await db.read();
    const caseId = req.params.id;
    const caseIndex = db.data.cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    db.data.cases.splice(caseIndex, 1);
    await db.write();
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

// Legal texts routes
app.get('/api/legal-texts', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.legalTexts || []);
  } catch (error) {
    console.error('Error fetching legal texts:', error);
    res.status(500).json({ error: 'Failed to fetch legal texts' });
  }
});

app.post('/api/legal-texts', async (req, res) => {
  try {
    await db.read();
    const newLegalText = addTimestamps(req.body);
    db.data.legalTexts.push(newLegalText);
    await db.write();
    res.status(201).json(newLegalText);
  } catch (error) {
    console.error('Error creating legal text:', error);
    res.status(500).json({ error: 'Failed to create legal text' });
  }
});

app.put('/api/legal-texts/:id', async (req, res) => {
  try {
    await db.read();
    const legalTextId = req.params.id;
    const legalTextIndex = db.data.legalTexts.findIndex(lt => lt.id === legalTextId);
    
    if (legalTextIndex === -1) {
      return res.status(404).json({ error: 'Legal text not found' });
    }
    
    const updatedLegalText = {
      ...db.data.legalTexts[legalTextIndex],
      ...req.body,
      id: legalTextId,
      updatedAt: new Date().toISOString()
    };
    
    db.data.legalTexts[legalTextIndex] = updatedLegalText;
    await db.write();
    res.json(updatedLegalText);
  } catch (error) {
    console.error('Error updating legal text:', error);
    res.status(500).json({ error: 'Failed to update legal text' });
  }
});

app.delete('/api/legal-texts/:id', async (req, res) => {
  try {
    await db.read();
    const legalTextId = req.params.id;
    const legalTextIndex = db.data.legalTexts.findIndex(lt => lt.id === legalTextId);
    
    if (legalTextIndex === -1) {
      return res.status(404).json({ error: 'Legal text not found' });
    }
    
    db.data.legalTexts.splice(legalTextIndex, 1);
    await db.write();
    res.json({ message: 'Legal text deleted successfully' });
  } catch (error) {
    console.error('Error deleting legal text:', error);
    res.status(500).json({ error: 'Failed to delete legal text' });
  }
});

// Audit logs routes
app.get('/api/audit-logs', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.auditLogs || []);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

app.post('/api/audit-logs', async (req, res) => {
  try {
    await db.read();
    const newAuditLog = addTimestamps(req.body);
    db.data.auditLogs.push(newAuditLog);
    await db.write();
    res.status(201).json(newAuditLog);
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
});

// Search routes
app.get('/api/search', async (req, res) => {
  try {
    await db.read();
    const { q, type } = req.query;
    
    if (!q) {
      return res.json([]);
    }
    
    let results = [];
    
    if (!type || type === 'clients') {
      const clientResults = db.data.clients.filter(client => 
        client.firstName.toLowerCase().includes(q.toLowerCase()) ||
        client.lastName.toLowerCase().includes(q.toLowerCase()) ||
        client.documentNumber.includes(q)
      );
      results = [...results, ...clientResults.map(client => ({ ...client, type: 'client' }))];
    }
    
    if (!type || type === 'cases') {
      const caseResults = db.data.cases.filter(caseItem => 
        caseItem.subject.toLowerCase().includes(q.toLowerCase()) ||
        caseItem.caseNumber.includes(q) ||
        caseItem.details.toLowerCase().includes(q.toLowerCase())
      );
      results = [...results, ...caseResults.map(caseItem => ({ ...caseItem, type: 'case' }))];
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Statistics route
app.get('/api/stats', async (req, res) => {
  try {
    await db.read();
    const stats = {
      totalClients: db.data.clients.length,
      totalCases: db.data.cases.length,
      totalLegalTexts: db.data.legalTexts.length,
      recentClients: db.data.clients
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      recentCases: db.data.cases
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Database initialized with ${db.data.clients.length} clients and ${db.data.cases.length} cases`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();