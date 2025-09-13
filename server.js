import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();

db.data ||= { clients: [], cases: [] };

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3001;

// Client routes
app.get('/api/clients', (req, res) => {
  res.json(db.data.clients);
});

app.post('/api/clients', async (req, res) => {
  const client = req.body;
  client.id = Date.now().toString();
  db.data.clients.push(client);
  await db.write();
  res.json(client);
});

app.get('/api/clients/:id', (req, res) => {
  const client = db.data.clients.find(c => c.id === req.params.id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).send('Client not found');
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const clientIndex = db.data.clients.findIndex(c => c.id === req.params.id);
  if (clientIndex > -1) {
    db.data.clients[clientIndex] = { ...db.data.clients[clientIndex], ...req.body };
    await db.write();
    res.json(db.data.clients[clientIndex]);
  } else {
    res.status(404).send('Client not found');
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const clientIndex = db.data.clients.findIndex(c => c.id === req.params.id);
  if (clientIndex > -1) {
    db.data.clients.splice(clientIndex, 1);
    await db.write();
    res.status(204).send();
  } else {
    res.status(404).send('Client not found');
  }
});

// Case routes
app.get('/api/cases', (req, res) => {
  res.json(db.data.cases);
});

app.post('/api/cases', async (req, res) => {
  const newCase = req.body;
  newCase.id = Date.now().toString();
  db.data.cases.push(newCase);
  await db.write();
  res.json(newCase);
});

app.get('/api/cases/:id', (req, res) => {
    const foundCase = db.data.cases.find(c => c.id === req.params.id);
    if (foundCase) {
        res.json(foundCase);
    } else {
        res.status(404).send('Case not found');
    }
});

app.put('/api/cases/:id', async (req, res) => {
    const caseIndex = db.data.cases.findIndex(c => c.id === req.params.id);
    if (caseIndex > -1) {
        db.data.cases[caseIndex] = { ...db.data.cases[caseIndex], ...req.body };
        await db.write();
        res.json(db.data.cases[caseIndex]);
    } else {
        res.status(404).send('Case not found');
    }
});

app.delete('/api/cases/:id', async (req, res) => {
    const caseIndex = db.data.cases.findIndex(c => c.id === req.params.id);
    if (caseIndex > -1) {
        db.data.cases.splice(caseIndex, 1);
        await db.write();
        res.status(204).send();
    } else {
        res.status(404).send('Case not found');
    }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
