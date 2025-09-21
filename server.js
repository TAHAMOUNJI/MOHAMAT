import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const defaultData = { clients: [], cases: [] };
const db = new Low(adapter, defaultData);

await db.read();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateClient = (req, res, next) => {
  const { firstName, lastName, fatherName, motherFirstName, motherLastName, phoneNumber } = req.body;
  
  if (!firstName || !lastName || !fatherName || !motherFirstName || !motherLastName || !phoneNumber) {
    return res.status(400).json({ error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' });
  }
  
  next();
};

const validateCase = (req, res, next) => {
  const { clientId, caseNumber, subject, level, court, section } = req.body;
  
  if (!clientId || !caseNumber || !subject || !level || !court || !section) {
    return res.status(400).json({ error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' });
  }
  
  next();
};
const port = 3001;

// Client routes
app.get('/api/clients', asyncHandler(async (req, res) => {
  try {
    await db.read();
    res.json(db.data.clients || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'فشل في جلب بيانات الموكلين' });
  }
}));

app.post('/api/clients', validateClient, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const client = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!db.data.clients) {
      db.data.clients = [];
    }
    
    db.data.clients.push(client);
    await db.write();
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'فشل في إنشاء الموكل' });
  }
}));

app.get('/api/clients/:id', asyncHandler(async (req, res) => {
  try {
    await db.read();
    const client = db.data.clients?.find(c => c.id === req.params.id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'الموكل غير موجود' });
    }
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'فشل في جلب بيانات الموكل' });
  }
}));

app.put('/api/clients/:id', validateClient, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const clientIndex = db.data.clients?.findIndex(c => c.id === req.params.id);
    if (clientIndex !== undefined && clientIndex > -1) {
      db.data.clients[clientIndex] = { 
        ...db.data.clients[clientIndex], 
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      await db.write();
      res.json(db.data.clients[clientIndex]);
    } else {
      res.status(404).json({ error: 'الموكل غير موجود' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'فشل في تحديث الموكل' });
  }
}));

app.delete('/api/clients/:id', asyncHandler(async (req, res) => {
  try {
    await db.read();
    const clientIndex = db.data.clients?.findIndex(c => c.id === req.params.id);
    if (clientIndex !== undefined && clientIndex > -1) {
      db.data.clients.splice(clientIndex, 1);
      // Also delete related cases
      if (db.data.cases) {
        db.data.cases = db.data.cases.filter(c => c.clientId !== req.params.id);
      }
      await db.write();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'الموكل غير موجود' });
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'فشل في حذف الموكل' });
  }
}));
});

// Case routes
app.get('/api/cases', asyncHandler(async (req, res) => {
  try {
    await db.read();
    res.json(db.data.cases || []);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'فشل في جلب بيانات القضايا' });
  }
}));

app.post('/api/cases', validateCase, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const newCase = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!db.data.cases) {
      db.data.cases = [];
    }
    
    db.data.cases.push(newCase);
    await db.write();
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'فشل في إنشاء القضية' });
  }
}));

app.get('/api/cases/:id', asyncHandler(async (req, res) => {
  try {
    await db.read();
    const foundCase = db.data.cases?.find(c => c.id === req.params.id);
    if (foundCase) {
      res.json(foundCase);
    } else {
      res.status(404).json({ error: 'القضية غير موجودة' });
    }
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ error: 'فشل في جلب بيانات القضية' });
  }
}));

app.put('/api/cases/:id', validateCase, asyncHandler(async (req, res) => {
  try {
    await db.read();
    const caseIndex = db.data.cases?.findIndex(c => c.id === req.params.id);
    if (caseIndex !== undefined && caseIndex > -1) {
      db.data.cases[caseIndex] = { 
        ...db.data.cases[caseIndex], 
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      await db.write();
      res.json(db.data.cases[caseIndex]);
    } else {
      res.status(404).json({ error: 'القضية غير موجودة' });
    }
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ error: 'فشل في تحديث القضية' });
  }
}));

app.delete('/api/cases/:id', asyncHandler(async (req, res) => {
  try {
    await db.read();
    const caseIndex = db.data.cases?.findIndex(c => c.id === req.params.id);
    if (caseIndex !== undefined && caseIndex > -1) {
      db.data.cases.splice(caseIndex, 1);
      await db.write();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'القضية غير موجودة' });
    }
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ error: 'فشل في حذف القضية' });
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Statistics endpoint
app.get('/api/stats', asyncHandler(async (req, res) => {
  try {
    await db.read();
    const stats = {
      totalClients: db.data.clients?.length || 0,
      totalCases: db.data.cases?.length || 0,
      clientsWithCases: db.data.clients?.filter(client => 
        db.data.cases?.some(c => c.clientId === client.id)
      ).length || 0
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'فشل في جلب الإحصائيات' });
  }
}));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'خطأ في الخادم',
    message: process.env.NODE_ENV === 'development' ? error.message : 'حدث خطأ غير متوقع'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'المسار غير موجود' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
